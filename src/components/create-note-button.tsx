"use client";
import useCreate from "@/hooks/use-create";
import { createNote } from "@/lib/notes";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import Icon from "./ui/icons";

export default function CreateNoteButton() {
  const { push } = useRouter();
  const { createRecord, isLoading: isCreating } = useCreate(createNote);

  async function handleCreate() {
    const result = await createRecord({ title: "New Note" });
    if (result?.data) {
      push(`/notes/${result.data.id}`);
    }
  }

  return (
    <Button onClick={handleCreate} disabled={isCreating}>
      {isCreating ? <Spinner /> : <Icon name="plus" />}
      New Note
    </Button>
  );
}
