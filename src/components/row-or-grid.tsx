"use client";

import { ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";

interface RowOrGridProps<T> {
  orientation: "row" | "grid";
  items: T[];
  isLoading: boolean;
  renderGrid: (item: T, index: number) => ReactNode;
  renderRow: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
  gridClassName?: string;
  rowClassName?: string;
}

function LoadingState() {
  return (
    <div className="h-[50vh] flex flex-col items-center justify-center">
      <div className="h-[48px]">
        <Spinner size="lg" />
      </div>
    </div>
  );
}

export default function RowOrGrid<T>({
  orientation,
  items,
  isLoading,
  renderGrid,
  renderRow,
  emptyState,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  rowClassName = "flex flex-col divide-y",
}: RowOrGridProps<T>) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!isLoading && !items.length && emptyState) {
    return emptyState;
  }

  if (orientation === "grid") {
    return (
      <div className={gridClassName}>
        {items.map((item, index) => renderGrid(item, index))}
      </div>
    );
  }

  return (
    <div className={rowClassName}>
      {items.map((item, index) => renderRow(item, index))}
    </div>
  );
}
