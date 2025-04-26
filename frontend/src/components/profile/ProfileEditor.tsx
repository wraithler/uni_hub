import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  keyName: string;
  value: string;
  onChange: (val: string) => void;
  onSave: () => void;
};

export default function ProfileEditor({ keyName, value, onChange, onSave }: Props) {
  return (
    <div className="mt-4 space-y-2">
      {(keyName === "gender" || keyName === "hobbies") ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-input bg-background px-3 py-2 rounded-md"
        >
          {/* Add options here */}
        </select>
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={keyName} />
      )}
      <Button onClick={onSave}>Save</Button>
    </div>
  );
}