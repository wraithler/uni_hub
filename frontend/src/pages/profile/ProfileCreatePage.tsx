import Layout from "@/components/core/Layout";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProfileChoices } from '@/api/profile';
import { toast } from 'sonner';
import PageHeader from "@/components/core/PageHeader";
import ProfileCard from "@/components/profile/ProfileCard";
import { useState } from "react";
import api from "@/api/apiClient";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ProfileFormData = {
  gender?: string;
  hobbies?: string;
  bio?: string;
  website_url?: string;
  github_url?: string;
  linkedin_url?: string;
};

export default function ProfileCreatePage() {
  const { data: profileChoices } = useProfileChoices();
  const { user, token } = useAuth();
  const [updatedProfile, setUpdatedProfile] = useState<ProfileFormData>({});

  const handleChange = (key: keyof ProfileFormData, value: string) => {
    const urlFields = ["website_url", "github_url", "linkedin_url"];
    if (urlFields.includes(key) && value && !/^https?:\/\//i.test(value)) {
      value = "http://" + value;
    }
    setUpdatedProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <main className="max-w-2xl w-full mx-auto px-4 py-10 space-y-6">
        <PageHeader
          title="Create Your Profile"
          description="Please provide some details to get started."
        />

        <ProfileCard
          profile={{
            first_name: user?.first_name ?? "User",
            gender: updatedProfile.gender || "",
            hobbies: updatedProfile.hobbies || "",
            bio: updatedProfile.bio || "",
            website_url: updatedProfile.website_url || "",
            github_url: updatedProfile.github_url || "",
            linkedin_url: updatedProfile.linkedin_url || "",
          }}
          onEdit={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        />

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Gender */}
            <div>
              <label className="block mb-1 text-sm font-medium">Gender</label>
              <Select
                value={updatedProfile.gender}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {profileChoices && Object.entries(profileChoices.gender_choices).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hobbies */}
            <div>
              <label className="block mb-1 text-sm font-medium">Hobbies</label>
              <Select
                value={updatedProfile.hobbies}
                onValueChange={(value) => handleChange("hobbies", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hobbies" />
                </SelectTrigger>
                <SelectContent>
                  {profileChoices && Object.entries(profileChoices.hobby_choices).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium">Bio</label>
              <Textarea
                value={updatedProfile.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Website */}
            <div>
              <label className="block mb-1 text-sm font-medium">Website</label>
              <Input
                type="url"
                value={updatedProfile.website_url}
                onChange={(e) => handleChange("website_url", e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="block mb-1 text-sm font-medium">GitHub</label>
              <Input
                type="url"
                value={updatedProfile.github_url}
                onChange={(e) => handleChange("github_url", e.target.value)}
                placeholder="https://github.com/yourusername"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block mb-1 text-sm font-medium">LinkedIn</label>
              <Input
                type="url"
                value={updatedProfile.linkedin_url}
                onChange={(e) => handleChange("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={async (e) => {
                e.preventDefault();
                if (!updatedProfile.gender) {
                  toast.error("Please select a gender");
                  return;
                }
                try {
                  await api.post('/profile/create/', { ...updatedProfile, user_id: user?.id }, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  toast.success("Profile created successfully!");
                } catch (err: any) {
                  const message =
                    err?.response?.data?.detail ||
                    err?.response?.data?.gender?.[0] ||
                    "Failed to create profile";
                  toast.error(message);
                  console.error(err);
                }
              }}
              className="bg-black hover:bg-neutral-800"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </main>
    </Layout>
  );
}