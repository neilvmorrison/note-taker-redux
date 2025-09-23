import Icon from "./ui/icons";
import { Text } from "./ui/text";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Icon name="close" />
      <Text component="h2" variant="h2">
        Nothing to see here!
      </Text>
      <Text>There are currently no records to display</Text>
    </div>
  );
}
