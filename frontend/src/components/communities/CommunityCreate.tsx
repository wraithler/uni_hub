import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

export default function CommunityCreate() {
  return (
    <div className="mt-8 mb-8 bg-slate-100 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold mb-2">Start Your Own Community</h3>
        <p className="text-muted-foreground">
          Have a unique interest? Create a community and connect with
          like-minded students.
        </p>
      </div>
      <Button size="lg" className="whitespace-nowrap" asChild>
        <Link to="/communities/create">Create Community</Link>
      </Button>
    </div>
  );
}
