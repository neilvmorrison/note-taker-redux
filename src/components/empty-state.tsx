import Icon, { IconNames } from "./ui/icons";
import { Text } from "./ui/text";
import { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title = "Nothing to see here!",
  description = "There are currently no records to display",
  icon = "close",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-2 border border-dashed rounded-lg">
      <Icon
        name={icon as IconNames}
        className="h-12 w-12 text-muted-foreground"
      />
      <div className="flex flex-col items-center justify-center">
        <Text component="h2" variant="h2">
          {title}
        </Text>
        <Text className="text-gray-400">{description}</Text>
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
