import { cn } from "@/lib/utils";
import Icon, { IconNames } from "./icons";

interface IIconButtonProps {
  icon: IconNames;
  onClick: () => void;
  className?: string;
}

export default function IconButton({
  icon,
  onClick,
  className,
  ...props
}: IIconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm cursor-pointer",
        className
      )}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
