"use client";
import { useState } from "react";
import EmptyState from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import useNotes from "@/hooks/use-notes";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import CreateNoteButton from "@/components/create-note-button";
import RowOrGrid from "@/components/row-or-grid";
import ViewToggle from "@/components/view-toggle";
import { Note } from "@/lib/notes";

export default function NoteList() {
  const { push } = useRouter();
  const { data: notes, isLoading } = useNotes();
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");

  // Function to render notes in grid view (card style)
  const renderGridNote = (note: Note) => (
    <Card
      key={note.id}
      onClick={() => push(`/notes/${note.id}`)}
      className="cursor-pointer hover:border-primary/50 transition-colors"
    >
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text dimmed className="text-sm">
          {format(note.updated_at ?? "", "dd MMM, yyyy, HH:mm")}
        </Text>
      </CardContent>
    </Card>
  );

  // Function to render notes in row view (list style)
  const renderRowNote = (note: Note) => (
    <div
      key={note.id}
      onClick={() => push(`/notes/${note.id}`)}
      className="cursor-pointer p-4 hover:bg-muted/50 flex justify-between items-center"
    >
      <div>
        <Text component="h3" className="font-medium">
          {note.title}
        </Text>
      </div>
      <Text dimmed className="text-sm">
        {format(note.updated_at ?? "", "dd MMM, yyyy, HH:mm")}
      </Text>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Text component="h1" variant="h1">
            Notes
          </Text>
          <CreateNoteButton />
        </div>
        <ViewToggle onChange={setViewMode} defaultView="grid" />
      </div>
      <Input placeholder="Search Notes..." />

      <RowOrGrid
        orientation={viewMode}
        items={notes || []}
        isLoading={isLoading}
        renderGrid={renderGridNote}
        renderRow={renderRowNote}
        emptyState={<EmptyState />}
      />
    </div>
  );
}
