import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";

type NativeSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">;

export interface SelectProps extends NativeSelectProps {
  /** Visual size. Defaults to "md" (used in forms); use "sm" for compact contexts like filter bars. */
  uiSize?: "sm" | "md";
  /** Extra classes appended to the inner <select>. */
  className?: string;
  /** Extra classes appended to the wrapping <div> that positions the chevron. */
  wrapperClassName?: string;
}

const BASE_SELECT_CLASS =
  "w-full appearance-none rounded-md border border-slate-300 bg-brand-yellow-50 outline-none transition focus:ring-2 focus:ring-brand-teal-500 disabled:cursor-not-allowed disabled:bg-brand-yellow-75 disabled:text-slate-400";

const SIZE_CLASS: Record<NonNullable<SelectProps["uiSize"]>, string> = {
  sm: "px-3 py-2 pr-9 text-xs text-slate-700",
  md: "px-3 py-2 pr-9 text-sm text-slate-800"
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { uiSize = "md", className = "", wrapperClassName = "", disabled, children, ...props },
  ref
) {
  return (
    <div className={`relative ${wrapperClassName}`.trim()}>
      <select
        ref={ref}
        disabled={disabled}
        className={`${BASE_SELECT_CLASS} ${SIZE_CLASS[uiSize]} ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className={`pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
          disabled ? "text-slate-400" : "text-slate-500"
        }`}
      />
    </div>
  );
});
