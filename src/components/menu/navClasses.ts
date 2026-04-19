import { cva } from "class-variance-authority";

export const navLinkClassName = cva("flex items-center gap-2 rounded-lg text-sm font-medium transition", {
  variants: {
    variant: {
      drawer: "border px-3 py-2",
      sidebar: "px-3 py-2"
    },
    active: {
      true: "text-brand-orange-500",
      false: "text-slate-700"
    }
  },
  compoundVariants: [
    { variant: "drawer", active: true, class: "border-brand-orange-600/10 bg-brand-orange-600/10" },
    { variant: "drawer", active: false, class: "border-none hover:bg-brand-yellow-500/30 hover:text-slate-900" },
    { variant: "sidebar", active: true, class: "bg-brand-orange-600/10" },
    { variant: "sidebar", active: false, class: "hover:bg-brand-yellow-500/30 hover:text-slate-900" }
  ]
});
