import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { DayPicker, type Matcher } from "react-day-picker";
import "react-day-picker/style.css";

const DAY_PICKER_STYLE = {
  "--rdp-accent-color": "#F95933",
  "--rdp-accent-background-color": "#ffd6cc",
  "--rdp-today-color": "#F95933",
  "--rdp-day-width": "36px",
  "--rdp-day-height": "36px",
  "--rdp-day_button-width": "34px",
  "--rdp-day_button-height": "34px",
  "--rdp-nav_button-width": "1.75rem",
  "--rdp-nav_button-height": "1.75rem",
  "--rdp-nav-height": "2.25rem",
  padding: "0 8px",
  fontSize: "0.8125rem"
} as CSSProperties;

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  triggerClassName?: string;
  /** Dates matching this matcher cannot be selected (e.g. only certain weekdays). */
  disabled?: Matcher | Matcher[];
  /** Month shown when the calendar opens (also use `remountKey` if it must reset when this changes). */
  defaultMonth?: Date;
  /** Change to remount the calendar (e.g. when the selectable rules change). */
  remountKey?: string;
  /** Disables opening the calendar (e.g. until a prerequisite is chosen). */
  triggerDisabled?: boolean;
}

const DEFAULT_TRIGGER_CLASS =
  "inline-flex w-full items-center justify-between gap-2 rounded-md border border-slate-300 bg-brand-yellow-50 px-3 py-2 text-sm text-slate-700 outline-none transition hover:text-slate-900 focus:ring-2 focus:ring-brand-teal-500";

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Selecionar data",
  id,
  className = "",
  triggerClassName,
  disabled,
  defaultMonth,
  remountKey,
  triggerDisabled = false
}: DatePickerProps) {
  const formattedValue = value ? format(value, "dd/MM/yyyy", { locale: ptBR }) : "";
  const monthToShow = defaultMonth ?? value ?? undefined;

  return (
    <div className={className}>
      {label ? (
        <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            id={id}
            type="button"
            disabled={triggerDisabled}
            className={`${triggerClassName ?? DEFAULT_TRIGGER_CLASS} disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-brand-yellow-75 disabled:text-slate-400`}
          >
            <span>{formattedValue || placeholder}</span>
            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-50 rounded-lg border border-slate-200 bg-brand-yellow-50 p-2 shadow-lg outline-none"
          >
            <DayPicker
              key={remountKey}
              mode="single"
              locale={ptBR}
              selected={value ?? undefined}
              defaultMonth={monthToShow}
              disabled={disabled}
              style={DAY_PICKER_STYLE}
              onSelect={(selected) => {
                if (selected) {
                  onChange(selected);
                }
              }}
              showOutsideDays
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
