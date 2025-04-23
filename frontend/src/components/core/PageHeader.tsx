import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  button?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  button,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {button}
    </div>
  );
}
