"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import EmptyState from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useChats from "@/hooks/use-chats";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import ViewToggle from "@/components/view-toggle";
import RowOrGrid from "@/components/row-or-grid";
import { Chat } from "@/lib/chats";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/use-debounce";

export default function Chats() {
  const { push } = useRouter();
  const { debounce } = useDebounce({ delay: 500 });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { data: chats, isLoading } = useChats({
    searchTerm: debouncedSearchTerm,
  });
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debounce(() => {
      setDebouncedSearchTerm(value);
    });
  };

  const renderGridChat = (chat: Chat) => (
    <Card
      key={chat.id}
      onClick={() => push(`/chat/${chat.id}`)}
      className="cursor-pointer hover:border-primary/50 transition-colors"
    >
      <CardHeader>
        <CardTitle>{chat.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chat.summary && (
          <Text dimmed className="text-sm mb-2">
            {chat.summary}
          </Text>
        )}
        <Text dimmed className="text-sm">
          {chat.updated_at &&
            format(new Date(chat.updated_at), "dd MMM, yyyy, HH:mm")}
        </Text>
      </CardContent>
    </Card>
  );

  const renderRowChat = (chat: Chat) => (
    <div
      key={chat.id}
      onClick={() => push(`/chat/${chat.id}`)}
      className="cursor-pointer p-4 hover:bg-muted/50 flex justify-between items-center"
    >
      <div>
        <Text component="h3" className="font-medium">
          {chat.title}
        </Text>
        {chat.summary && (
          <Text dimmed className="text-xs">
            {chat.summary}
          </Text>
        )}
      </div>
      <Text dimmed className="text-sm">
        {chat.updated_at &&
          format(new Date(chat.updated_at), "dd MMM, yyyy, HH:mm")}
      </Text>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Text component="h1" variant="h1">
            Chats
          </Text>
          <Button onClick={() => push("/chat")}>New Chat</Button>
        </div>
        <ViewToggle onChange={setViewMode} defaultView="grid" />
      </div>
      <Input
        placeholder="Search Chats..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      <RowOrGrid
        orientation={viewMode}
        items={chats || []}
        isLoading={isLoading}
        renderGrid={renderGridChat}
        renderRow={renderRowChat}
        emptyState={<EmptyState />}
      />
    </div>
  );
}
