"use client";
import { useRouter } from "next/navigation";
import { Text } from "./ui/text";
import IconButton from "./ui/icon-button";
import { ReactNode } from "react";

interface IPageHeaderProps {
  title: string;
  children?: ReactNode;
  right_section?: ReactNode;
  description?: string;
}

export default function PageHeader({
  title,
  children,
  right_section,
  description,
}: IPageHeaderProps) {
  const { back } = useRouter();

  return (
    <div className="flex justify-between items-start">
      <div className="flex items-start gap-3">
        <IconButton icon="chevron_left" onClick={back} />
        {children || (
          <div>
            <Text variant="h1">{title}</Text>
            {description && <Text dimmed>{description}</Text>}
          </div>
        )}
      </div>
      {right_section || null}
    </div>
  );
}
