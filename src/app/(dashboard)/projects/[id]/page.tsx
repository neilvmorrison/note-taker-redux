"use client";
import { Text } from "@/components/ui/text";
import { useParams } from "next/navigation";

export default function ProjectDetail() {
  const { id } = useParams();
  return (
    <div>
      <Text variant="h1" component="h1">
        Note {id}
      </Text>
    </div>
  );
}
