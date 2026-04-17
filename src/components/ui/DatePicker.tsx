import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  triggerClassName?: string;
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
  triggerClassName
}: DatePickerProps) {
  const formattedValue = value ? format(value, "dd/MM/yyyy", { locale: ptBR }) : "";

  return (
    <div className={className}>
      {label ? (
        <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <Popover.Root>
        <Popover.Trigger asChild>
          <button id={id} type="button" className={triggerClassName ?? DEFAULT_TRIGGER_CLASS}>
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
              mode="single"
              locale={ptBR}
              selected={value ?? undefined}
              defaultMonth={value ?? undefined}
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
