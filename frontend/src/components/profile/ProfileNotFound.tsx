import { Button } from "@/components/ui/button";

export default function ProfileNotFound({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-muted-foreground">No profile found. Please create one.</p>
      <Button onClick={onCreate}>Create Profile</Button>
    </div>
  );
}