import { cva } from "class-variance-authority";

export const navLinkClassName = cva("flex items-center gap-2 rounded-lg text-sm font-medium transition", {
  variants: {
    variant: {
      drawer: "border px-3 py-2",
      sidebar: "px-3 py-2"
    },
    active: {
      true: "text-brand1-700",
      false: "text-slate-700"
    }
  },
  compoundVariants: [
    { variant: "drawer", active: true, class: "border-brand1-600 bg-brand1-50" },
    { variant: "drawer", active: false, class: "border-slate-200 bg-white hover:border-slate-300" },
    { variant: "sidebar", active: true, class: "bg-brand1-50" },
    { variant: "sidebar", active: false, class: "hover:bg-slate-100 hover:text-slate-900" }
  ]
});
