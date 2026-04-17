import * as Dialog from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef } from "react";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;

export function SheetContent({ className = "", children, ...props }: ComponentPropsWithoutRef<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="sheet-overlay fixed inset-0 z-40 bg-slate-900/40 data-[state=closed]:pointer-events-none" />
      <Dialog.Content
        className={`sheet-panel fixed inset-y-0 right-0 z-50 flex w-[min(85vw,18rem)] max-h-screen flex-col overflow-hidden border-l border-slate-200 bg-white shadow-xl outline-none data-[state=closed]:pointer-events-none ${className}`}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
