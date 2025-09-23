"use client";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import useCreate from "@/hooks/use-create";
import useNotes from "@/hooks/use-notes";
import { createNote } from "@/lib/notes";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function NoteList() {
  const { push } = useRouter();
  const { data: notes, isLoading } = useNotes();
  const { createRecord, isLoading: isCreating } = useCreate(createNote);

  async function handleCreate() {
    const result = await createRecord({ title: "New Note" });
    if (result?.data) {
      push(`/notes/${result.data.id}`);
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Text component="h1" variant="h1">
          Notes
        </Text>
        <Button onClick={handleCreate} disabled={isCreating}>
          {isCreating ? <Spinner /> : <Icon name="plus" />}
          New Note
        </Button>
      </div>
      <Input placeholder="Search Notes..." />
      {isLoading && (
        <div className="h-[50%] flex flex-col items-center justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && notes?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {notes.map((note) => {
            return (
              <Card key={note.id} onClick={() => push(`/notes/${note.id}`)}>
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text dimmed className="text-sm">
                    {format(note.updated_at ?? "", "dd MMM, yyyy, HH:MM")}
                  </Text>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
