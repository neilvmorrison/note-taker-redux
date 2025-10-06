import { getAllProjects, Project } from "@/lib/projects";
import { useEffect, useState } from "react";

export default function useProjects() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Project[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const projects = await getAllProjects();
        setData(projects);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  };
}
