"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { useNoteHistory } from "@/hooks/use-note-history";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { note_event_types } from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Text } from "@/components/ui/text";

interface NoteHistoryDrawerProps {
  noteId: string;
}

export function NoteHistoryDrawer({ noteId }: NoteHistoryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, error, actions } = useNoteHistory(isOpen ? noteId : null);

  // Function to properly parse database timestamps
  const parseTimestamp = (timestamp: string | null): Date => {
    if (!timestamp) return new Date();

    // Check if it's already ISO format (with a T)
    if (timestamp.includes("T")) {
      return parseISO(timestamp);
    }

    // Parse PostgreSQL timestamp format: "2025-10-08 17:25:01.50835"
    try {
      // Convert to ISO format by replacing space with T
      const isoFormat = timestamp.replace(" ", "T");
      return parseISO(isoFormat);
    } catch (err) {
      console.error("Error parsing timestamp:", err);
      return new Date(); // Fallback to current time on error
    }
  };

  // Function to get human readable description of the action
  const getActionDescription = (eventType: string | null) => {
    switch (eventType) {
      case note_event_types.created:
        return "Created this note";
      case note_event_types.updated:
        return "Updated this note";
      case note_event_types.deleted:
        return "Deleted this note";
      case note_event_types.assign_to_project:
        return "Assigned this note to a project";
      case note_event_types.remove_from_project:
        return "Removed this note from a project";
      case note_event_types.added_collaborator:
        return "Added a collaborator to this note";
      case note_event_types.removed_collaborator:
        return "Removed a collaborator from this note";
      default:
        return "Performed an action on this note";
    }
  };

  // Function to get initials for avatar fallback
  const getInitials = (firstName: string | null, lastName: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else if (lastName) {
      return lastName[0];
    }
    return "U";
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" title="View Note History">
          <History className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg" side="right">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Note History</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto py-4 pr-2 flex-1">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <Spinner size="md" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
          )}

          {!loading && !error && actions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No history records found for this note.</p>
            </div>
          )}

          <div className="space-y-4 pl-3">
            {actions.map((action) => (
              <div
                key={action.id}
                className="flex items-start gap-4 border-b border-border pb-4 last:border-0"
              >
                <Avatar>
                  <AvatarImage src={""} />
                  <AvatarFallback className="text-sm bg-blue-400 text-white">
                    {getInitials(
                      action.actor?.first_name ?? null,
                      action.actor?.last_name ?? null
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <Text>
                      {action.actor?.first_name} {action.actor?.last_name}
                    </Text>
                    {action.created_at && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <time className="text-xs text-muted-foreground hover:underline cursor-default">
                            {formatDistanceToNow(
                              parseTimestamp(action.created_at),
                              {
                                addSuffix: true,
                              }
                            )}
                          </time>
                        </TooltipTrigger>
                        <TooltipContent>
                          {format(parseTimestamp(action.created_at), "PPpp")}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <Text dimmed className="text-xs">
                    {getActionDescription(action.event_type)}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
