"use client";
import ChatInit from "@/components/chat-init";
import { Text } from "@/components/ui/text";

export default function Page() {
  return (
    <div className="mt-8 md:mt-12 flex flex-col items-center justify-center px-4 md:px-0">
      <div className="w-full max-w-[480px] text-center flex flex-col gap-3">
        <Text variant="h2" className="text-2xl md:text-3xl">
          What are we doing today?
        </Text>
        <Text>Type below to get started</Text>
        <ChatInit />
      </div>
    </div>
  );
}
