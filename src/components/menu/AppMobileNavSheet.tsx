import { X } from "lucide-react";
import type { AppNavItem } from "../../app/navigation";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "../ui/Sheet";
import { AppNavLinks } from "./AppNavLinks";

interface AppMobileNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: AppNavItem[];
}

export function AppMobileNavSheet({ open, onOpenChange, items }: AppMobileNavSheetProps) {
  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={onOpenChange} modal>
        <SheetContent id="mobile-nav-drawer" aria-describedby="mobile-nav-description">
          <SheetDescription id="mobile-nav-description" className="sr-only">
            Primary navigation for the application.
          </SheetDescription>
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4">
            <SheetTitle className="text-sm font-semibold text-slate-900">Menu</SheetTitle>
            <SheetClose asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </SheetClose>
          </div>
          <nav aria-label="Primary navigation" className="min-h-0 flex-1 overflow-y-auto p-4">
            <AppNavLinks
              items={items}
              variant="drawer"
              listId="mobile-nav-links"
              listClassName="space-y-2"
              onItemSelect={() => onOpenChange(false)}
            />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
