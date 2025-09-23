import ChatInit from "@/components/chat-init";
import { Text } from "@/components/ui/text";

export default function Page() {
  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="min-w-[480px] text-center flex flex-col gap-3">
        <Text variant="h2">What are we doing today?</Text>
        <Text>Type below to get started</Text>
        <ChatInit />
      </div>
    </div>
  );
}
