"use client";
import useCreate from "@/hooks/use-create";
import { createNoteInProject } from "@/lib/notes";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "./ui/button";
import { Spinner } from "./ui/spinner";
import Icon from "./ui/icons";

interface CreateProjectNoteButtonProps extends ButtonProps {
  projectSlug: string;
  redirectToNote?: boolean;
  onSuccess?: (noteId: string) => void;
}

export default function CreateProjectNoteButton({
  projectSlug,
  redirectToNote = true,
  onSuccess,
  children,
  ...props
}: CreateProjectNoteButtonProps) {
  const { push } = useRouter();
  const { createRecord, isLoading: isCreating } = useCreate((data) =>
    createNoteInProject(data, projectSlug)
  );

  async function handleCreate() {
    const result = await createRecord({ title: "New Note" });
    if (result?.data) {
      if (onSuccess) {
        onSuccess(result.data.id);
      }
      if (redirectToNote) {
        push(`/notes/${result.data.id}`);
      }
    }
  }

  return (
    <Button onClick={handleCreate} disabled={isCreating} {...props}>
      {isCreating ? <Spinner /> : <Icon name="plus" className="mr-2 h-4 w-4" />}
      {children || "New Note"}
    </Button>
  );
}
