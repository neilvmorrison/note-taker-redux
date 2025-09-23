import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function ProjectList() {
  return (
    <div className="flex flex-col gap-6">
      <Text component="h1" variant="h1">
        Projects
      </Text>
      <Input placeholder="Search Projects..." />
    </div>
  );
}
