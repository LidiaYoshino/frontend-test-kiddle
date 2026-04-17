import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;
export const ModalTitle = Dialog.Title;
export const ModalDescription = Dialog.Description;

export function ModalContent({ className = "", children, ...props }: ComponentPropsWithoutRef<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="modal-overlay fixed inset-0 z-40 bg-slate-900/40 data-[state=closed]:pointer-events-none" />
      <Dialog.Content
        className={`modal-panel fixed left-1/2 top-1/2 z-50 w-[min(92vw,36rem)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl outline-none data-[state=closed]:pointer-events-none ${className}`}
        {...props}
      >
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Fechar"
            className="absolute right-4 top-4 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
