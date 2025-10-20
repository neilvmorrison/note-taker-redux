import { app_name } from "@/constants";
import Icon from "./ui/icons";
import { Text } from "./ui/text";
import Link from "next/link";

interface ILogoProps {
  asLink?: boolean;
}

export default function Logo({ asLink = false }: ILogoProps) {
  const Component = asLink ? Link : "div";
  return (
    <Component className="flex items-center gap-2" href="/">
      <Icon name="logo" />
      <Text variant="h1" className="text-lg">
        {app_name}
      </Text>
    </Component>
  );
}
