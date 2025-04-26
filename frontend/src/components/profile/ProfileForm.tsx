// src/components/profile/ProfileForm.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

interface Profile {
  gender?: string;
  hobbies?: string;
  bio?: string;
  website_url?: string;
  github_url?: string;
  linkedin_url?: string;
}

interface ProfileFormProps {
  initialProfile: Profile;
  onSubmit: (updatedProfile: Profile) => void;
}

export default function ProfileForm({ initialProfile, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState<Profile>(initialProfile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="gender"
        value={formData.gender || ""}
        onChange={handleChange}
        placeholder="Gender"
      />
      <Input
        name="hobbies"
        value={formData.hobbies || ""}
        onChange={handleChange}
        placeholder="Hobbies"
      />
      <Input
        name="bio"
        value={formData.bio || ""}
        onChange={handleChange}
        placeholder="Bio"
      />
      <Input
        name="website_url"
        value={formData.website_url || ""}
        onChange={handleChange}
        placeholder="Website URL"
      />
      <Input
        name="github_url"
        value={formData.github_url || ""}
        onChange={handleChange}
        placeholder="GitHub URL"
      />
      <Input
        name="linkedin_url"
        value={formData.linkedin_url || ""}
        onChange={handleChange}
        placeholder="LinkedIn URL"
      />
      <Button type="submit">Save Changes</Button>
    </form>
  );
}