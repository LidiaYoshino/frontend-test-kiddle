import { ChevronDown } from "lucide-react";
import { DatePicker } from "../../../components/ui/DatePicker";
import { Loading } from "../../../components/ui/Loading";
import { DATE_PRESET_OPTIONS, type DateMode, type DatePreset } from "../lib/dates";

export interface SelectFilter {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allLabel: string;
}

interface AppointmentsFiltersProps {
  dateMode: DateMode;
  onPresetSelect: (preset: DatePreset) => void;
  customDate: Date | null;
  onCustomDateChange: (date: Date) => void;
  activity: SelectFilter;
  partner: SelectFilter;
  user: SelectFilter;
  isFiltering: boolean;
}

const CHIP_BASE_CLASS = "rounded-md border px-3 py-1.5 text-xs font-medium transition";
const CHIP_ACTIVE_CLASS = "border-brand-teal-500 bg-brand-teal-100 text-brand-teal-500";
const CHIP_INACTIVE_CLASS = "border-slate-200 bg-brand-yellow-50 text-slate-600 hover:text-slate-900";

function chipClass(isActive: boolean, extra = ""): string {
  return `${CHIP_BASE_CLASS} ${isActive ? CHIP_ACTIVE_CLASS : CHIP_INACTIVE_CLASS} ${extra}`.trim();
}

function FilterSelect({ filter }: { filter: SelectFilter }) {
  const { value, onChange, options, allLabel } = filter;
  const isDisabled = options.length === 0;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isDisabled}
        className="w-full appearance-none rounded-md border border-slate-300 bg-brand-yellow-50 px-3 py-2 pr-9 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-brand-teal-500 disabled:cursor-not-allowed disabled:bg-brand-yellow-75 disabled:text-slate-400"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className={`pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
          isDisabled ? "text-slate-400" : "text-slate-500"
        }`}
      />
    </div>
  );
}

export function AppointmentsFilters({
  dateMode,
  onPresetSelect,
  customDate,
  onCustomDateChange,
  activity,
  partner,
  user,
  isFiltering
}: AppointmentsFiltersProps) {
  return (
    <div className="mb-4 space-y-3 rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Filtros</span>
        {isFiltering ? <Loading message="Aplicando filtros..." size="sm" /> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {DATE_PRESET_OPTIONS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onPresetSelect(preset.value)}
            className={chipClass(dateMode === preset.value)}
          >
            {preset.label}
          </button>
        ))}
        <DatePicker
          id="appointments-date-filter"
          value={customDate}
          onChange={onCustomDateChange}
          placeholder="Escolher data"
          triggerClassName={chipClass(dateMode === "custom", "inline-flex items-center gap-2")}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <FilterSelect filter={activity} />
        <FilterSelect filter={partner} />
        <FilterSelect filter={user} />
      </div>
    </div>
  );
}
