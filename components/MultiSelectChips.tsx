"use client";

import { useState } from "react";

export type ChipOption = { value: string; label: string };

export default function MultiSelectChips({
  label,
  options,
  selected,
  onChange,
  disabled,
  emptyLabel,
}: {
  label: string;
  options: ChipOption[];
  selected: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  const summary =
    selected.length === 0
      ? "Todos"
      : selected.length <= 2
        ? options
            .filter((o) => selected.includes(o.value))
            .map((o) => o.label)
            .join(", ")
        : `${selected.length} selecionados`;

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        aria-expanded={open}
        className="flex items-center gap-1.5 text-left disabled:opacity-50"
      >
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{summary}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        {selected.length > 0 && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onChange([]);
              }
            }}
            className="text-xs font-medium text-green-700 hover:underline dark:text-green-400"
          >
            limpar
          </span>
        )}
      </button>

      {open &&
        (options.length === 0 ? (
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {emptyLabel ?? "Nenhuma opção disponível"}
          </p>
        ) : (
          <div className="flex max-w-md flex-wrap gap-1.5">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : isSelected
                        ? "border-green-600 bg-green-600/10 text-green-700 dark:border-green-400 dark:bg-green-400/10 dark:text-green-300"
                        : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={disabled}
                    onChange={() => toggle(option.value)}
                    className="h-3 w-3 accent-green-600"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        ))}
    </div>
  );
}
