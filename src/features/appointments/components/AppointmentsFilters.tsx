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
const CHIP_ACTIVE_CLASS = "border-blue-200 bg-blue-50 text-blue-700";
const CHIP_INACTIVE_CLASS = "border-slate-200 bg-white text-slate-600 hover:text-slate-900";

function chipClass(isActive: boolean, extra = ""): string {
  return `${CHIP_BASE_CLASS} ${isActive ? CHIP_ACTIVE_CLASS : CHIP_INACTIVE_CLASS} ${extra}`.trim();
}

function FilterSelect({ filter }: { filter: SelectFilter }) {
  const { value, onChange, options, allLabel } = filter;

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={options.length === 0}
      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
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
    <div className="mb-6 space-y-3 rounded-lg border border-slate-200 p-3">
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
