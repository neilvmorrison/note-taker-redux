"use client";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useCurrentUser } from "@/hooks/use-current-user";
import PromptInput from "@/components/prompt-input";
import { useForm } from "@/hooks/use-form";

export default function Chats() {
  const { user } = useCurrentUser();

  const messageForm = useForm({
    initialValues: {
      message: "",
    },
    onSubmit: async (data) => {
      console.log(data);
    },
  });

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
              placeholder="Type your request here..."
              classNames={{
                textarea: "w-[480px] border-0 shadow-none",
              }}
              {...messageForm.getFieldProps("message")}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
