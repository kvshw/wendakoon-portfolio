"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronUp, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { tokens } from "@/lib/admin/tokens";

function SortableItem({
  id,
  children,
  header,
}: {
  id: string;
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        borderColor: tokens.line,
        opacity: isDragging ? 0.85 : 1,
      }}
      className="admin-card mb-2 overflow-hidden"
    >
      <div className="flex gap-2 border-b p-2" style={{ borderColor: tokens.line }}>
        <button
          type="button"
          className="cursor-grab touch-none self-center"
          style={{ color: tokens.inkFaint }}
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
        <div className="min-w-0 flex-1">{header}</div>
      </div>
      {children}
    </div>
  );
}

export type SortableListProps<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  getId: (item: T, index: number) => string;
  renderItem: (item: T, index: number, update: (item: T) => void) => React.ReactNode;
  /** Creates a new row when "Add" is clicked */
  createItem?: () => T;
  /** One-line label in collapsed view mode */
  getSummary?: (item: T, index: number) => string;
  addLabel?: string;
  /** Minimum rows; remove is disabled at this count */
  minItems?: number;
  /** Start with all rows expanded (no view/edit toggle) */
  defaultExpanded?: boolean;
  emptyMessage?: string;
};

export function SortableList<T>({
  items,
  onChange,
  getId,
  renderItem,
  createItem,
  getSummary,
  addLabel = "Add item",
  minItems = 0,
  defaultExpanded = false,
  emptyMessage = "No items yet. Add one to get started.",
}: SortableListProps<T>) {
  const hasViewMode = Boolean(getSummary);
  const ids = items.map(getId);
  const idsKey = ids.join("\0");

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() =>
    defaultExpanded || !hasViewMode ? new Set(ids) : new Set()
  );

  useEffect(() => {
    setExpandedIds((prev) => {
      const next = new Set<string>();
      for (const id of ids) {
        if (prev.has(id)) next.add(id);
      }
      if (!hasViewMode || defaultExpanded) {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- idsKey tracks list identity
  }, [idsKey, hasViewMode, defaultExpanded]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeAt = (index: number) => {
    if (items.length <= minItems) return;
    const summary = getSummary?.(items[index], index) ?? `Item ${index + 1}`;
    if (!window.confirm(`Remove "${summary}"?`)) return;
    const id = getId(items[index], index);
    onChange(items.filter((_, i) => i !== index));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const addItem = () => {
    if (!createItem) return;
    const item = createItem();
    const nextItems = [...items, item];
    onChange(nextItems);
    const newId = getId(item, nextItems.length - 1);
    setExpandedIds((prev) => new Set(prev).add(newId));
  };

  const canRemove = items.length > minItems;

  return (
    <div className="space-y-3">
      {createItem && (
        <button
          type="button"
          className="btn-ghost flex w-full items-center justify-center gap-2 text-xs"
          onClick={addItem}
        >
          <Plus size={14} />
          {addLabel}
        </button>
      )}

      {items.length === 0 ? (
        <p className="text-sm" style={{ color: tokens.inkFaint }}>
          {emptyMessage}
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            {items.map((item, index) => {
              const id = getId(item, index);
              const isExpanded = !hasViewMode || expandedIds.has(id);
              const summary = getSummary?.(item, index) ?? `Item ${index + 1}`;

              const update = (next: T) => {
                const copy = [...items];
                copy[index] = next;
                onChange(copy);
              };

              return (
                <SortableItem
                  key={id}
                  id={id}
                  header={
                    <div className="flex flex-wrap items-center gap-2">
                      {hasViewMode && !isExpanded && (
                        <p
                          className="min-w-0 flex-1 truncate text-sm font-medium"
                          style={{ color: tokens.ink }}
                          title={summary}
                        >
                          {summary}
                        </p>
                      )}
                      {hasViewMode && isExpanded && (
                        <p
                          className="min-w-0 flex-1 text-xs uppercase tracking-wide"
                          style={{ color: tokens.inkFaint }}
                        >
                          Editing
                        </p>
                      )}
                      <div className="ml-auto flex shrink-0 gap-1">
                        {hasViewMode && (
                          <button
                            type="button"
                            className="btn-ghost px-2 py-1 text-xs"
                            onClick={() => toggleExpanded(id)}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp size={12} className="inline" /> View
                              </>
                            ) : (
                              <>
                                <Pencil size={12} className="inline" /> Edit
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-ghost px-2 py-1 text-xs"
                          disabled={!canRemove}
                          title={canRemove ? "Remove item" : `At least ${minItems} required`}
                          onClick={() => removeAt(index)}
                          style={{
                            color: canRemove ? tokens.red : tokens.inkFaint,
                          }}
                        >
                          <Trash2 size={12} className="inline" /> Remove
                        </button>
                      </div>
                    </div>
                  }
                >
                  {isExpanded && (
                    <div className="p-3 pt-2">{renderItem(item, index, update)}</div>
                  )}
                </SortableItem>
              );
            })}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
