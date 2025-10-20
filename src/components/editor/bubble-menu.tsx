import { Editor } from "@tiptap/core";
import {
  BubbleMenu as TipTapBubbleMenu,
  BubbleMenuProps as TipTapBubbleMenuProps,
} from "@tiptap/react/menus";
import { Button } from "../ui/button";
import { TextSelection } from "prosemirror-state";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";

interface IBubbleMenuProps {
  editor: Editor | null;
}

const shouldShow: TipTapBubbleMenuProps["shouldShow"] = ({ editor, state }) => {
  if (!editor) {
    return false;
  }

  // Use the imported TextSelection class directly
  const hasSelection = state.selection instanceof TextSelection;

  // Don't show if the selection is empty (just a cursor) or not a text selection
  if (state.selection.empty || !hasSelection) {
    return false;
  }

  // Optional: Don't show if the cursor is inside a code block
  if (editor.isActive("codeBlock")) {
    return false;
  }

  // Show the menu if a valid text selection exists
  return true;
};

export default function BubbleMenu({ editor }: IBubbleMenuProps) {
  if (!editor) return null;

  // mutate the text formatting
  const setMark = (markName: string, attributes?: Record<string, unknown>) => {
    editor.chain().focus().toggleMark(markName, attributes).run();
  };

  return (
    <TipTapBubbleMenu editor={editor} shouldShow={shouldShow}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex items-center gap-2">
            <Button onClick={() => alert("AI Clicked")}>Ask AI</Button>
            <Button onClick={() => alert("More Options")}>More Options</Button>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </TipTapBubbleMenu>
  );
}
