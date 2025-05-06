import React from "react";

type ListEmptyProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export default function ListEmpty({
  title,
  description,
  icon,
}: ListEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center col-span-3">
      {icon}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
    </div>
  );
}
