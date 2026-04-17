import { Accessibility, Cake, ExternalLink, Languages } from "lucide-react";
import type { ReactNode } from "react";
import { Modal, ModalContent, ModalDescription, ModalTitle } from "../../../components/ui/Modal";
import type { AppointmentChild, DayAppointment } from "../../../types/api";
import { getSpotsLeft } from "../lib/appointments";
import { getAgeAt, isBirthdayOn } from "../lib/children";

interface AppointmentDetailsModalProps {
  appointment: DayAppointment | null;
  onClose: () => void;
}

export function AppointmentDetailsModal({ appointment, onClose }: AppointmentDetailsModalProps) {
  return (
    <Modal
      open={appointment !== null}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
    >
      {appointment ? <AppointmentDetails appointment={appointment} /> : null}
    </Modal>
  );
}

function AppointmentDetails({ appointment }: { appointment: DayAppointment }) {
  const spotsLeft = getSpotsLeft(appointment);
  const birthdayCount = appointment.criancas.filter((child) => isBirthdayOn(child.nascimento, appointment.data)).length;
  const deficiencyCount = appointment.criancas.filter((child) => child.hasDeficiency).length;
  const interpreterCount = appointment.criancas.filter((child) => child.needsInterpreter).length;
  const hasWarnings = birthdayCount + deficiencyCount + interpreterCount > 0;

  return (
    <ModalContent>
      <ModalTitle className="pr-8 text-lg font-semibold text-slate-900">{appointment.atividade}</ModalTitle>
      <ModalDescription className="mt-1 text-sm text-slate-500">{appointment.parceiro}</ModalDescription>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <InfoRow label="Data" value={appointment.data} />
        <InfoRow label="Horário" value={appointment.horario} />
        <InfoRow label="Agendamentos" value={`${appointment.criancas.length} criança(s)`} />
        <InfoRow label="Vagas restantes" value={spotsLeft === null ? "--" : String(spotsLeft)} />
        {appointment.link ? (
          <div className="col-span-2 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Link</span>
            <a
              href={appointment.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              Abrir
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </dl>

      {hasWarnings ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {birthdayCount > 0 ? (
            <WarningBadge icon={<Cake className="h-3.5 w-3.5" aria-hidden="true" />} tone="amber">
              {birthdayCount} aniversariante(s)
            </WarningBadge>
          ) : null}
          {deficiencyCount > 0 ? (
            <WarningBadge icon={<Accessibility className="h-3.5 w-3.5" aria-hidden="true" />} tone="violet">
              {deficiencyCount} precisa(m) de atenção especial
            </WarningBadge>
          ) : null}
          {interpreterCount > 0 ? (
            <WarningBadge icon={<Languages className="h-3.5 w-3.5" aria-hidden="true" />} tone="sky">
              {interpreterCount} precisa(m) de intérprete
            </WarningBadge>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Crianças</h3>
        {appointment.criancas.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhuma criança agendada neste horário.</p>
        ) : (
          <ul className="space-y-2">
            {appointment.criancas.map((child) => (
              <ChildRow key={child.id} child={child} appointmentDate={appointment.data} />
            ))}
          </ul>
        )}
      </div>
    </ModalContent>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-800">{value}</dd>
    </div>
  );
}

const WARNING_TONE_CLASSES = {
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  sky: "bg-sky-50 text-sky-700"
} as const;

function WarningBadge({
  icon,
  tone,
  children
}: {
  icon: ReactNode;
  tone: keyof typeof WARNING_TONE_CLASSES;
  children: ReactNode;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${WARNING_TONE_CLASSES[tone]}`}>
      {icon}
      {children}
    </span>
  );
}

function ChildRow({ child, appointmentDate }: { child: AppointmentChild; appointmentDate: string }) {
  const age = getAgeAt(child.nascimento, appointmentDate);
  const isBirthday = isBirthdayOn(child.nascimento, appointmentDate);

  return (
    <li className="rounded-lg border border-slate-200 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-800">{child.nome}</p>
          <p className="text-xs text-slate-500">
            Responsável: {child.responsavel}
            {age !== null ? ` · ${age} ano(s)` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {isBirthday ? (
            <ChildTag icon={<Cake className="h-3 w-3" aria-hidden="true" />} tone="amber">
              Aniversário
            </ChildTag>
          ) : null}
          {child.hasDeficiency ? (
            <ChildTag icon={<Accessibility className="h-3 w-3" aria-hidden="true" />} tone="violet">
              Atenção especial
            </ChildTag>
          ) : null}
          {child.needsInterpreter ? (
            <ChildTag icon={<Languages className="h-3 w-3" aria-hidden="true" />} tone="sky">
              Intérprete
            </ChildTag>
          ) : null}
        </div>
      </div>
      {child.observation ? <p className="mt-2 text-xs text-slate-600">Obs.: {child.observation}</p> : null}
    </li>
  );
}

function ChildTag({
  icon,
  tone,
  children
}: {
  icon: ReactNode;
  tone: keyof typeof WARNING_TONE_CLASSES;
  children: ReactNode;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${WARNING_TONE_CLASSES[tone]}`}>
      {icon}
      {children}
    </span>
  );
}
