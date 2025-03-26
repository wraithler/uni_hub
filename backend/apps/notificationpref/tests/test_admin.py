from django.test import TestCase, RequestFactory
from django.contrib.admin.sites import AdminSite
from django.contrib.auth import get_user_model
from apps.notificationpref.models import UserNotificationPreference
from apps.communities.models import Community, CommunityCategory 
from apps.notificationpref.admin import UserNotificationPreferenceAdmin
from django.core.exceptions import ValidationError



class UserNotificationPreferenceAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = UserNotificationPreferenceAdmin(UserNotificationPreference, self.site)
        self.factory = RequestFactory()

        User = get_user_model()

        self.superuser = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password',
            first_name='Admin',
            last_name='User'
        )
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='password',
            first_name='Test',
            last_name='User1'
        )

        self.category, _ = CommunityCategory.objects.get_or_create(name='General')

  
        self.community1 = Community.objects.create(
            name='Community 1',
            created_by=self.superuser,
            category=self.category 
        )

     
        self.pref1, created = UserNotificationPreference.objects.get_or_create(
            user=self.user1,
            defaults={'event_updates': True}
        )
        self.pref1.subscribed_communities.add(self.community1)

    def test_list_display(self):
        self.assertEqual(
            self.admin.list_display,
            (
                "display_username",
                "event_updates",
                "post_notifications",
                "announcements",
                "email_notifications",
                "in_app_notifications",
            )
        )

    def test_display_username(self):
        self.assertEqual(self.admin.display_username(self.pref1), 'user1')
        self.assertEqual(self.admin.display_username.short_description, 'Username')

    def test_search_fields(self):
        self.assertEqual(self.admin.search_fields, ("user__username",))

    def test_list_filter(self):
        self.assertEqual(
            self.admin.list_filter,
            (
                "event_updates",
                "post_notifications",
                "announcements",
                "email_notifications",
                "in_app_notifications"
            )
        )

    def test_fieldsets(self):
        self.assertEqual(
            self.admin.fieldsets,
            (
                (None, {"fields": ("user", "subscribed_communities")}),
                ("Notification Preferences", {
                    "fields": (
                        "event_updates",
                        "post_notifications",
                        "announcements",
                        "email_notifications",
                        "in_app_notifications",
                    )
                }),
            )
        )


    def test_autocomplete_fields(self):
        self.assertEqual(self.admin.autocomplete_fields, ("user",))

   
    def save_model(self, request, obj, form, change):
        if not change and UserNotificationPreference.objects.filter(user=obj.user).exists():
            raise ValidationError(f"A notification preference already exists for user {obj.user}.")
        
        if obj.user is None:
            obj.user = request.user
 
        super().save_model(request, obj, form, change)

    def test_filter_horizontal(self):
        """Check filter_horizontal settings"""
        self.assertEqual(self.admin.filter_horizontal, ("subscribed_communities",))

    def test_get_search_results(self):
        """Ensure get_search_results filters correctly"""
        request = self.factory.get('/admin/?q=user1')
        queryset = self.admin.get_queryset(request)
        results, _ = self.admin.get_search_results(request, queryset, 'user1')
        self.assertEqual(results.count(), 1)
        self.assertEqual(results.first().user.username, 'user1')

    def test_get_list_display(self):
        request = self.factory.get('/admin/')
        request.user = self.superuser
        self.assertEqual(self.admin.get_list_display(request), self.admin.list_display)

    def test_formfield_for_manytomany(self):
        request = self.factory.get('/admin/')
        field = self.admin.formfield_for_manytomany(
            UserNotificationPreference._meta.get_field('subscribed_communities'),
            request
        )
        self.assertEqual(field.help_text, "")

    def test_actions(self):
        request = self.factory.get('/admin/')
        actions = self.admin.get_actions(request)
        self.assertIn('disable_notifications', actions)
        self.assertIn('turn_on_notifications', actions)
        self.assertNotIn('delete_selected', actions)

    def test_has_delete_permission(self):
        request = self.factory.get('/admin/')
        self.assertFalse(self.admin.has_delete_permission(request))
