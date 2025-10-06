"use client";
import EmptyState from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import useNotes from "@/hooks/use-notes";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import CreateNoteButton from "@/components/create-note-button";

export default function NoteList() {
  const { push } = useRouter();
  const { data: notes, isLoading } = useNotes();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Text component="h1" variant="h1">
          Notes
        </Text>
        <CreateNoteButton />
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
              <Card
                key={note.id}
                onClick={() => push(`/notes/${note.id}`)}
                className="cursorpointer"
              >
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
