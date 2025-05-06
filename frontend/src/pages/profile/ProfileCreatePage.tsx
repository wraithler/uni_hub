import Layout from "@/components/core/Layout";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProfileChoices } from '@/api/profile';
import PageHeader from "@/components/core/PageHeader";
import ProfileCreateForm from "@/components/profile/ProfileCreateForm";

export default function ProfileCreatePage() {
  const { data: profileChoices } = useProfileChoices();
  const { user, token } = useAuth();

  const handleChange = (key: string, value: string) => {
    const urlFields = ["website_url", "github_url", "linkedin_url"];
    if (urlFields.includes(key) && value && !/^https?:\/\//i.test(value)) {
      value = "http://" + value;
    }
  };

  return (
    <Layout>
      <main className="max-w-2xl w-full mx-auto px-4 py-10 space-y-6">
        <PageHeader
          title="Create Your Profile"
          description="Please provide some details to get started."
        />

        <ProfileCreateForm />
      </main>
    </Layout>
  );
}