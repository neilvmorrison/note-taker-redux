"use client";
import { useParams, useRouter } from "next/navigation";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getProjectBySlug } from "@/lib/projects";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import CreateProjectNoteButton from "@/components/create-project-note-button";

export default function NewProjectNotePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<{ name: string } | null>(null);
  const projectSlug = Array.isArray(slug) ? slug[0] : (slug as string);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const projectData = await getProjectBySlug(projectSlug as string);
        setProject({
          name: projectData.name,
        });
      } catch (err) {
        setError("Failed to load project.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (projectSlug) {
      fetchProject();
    }
  }, [projectSlug]);

  const handleBack = () => {
    router.push(`/projects/${projectSlug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error || !project) {
    return (
      <Alert variant="destructive">{error || "Unable to load project."}</Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Text variant="h1" component="h1">
          New Note in {project.name}
        </Text>
      </div>

      <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
        <Text variant="lead" className="mb-6 text-center">
          Click the button below to create a new note in this project
        </Text>
        <CreateProjectNoteButton projectSlug={projectSlug} size="lg">
          Create Note
        </CreateProjectNoteButton>
      </div>
    </div>
  );
}
