import { Accessibility, Cake, Languages, type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { Modal, ModalContent, ModalDescription, ModalTitle } from "../../../components/ui/Modal";
import type { DayAppointment } from "../../../types/api";
import { collectDayWarnings, type DayWarningEntry, type DayWarningKind } from "../lib/dayWarnings";

interface DayWarningsModalProps {
  open: boolean;
  onClose: () => void;
  appointments: DayAppointment[];
  dateLabel: string;
}

const SECTIONS: { kind: DayWarningKind; title: string; icon: LucideIcon; className: string }[] = [
  { kind: "birthday", title: "Aniversariantes", icon: Cake, className: "text-amber-700" },
  { kind: "deficiency", title: "Atenção especial", icon: Accessibility, className: "text-violet-700" },
  { kind: "interpreter", title: "Intérprete", icon: Languages, className: "text-sky-700" }
];

export function DayWarningsModal({ open, onClose, appointments, dateLabel }: DayWarningsModalProps) {
  const warnings = useMemo(() => collectDayWarnings(appointments), [appointments]);

  const byKind = useMemo(() => {
    const map = new Map<DayWarningKind, DayWarningEntry[]>();
    for (const section of SECTIONS) {
      map.set(section.kind, []);
    }
    for (const entry of warnings) {
      map.get(entry.kind)?.push(entry);
    }
    return map;
  }, [warnings]);

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
    >
      <ModalContent>
        <ModalTitle className="pr-8 text-lg font-semibold text-slate-900">Avisos do dia</ModalTitle>
        <ModalDescription className="mt-1 text-sm text-slate-500">Resumo para {dateLabel}</ModalDescription>

        {warnings.length === 0 ? (
          <p className="mt-6 text-sm text-slate-600">Nenhum aviso para este dia.</p>
        ) : (
          <div className="mt-6 space-y-6">
            {SECTIONS.map(({ kind, title, icon: Icon, className }) => {
              const items = byKind.get(kind) ?? [];
              if (items.length === 0) {
                return null;
              }

              return (
                <section key={kind}>
                  <h3 className={`mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide ${className}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {title}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((entry, index) => (
                      <li
                        key={`${entry.appointment.id}-${entry.child.id}-${kind}-${index}`}
                        className="rounded-lg border border-slate-200 bg-brand-yellow-50 px-3 py-2 text-sm text-slate-800"
                      >
                        <p className="font-medium">{entry.child.nome}</p>
                        <p className="text-xs text-slate-600">
                          {entry.appointment.atividade} · {entry.appointment.horario}
                        </p>
                        <p className="text-xs text-slate-500">Responsável: {entry.child.responsavel}</p>
                        {entry.child.observation ? (
                          <p className="mt-1 text-xs text-slate-600">Obs.: {entry.child.observation}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
