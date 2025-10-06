"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCreate from "@/hooks/use-create";
import { createProject } from "@/lib/projects";
import { makeSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import Icon from "@/components/ui/icons";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [validationError, setValidationError] = useState("");
  const router = useRouter();
  const { createRecord, isLoading, error } = useCreate(createProject);

  // Generate slug and validate form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!projectName.trim()) {
      setValidationError("Project name is required");
      return;
    }
    setValidationError("");

    // Generate slug from project name
    const slug = makeSlug(projectName);

    // Create project with API
    const result = await createRecord({
      name: projectName,
      slug,
    });

    // Handle success
    if (result?.data) {
      // Close dialog and redirect to new project page
      setOpen(false);
      setProjectName("");
      router.push(`/projects/${slug}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="plus" className="mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-[100dvh] h-full rounded-none sm:h-auto sm:max-h-[85vh] sm:max-w-[425px] sm:rounded-lg">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <DialogHeader className="pt-2 sm:pt-0">
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new project. A URL-friendly slug will be
              automatically generated.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 flex-1">
            <div className="grid gap-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Awesome Project"
                disabled={isLoading}
                autoFocus
              />
              {validationError && (
                <p className="text-sm font-medium text-red-500">
                  {validationError}
                </p>
              )}
            </div>

            {projectName && (
              <div className="text-sm text-muted-foreground">
                Slug: <span className="font-mono">{makeSlug(projectName)}</span>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <p>{error.message}</p>
              </Alert>
            )}
          </div>
          <DialogFooter className="mt-auto sm:mt-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Spinner className="mr-2" />
              ) : (
                <Icon name="plus" className="mr-2" />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectDialog;
