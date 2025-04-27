import Layout from "@/components/core/Layout";
import { useProfile, useUpdateProfile, useCreateProfile, useProfileChoices } from '@/api/profile';
import { toast } from 'sonner';
import { ProfileLoading, ProfileError } from "@/components/profile/ProfileLoading";
import ProfileNotFound from "@/components/profile/ProfileNotFound";
import ProfileRow from "@/components/profile/ProfileRow";
import PageHeader from "@/components/core/PageHeader";
import ProfileCard from "@/components/profile/ProfileCard";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider.tsx";

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
  inputType?: 'select' | 'input' | 'textarea';
};

export default function ProfilePage() {
  const { data: profileChoices } = useProfileChoices();
  const updateMutation = useUpdateProfile();
  const createMutation = useCreateProfile();
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useProfile(user?.id); 
  const [formData, setFormData] = useState<ProfileFormData>({});
  const [dirtyFields, setDirtyFields] = useState<Set<keyof ProfileFormData>>(new Set());

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setDirtyFields(new Set()); // Reset dirty fields when profile loads
    }
  }, [profile]);

  const handleChange = (key: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
    setDirtyFields(prev => new Set(prev).add(key));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      // Only send the fields that have been changed
      const changes = Array.from(dirtyFields).reduce((acc, key) => {
        acc[key] = formData[key];
        return acc;
      }, {} as Partial<ProfileFormData>);

      if (Object.keys(changes).length === 0) {
        toast.info("No changes to save");
        return;
      }

      const payload = { userId: user.id, ...changes };
      console.log("🔵 Sending payload to backend:", payload);
      await updateMutation.mutateAsync(payload);
      setDirtyFields(new Set()); // Reset dirty fields after successful save
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
      console.error("❌ Failed to update profile:", err);
    }
  };

  if (isLoading) {
    return <Layout><main className="max-w-2xl w-full mx-auto px-4 py-10"><ProfileLoading /></main></Layout>;
  }

  if (error) {
    return <Layout><main className="max-w-2xl w-full mx-auto px-4 py-10"><ProfileError message={error instanceof Error ? error.message : 'Failed to load profile'} /></main></Layout>;
  }

  if (!profile) {
    return (
      <Layout>
        <main className="max-w-2xl w-full mx-auto px-4 py-10">
          <ProfileNotFound
            onCreate={async () => {
              try {
                await createMutation.mutateAsync({});
                toast.success("Profile created!");
              } catch (err) {
                toast.error("Failed to create profile");
                console.error("❌ Failed to create profile:", err);
              }
            }}
          />
        </main>
      </Layout>
    );
  }

  const rows: RowItem[] = [
    {
      id: 1,
      label: "Gender",
      key: "gender",
      value: formData.gender || "",
      options: profileChoices ? Object.entries(profileChoices.gender_choices) : [],
      inputType: 'select'
    },
    {
      id: 2,
      label: "Hobbies",
      key: "hobbies",
      value: formData.hobbies || "",
      options: profileChoices ? Object.entries(profileChoices.hobby_choices) : [],
      inputType: 'select'
    },
    { 
      id: 3, 
      label: "Bio", 
      key: "bio", 
      value: formData.bio || "",
      inputType: 'textarea'
    },
    { 
      id: 4, 
      label: "Website", 
      key: "website_url", 
      value: formData.website_url || "",
      inputType: 'input'
    },
    { 
      id: 5, 
      label: "GitHub", 
      key: "github_url", 
      value: formData.github_url || "",
      inputType: 'input'
    },
    { 
      id: 6, 
      label: "LinkedIn", 
      key: "linkedin_url", 
      value: formData.linkedin_url || "",
      inputType: 'input'
    },
  ];

  const hasChanges = dirtyFields.size > 0;

  return (
    <Layout>
      <main className="max-w-2xl w-full mx-auto px-4 py-10 space-y-6">
        <PageHeader
          title={`Welcome, ${user?.first_name ?? user?.subject ?? user?.email ?? "User"}`}
          description="Please provide some details to get started."
        />

        <ProfileCard
          title="Your Basic Information"
          description="Fill in the fields below. You can update them later anytime."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map(row => (
              <ProfileRow
                key={row.id}
                row={row}
                onChange={handleChange}
                options={row.options}
                inputType={row.inputType}
                isDirty={dirtyFields.has(row.key)}
              />
            ))}
            <div className="col-span-full pt-4 flex justify-end">
              <button
                type="button"
                className={`px-4 py-2 rounded text-white transition ${
                  hasChanges 
                    ? "bg-black hover:bg-neutral-800" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={handleSave}
                disabled={!hasChanges}
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