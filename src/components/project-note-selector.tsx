"use client";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getAllProjects, Project } from "@/lib/projects";
import { addNoteToProject } from "@/lib/notes";

interface ProjectNoteSelectorProps {
  noteId: string;
  onAssign?: (success: boolean, projectSlug: string) => void;
}

export function ProjectNoteSelector({
  noteId,
  onAssign,
}: ProjectNoteSelectorProps) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const projectsData = await getAllProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setOpen(false);
  };

  const handleAssign = async () => {
    if (!selectedProject) return;

    setAssigning(true);
    try {
      await addNoteToProject(noteId, selectedProject.slug);
      onAssign?.(true, selectedProject.slug);
    } catch (error) {
      console.error("Failed to assign note to project:", error);
      onAssign?.(false, selectedProject.slug);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-[200px]"
            disabled={loading}
          >
            {selectedProject ? selectedProject.name : "Select project..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search projects..." />
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => handleProjectSelect(project)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedProject?.id === project.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {project.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        onClick={handleAssign}
        disabled={!selectedProject || assigning}
        size="sm"
      >
        {assigning ? "Assigning..." : "Assign"}
      </Button>
    </div>
  );
}
