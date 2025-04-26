import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileRowProps {
  row: {
    label: string;
    key: string;
    value: string;
  };
  onChange: (key: string, value: string) => void; // Change this to handle change
  options?: [string, string][]; 
}

export default function ProfileRow({ row, onChange, options }: ProfileRowProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(row.key, e.target.value); // Pass the key and value to update the parent state
  };

  const renderSelect = (options: [string, string][]) => {
    return (
      <select
        value={row.value}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full text-sm"
      >
        <option value="">Select...</option>
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="space-y-1">
      <Label>{row.label}</Label>
      {options ? renderSelect(options) : <Input value={row.value} onChange={handleChange} />}
    </div>
  );
}