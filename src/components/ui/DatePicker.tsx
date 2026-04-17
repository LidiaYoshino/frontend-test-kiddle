import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker, type Matcher } from "react-day-picker";
import "react-day-picker/style.css";

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
  "inline-flex w-full items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500";

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
            className={`${triggerClassName ?? DEFAULT_TRIGGER_CLASS} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`}
          >
            <span className={formattedValue ? "" : "text-slate-400"}>{formattedValue || placeholder}</span>
            <CalendarIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-50 rounded-lg border border-slate-200 bg-white p-2 shadow-lg outline-none"
          >
            <DayPicker
              key={remountKey}
              mode="single"
              locale={ptBR}
              selected={value ?? undefined}
              defaultMonth={monthToShow}
              disabled={disabled}
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
