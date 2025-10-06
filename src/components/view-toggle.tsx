"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid2X2, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  onChange: (view: "grid" | "row") => void;
  defaultView?: "grid" | "row";
  className?: string;
}

export function ViewToggle({
  onChange,
  defaultView = "grid",
  className,
}: ViewToggleProps) {
  const [activeView, setActiveView] = useState<"grid" | "row">(defaultView);

  const handleViewChange = (view: "grid" | "row") => {
    setActiveView(view);
    onChange(view);
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <Button
        variant={activeView === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("grid")}
        className="px-2.5"
        aria-label="Grid view"
      >
        <Grid2X2 className="h-4 w-4" />
      </Button>
      <Button
        variant={activeView === "row" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("row")}
        className="px-2.5"
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default ViewToggle;
