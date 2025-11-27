"use client";

import useKeyboardShortcut from "@/hooks/use-keyboard-shortcut";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Text } from "./ui/text";
import useToggle from "@/hooks/use-toggle";

export default function SearchDialog() {
  const [showDialog, toggleDialog] = useToggle(false);
  useKeyboardShortcut({ key: "k", callback: toggleDialog });

  return (
    <Dialog open={showDialog} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="dark:bg-muted dark:hover:bg-muted/80"
        >
          Cmd + K to Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Advanced Search</DialogTitle>
        <Text dimmed className="text-sm">
          Search your notes, projects, tasks and chats.
        </Text>
        <Input placeholder="Search your notes, projects, tasks or chats..." />
      </DialogContent>
    </Dialog>
  );
}
