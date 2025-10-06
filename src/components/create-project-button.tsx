"use client";

import { CreateProjectDialog } from "./create-project-dialog";

interface CreateProjectButtonProps {
  className?: string;
}

export function CreateProjectButton({ className }: CreateProjectButtonProps) {
  return <CreateProjectDialog />;
}

export default CreateProjectButton;
