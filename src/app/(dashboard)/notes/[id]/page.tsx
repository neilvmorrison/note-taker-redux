"use client";
import { useParams } from "next/navigation";

export default function NoteDetail() {
  const { id } = useParams();
  return <div>Note {id}</div>;
}
