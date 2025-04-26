import Layout from "@/components/core/Layout";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProfile, useUpdateProfile, useCreateProfile, useProfileChoices } from '@/api/profile';
import { toast } from 'sonner';
import { ProfileLoading, ProfileError } from "@/components/profile/ProfileLoading";
import ProfileNotFound from "@/components/profile/ProfileNotFound";
import ProfileRow from "@/components/profile/ProfileRow";
import PageHeader from "@/components/core/PageHeader";
import ProfileCard from "@/components/profile/ProfileCard";
import { useState } from "react"; 

type ProfileFormData = {
  gender?: string;
  hobbies?: string;
  bio?: string;
  website_url?: string;
  github_url?: string;
  linkedin_url?: string;
};

type RowItem = {
  id: number;
  label: string;
  key: keyof ProfileFormData;
  value: string;
  options?: [string, string][];
};

export default function ProfileCreatePage() {
  const { data: profileChoices, isLoading, error } = useProfileChoices();
  const createMutation = useCreateProfile();
  const { user } = useAuth();  // Get the logged-in user

  const [updatedProfile, setUpdatedProfile] = useState<ProfileFormData>({});

  const handleSave = (key: keyof ProfileFormData, value: string) => {
    // Auto-fix if it's a URL and missing scheme
    const urlFields = ["website_url", "github_url", "linkedin_url"];
    if (urlFields.includes(key) && value && !/^https?:\/\//i.test(value)) {
      value = "http://" + value;
    }
  
    setUpdatedProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const rows: RowItem[] = [
    {
      id: 1,
      label: "Gender",
      key: "gender",
      value: updatedProfile.gender || "",
      options: profileChoices ? Object.entries(profileChoices.gender_choices) : [],
    },
    {
      id: 2,
      label: "Hobbies",
      key: "hobbies",
      value: updatedProfile.hobbies || "",
      options: profileChoices ? Object.entries(profileChoices.hobby_choices) : [],
    },
    { id: 3, label: "Bio", key: "bio", value: updatedProfile.bio || "" },
    { id: 4, label: "Website", key: "website_url", value: updatedProfile.website_url || "" },
    { id: 5, label: "GitHub", key: "github_url", value: updatedProfile.github_url || "" },
    { id: 6, label: "LinkedIn", key: "linkedin_url", value: updatedProfile.linkedin_url || "" },
  ];

  if (isLoading) {
    return (
      <Layout>
        <main className="max-w-2xl w-full mx-auto px-4 py-10">
          <ProfileLoading />
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="max-w-2xl w-full mx-auto px-4 py-10">
          <ProfileError message={error instanceof Error ? error.message : 'Failed to load profile'} />
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-2xl w-full mx-auto px-4 py-10 space-y-6">
        <PageHeader
          title={`Create Your Profile`}
          description="Please provide some details to get started."
        />

        <ProfileCard
          title="Your Basic Information"
          description="Fill in the fields below. You can update them later anytime."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((row) => (
              <ProfileRow
                key={row.id}
                row={row}
                onSave={handleSave}
                options={row.options}
              />
            ))}
            <div className="col-span-full pt-4">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-black text-white hover:bg-neutral-800 transition"
                onClick={async (e) => {
                  e.preventDefault();

                  if (!updatedProfile.gender) {
                    toast.error("Please select a gender");
                    return;
                  }

                  console.log("📤 Creating profile with:", updatedProfile);

                  try {
                    // Add the logged-in user's ID to the profile creation
                    await createMutation.mutateAsync({
                      ...updatedProfile,
                      user_id: user.id, // Include the user ID here
                    });
                    toast.success("Profile created successfully!");
                  } catch (err: any) {
                    const message =
                      err?.response?.data?.detail ||
                      err?.response?.data?.gender?.[0] || // Optional field-level error
                      "Failed to create profile";
                    toast.error(message);
                    console.error(err);
                  }
                }}
              >
                Save Profile
              </button>
            </div>
          </div>
        </ProfileCard>
      </main>
    </Layout>
  );
}