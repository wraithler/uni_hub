import { ProfileFormData } from "@/api/profile/profileTypes";

interface FeaturedProfileCardProps {
  profile: ProfileFormData;
  onEdit: () => void;
}

export default function FeaturedProfileCard({ profile }: FeaturedProfileCardProps) {
  return (
    <div>
      <div className="space-y-2 text-sm">
      <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Gender:</strong> {profile.gender}</p>
      <p><strong>Year:</strong> {profile.year_of_study}</p>
      <p><strong>Course:</strong> {profile.course}</p>
      <p><strong>Hobbies:</strong> {profile.hobbies}</p>
      <p><strong>Phone:</strong> {profile.phone_number}</p>
      <p><strong>Student Number:</strong> {profile.student_number}</p>
      <p><strong>GitHub:</strong> <a href={profile.github_url}>{profile.github_url}</a></p>
      <p><strong>LinkedIn:</strong> <a href={profile.linkedin_url}>{profile.linkedin_url}</a></p>
    </div>
    </div>
  );
}