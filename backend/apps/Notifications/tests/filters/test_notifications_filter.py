class NotificationFilterTests(TestCase):
    def setUp(self):
        self.user1 = BaseUserFactory(username="john_doe")
        self.user2 = BaseUserFactory(username="jane_doe")

        now = timezone.now()

        Notification.objects.create(
            recipient=self.user1,
            notification_type="comment",
            is_read=False,
            created_at=now - timedelta(days=3)
        )
        Notification.objects.create(
            recipient=self.user1,
            notification_type="like",
            is_read=True,
            created_at=now - timedelta(days=1)
        )
        Notification.objects.create(
            recipient=self.user2,
            notification_type="follow",
            is_read=False,
            created_at=now
        )

    def test_filter_by_is_read(self):
        filtered = NotificationFilter(
            {"is_read": True},
            queryset=Notification.objects.all()
        ).qs

        self.assertEqual(filtered.count(), 1)
        self.assertTrue(filtered.first().is_read)

    def test_filter_by_notification_type_icontains(self):
        filtered = NotificationFilter(
            {"notification_type": "like"},
            queryset=Notification.objects.all()
        ).qs

        self.assertEqual(filtered.count(), 1)
        self.assertIn("like", filtered.first().notification_type)

    def test_filter_by_recipient_username_icontains(self):
        filtered = NotificationFilter(
            {"recipient__username": "john"},
            queryset=Notification.objects.all()
        ).qs

        self.assertEqual(filtered.count(), 2)
        self.assertTrue(all(n.recipient.username.startswith("john") for n in filtered))

    def test_filter_by_created_at_range(self):
        now = timezone.now()
        start_date = (now - timedelta(days=2)).date()
        end_date = now.date()

        filtered = NotificationFilter(
            {"created_at_after": start_date, "created_at_before": end_date},
            queryset=Notification.objects.all()
        ).qs

        self.assertEqual(filtered.count(), 2)
