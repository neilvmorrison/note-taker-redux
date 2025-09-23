import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function NoteList() {
  return (
    <div className="flex flex-col gap-6">
      <Text component="h1" variant="h1">
        Notes
      </Text>
      <Input placeholder="Search Notes..." />
    </div>
  );
}
