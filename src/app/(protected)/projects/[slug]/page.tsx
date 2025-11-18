"use client";
import { Text } from "@/components/ui/text";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProjectBySlug } from "@/lib/projects";
import useProjectNotes from "@/hooks/use-project-notes";
import { Note } from "@/lib/notes";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { FileText } from "lucide-react";
import EmptyState from "@/components/empty-state";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import CreateProjectNoteButton from "@/components/create-project-note-button";

export default function ProjectDetail() {
  const { slug } = useParams();
  const _ = useRouter(); // Keep router instance for navigation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<{
    id: string;
    name: string;
    description?: string;
  } | null>(null);
  const projectSlug = Array.isArray(slug) ? slug[0] : (slug as string);
  const {
    data: notes,
    isLoading: notesLoading,
    isError: notesError,
  } = useProjectNotes(projectSlug);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const projectData = await getProjectBySlug(projectSlug as string);
        setProject({
          id: projectData.id,
          name: projectData.name,
          description: projectData.description as string,
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
      <div className="flex items-center justify-between">
        <Text variant="h1" component="h1">
          {project.name}
        </Text>
        <CreateProjectNoteButton projectSlug={projectSlug} />
      </div>

      {project.description && (
        <Text variant="muted" className="mt-2">
          {project.description}
        </Text>
      )}

      <div className="mt-6">
        <Text variant="h2" component="h2" className="mb-4">
          Project Notes
        </Text>

        {notesLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner />
          </div>
        ) : notesError ? (
          <Alert variant="destructive">Failed to load project notes.</Alert>
        ) : notes && notes.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note: Note) => (
              <Link key={note.id} href={`/notes/${note.id}`} className="block">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Text variant="h4" className="line-clamp-1">
                        {note.title || "Untitled Note"}
                      </Text>
                    </div>
                    <Text variant="muted" className="mt-2 line-clamp-2">
                      {note.content
                        ? JSON.stringify(note.content).slice(0, 100)
                        : "No content"}
                    </Text>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No notes yet"
            description="Create your first note in this project"
            icon="file"
            action={<CreateProjectNoteButton projectSlug={projectSlug} />}
          />
        )}
      </div>
    </div>
  );
}
