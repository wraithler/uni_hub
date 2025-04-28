import Layout from "@/components/core/Layout";
import { useProfile, useUpdateProfile, useCreateProfile, useProfileChoices } from '@/api/profile';
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from 'sonner';
import api from "@/api/apiClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Search, Filter, User } from "lucide-react";
import PageHeader from "@/components/core/PageHeader";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileRow from "@/components/profile/ProfileRow";

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
  const { user, isLoading: authLoading } = useAuth();
  const { data: profileChoices } = useProfileChoices();
  const { data: profile, isLoading: profileLoading, error } = useProfile({ enabled: !!user && !authLoading });
  const [formData, setFormData] = useState<ProfileFormData>({});
  const [dirtyFields, setDirtyFields] = useState<Set<keyof ProfileFormData>>(new Set());

  const isLoading = authLoading || profileLoading;

  useEffect(() => {
    if (user && !authLoading) {
      api.get('/profile/')
        .then(response => setFormData(response.data))
        .catch(error => {
          toast.error("Failed to load profile");
          console.error(error);
        });
    }
  }, [user, authLoading]);

  const handleChange = (key: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setDirtyFields(prev => new Set(prev).add(key));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      const changes = Array.from(dirtyFields).reduce((acc, key) => {
        acc[key] = formData[key];
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(changes).length === 0) {
        toast.info("No changes to save");
        return;
      }

      await api.patch('/profile/', changes);
      toast.success("Profile updated successfully!");
      setDirtyFields(new Set());
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const rows: RowItem[] = [
    { id: 1, label: "Gender", key: "gender", value: formData.gender || "", options: profileChoices ? Object.entries(profileChoices.gender_choices) : [], inputType: 'select' },
    { id: 2, label: "Hobbies", key: "hobbies", value: formData.hobbies || "", options: profileChoices ? Object.entries(profileChoices.hobby_choices) : [], inputType: 'select' },
    { id: 3, label: "Bio", key: "bio", value: formData.bio || "", inputType: 'textarea' },
    { id: 4, label: "Website", key: "website_url", value: formData.website_url || "", inputType: 'input' },
    { id: 5, label: "GitHub", key: "github_url", value: formData.github_url || "", inputType: 'input' },
    { id: 6, label: "LinkedIn", key: "linkedin_url", value: formData.linkedin_url || "", inputType: 'input' },
  ];

  const hasChanges = dirtyFields.size > 0;

  if (isLoading) {
    return (
      <Layout>
        <main className="container px-4 py-6 mx-auto">
          <PageHeader
            title="Profile"
            description="Update your basic information and links"
          />
          <Spinner className="mt-8" />
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto space-y-10">
        {/* Page header */}
        <PageHeader
          title={`Welcome, ${user?.first_name ?? user?.subject ?? user?.email ?? "User"}`}
          description="Update your profile details and social links."
        />

        {/* Profile Card Preview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Profile Preview</h2>
          <ProfileCard
            profile={{
              first_name: user?.first_name ?? "User",
              gender: formData.gender || "",
              hobbies: formData.hobbies || "",
              bio: formData.bio || "",
              website_url: formData.website_url || "",
              github_url: formData.github_url || "",
              linkedin_url: formData.linkedin_url || "",
            }}
            onEdit={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          />
        </div>

        {/* Editable Fields */}
        <div className="mb-8 space-y-6">
          <h2 className="text-xl font-semibold">Edit Your Information</h2>
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
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className={hasChanges ? "bg-black hover:bg-neutral-800" : "bg-gray-400 cursor-not-allowed"}
            >
              Save Changes
            </Button>
          </div>
        </div>

      </main>
    </Layout>
  );
}