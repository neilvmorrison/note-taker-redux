"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import CreateProjectButton from "@/components/create-project-button";
import EmptyState from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useProjects from "@/hooks/use-projects";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import ViewToggle from "@/components/view-toggle";
import RowOrGrid from "@/components/row-or-grid";
import { Project } from "@/lib/projects";

export default function ProjectList() {
  const { push } = useRouter();
  const { data: projects, isLoading } = useProjects();
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");

  // Function to render projects in grid view (card style)
  const renderGridProject = (project: Project) => (
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
  );

  // Function to render projects in row view (list style)
  const renderRowProject = (project: Project) => (
    <div
      key={project.id}
      onClick={() => push(`/projects/${project.slug}`)}
      className="cursor-pointer p-4 hover:bg-muted/50 flex justify-between items-center"
    >
      <div>
        <Text component="h3" className="font-medium">
          {project.name}
        </Text>
        <Text dimmed className="text-xs">
          {project.slug}
        </Text>
      </div>
      <Text dimmed className="text-sm">
        {project.created_at &&
          format(new Date(project.created_at), "dd MMM, yyyy")}
      </Text>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Text component="h1" variant="h1">
            Projects
          </Text>
          <CreateProjectButton />
        </div>
        <ViewToggle onChange={setViewMode} defaultView="grid" />
      </div>
      <Input placeholder="Search Projects..." />

      <RowOrGrid
        orientation={viewMode}
        items={projects || []}
        isLoading={isLoading}
        renderGrid={renderGridProject}
        renderRow={renderRowProject}
        emptyState={<EmptyState />}
      />
    </div>
  );
}
