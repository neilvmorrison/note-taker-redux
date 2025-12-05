"use client";
import { useState, useMemo } from "react";
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
import useDebounce from "@/hooks/use-debounce";

export default function NoteList() {
  const { debounce } = useDebounce({ delay: 500 });
  const { push } = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { data: notes, isLoading } = useNotes({
    searchTerm: debouncedSearchTerm,
  });
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debounce(() => {
      setDebouncedSearchTerm(value);
    });
  };

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
      <Input
        placeholder="Search Notes..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

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
