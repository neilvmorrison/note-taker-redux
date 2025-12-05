import { getAllProjects, Project } from "@/lib/projects";
import { useEffect, useState } from "react";

interface IUseProjectsParams {
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export default function useProjects({
  searchTerm,
  limit = 50,
  offset = 0,
}: IUseProjectsParams = {}) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<Project[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const projects = await getAllProjects({
          limit,
          offset,
          name: searchTerm,
        });
        setData(projects);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [searchTerm, limit, offset]);

  return {
    data,
    isLoading,
    isError: !!error,
    error,
  };
}
