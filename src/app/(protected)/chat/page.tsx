"use client";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useCurrentUser } from "@/hooks/use-current-user";
import PromptInput from "@/components/prompt-input";
import { useForm } from "@/hooks/use-form";
import useCreate from "@/hooks/use-create";
import { createChatWithMessage } from "@/lib/chats";

export default function NewChat() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const { createRecord, isLoading } = useCreate(createChatWithMessage);

  const messageForm = useForm({
    initialValues: {
      message: "",
      model: "gpt-4o-mini",
    },
    onSubmit: async (data) => {
      if (!data.message.trim()) {
        return;
      }

      const result = await createRecord(data.message.trim());
      if (result?.success && result.data?.chat_id) {
        messageForm.reset();
        router.push(
          `/chat/${result.data.chat_id}?model=${encodeURIComponent(data.model)}`
        );
      }
    },
  });
  console.log(messageForm);
  return (
    <div>
      <PageHeader
        title="Chat"
        description="Chat with your AI assistant"
        right_section={<Button>New Chat</Button>}
      />
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col gap-4 items-center">
          <Text variant="h2">
            Hello, <span className="text-blue-500">{user?.first_name}</span>
          </Text>
          <form onSubmit={messageForm.handleSubmit}>
            <PromptInput
              placeholder="Let's chat..."
              classNames={{
                textarea: "xs:w-full md:w-[480px] border-0 shadow-none",
              }}
              currentModel={messageForm.getFieldProps("model").value}
              onModelChange={messageForm.handleChange("model")}
              isSubmitting={isLoading}
              {...messageForm.getFieldProps("message")}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
