"use client";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import CreateProjectButton from "@/components/create-project-button";
import EmptyState from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import useProjects from "@/hooks/use-projects";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function ProjectList() {
  const { push } = useRouter();
  const { data: projects, isLoading } = useProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Text component="h1" variant="h1">
          Projects
        </Text>
        <CreateProjectButton />
      </div>
      <Input placeholder="Search Projects..." />

      {isLoading && (
        <div className="h-[50%] flex flex-col items-center justify-center">
          <Spinner />
        </div>
      )}

      {!isLoading && projects?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              onClick={() => push(`/projects/${project.slug}`)}
              className="cursor-pointer hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text dimmed className="text-sm">
                  {project.created_at &&
                    format(new Date(project.created_at), "dd MMM, yyyy")}
                </Text>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="mt-10">
            <EmptyState />
          </div>
        )
      )}
    </div>
  );
}
