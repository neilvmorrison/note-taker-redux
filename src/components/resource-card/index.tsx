import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Text } from "../ui/text";
import { format } from "date-fns";
import Icon, { IconNames } from "../ui/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface IResourceCardProps {
  title: string;
  description: string;
  type: "note" | "project" | "chat";
  timestamp?: string;
  href: string;
  icon?: IconNames;
  className?: string;
}

export function ResourceCard({
  title,
  description,
  type,
  timestamp,
  href,
  icon,
  className,
}: IResourceCardProps) {
  function getIconName(): IconNames | undefined {
    if (icon) {
      return icon;
    }
    if (type === "note") {
      return "note";
    }
    if (type === "project") {
      return "project";
    }
    if (type === "chat") {
      return "chat";
    }
    return undefined;
  }
  const iconName = getIconName();
  return (
    <Card
      className={cn(
        "w-full cursor-pointer hover:border-primary/50 transition-colors",
        className
      )}
    >
      <Link href={href}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {title}
            {iconName && <Icon name={iconName} size={20} />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text dimmed className="text-sm">
            {description}
          </Text>
          <Text dimmed className="text-sm">
            {timestamp && format(timestamp, "dd MMM, yyyy, HH:mm")}
          </Text>
        </CardContent>
      </Link>
    </Card>
  );
}
