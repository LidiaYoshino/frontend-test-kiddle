import { Plus } from "lucide-react";
import type { Matcher } from "react-day-picker";
import { type FormEvent, useEffect, useId, useMemo, useState } from "react";
import { DatePicker } from "../../../components/ui/DatePicker";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Loading } from "../../../components/ui/Loading";
import { Modal, ModalContent, ModalDescription, ModalTitle } from "../../../components/ui/Modal";
import { getErrorMessage } from "../../../lib/api/client";
import type { ActiveSubscriber, SchedulableActivity } from "../../../types/api";
import { createAppointment } from "../api/createAppointment";
import { getActiveSubscribers } from "../api/getActiveSubscribers";
import { getSchedulableActivities } from "../api/getSchedulableActivities";
import {
  getAvailableSlotsForActivityOnDate,
  getFirstSchedulableDate,
  getSchedulableWeekdays,
  isDateOnSchedulableWeekday
} from "../lib/activitySchedule";
import { formatDateForApi, parseApiDateString } from "../lib/dates";

interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  dateLabel: string;
  onCreated: () => void;
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-blue-500 placeholder:text-slate-400 focus:ring-2";
const selectClass = `${inputClass} bg-white`;
const labelClass = "mb-1 block text-xs font-medium text-slate-600";

function filterSubscribersWithKids(list: ActiveSubscriber[]): ActiveSubscriber[] {
  return list.filter((subscriber) => Array.isArray(subscriber.kids) && subscriber.kids.length > 0);
}

function sortSubscribersByName(list: ActiveSubscriber[]): ActiveSubscriber[] {
  return [...list].sort((left, right) => left.nome.localeCompare(right.nome, "pt-BR"));
}

function sortActivitiesByName(list: SchedulableActivity[]): SchedulableActivity[] {
  return [...list].sort((left, right) => left.nome.localeCompare(right.nome, "pt-BR"));
}

function sortKidsByName(subscriber: ActiveSubscriber | undefined) {
  if (!subscriber) {
    return [];
  }
  return [...subscriber.kids].sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

export function CreateAppointmentModal({ open, onClose, dateLabel, onCreated }: CreateAppointmentModalProps) {
  const formId = useId();

  const [subscribers, setSubscribers] = useState<ActiveSubscriber[]>([]);
  const [activities, setActivities] = useState<SchedulableActivity[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState("");
  const [selectedKidId, setSelectedKidId] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState("");

  const [formDate, setFormDate] = useState(() => parseApiDateString(dateLabel));
  const [slotIndex, setSlotIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    setDataLoading(true);
    setDataError(null);

    void Promise.all([getActiveSubscribers(), getSchedulableActivities()])
      .then(([subscribersResponse, activitiesResponse]) => {
        if (!cancelled) {
          setSubscribers(filterSubscribersWithKids(subscribersResponse.list ?? []));
          setActivities(activitiesResponse.list ?? []);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setDataError(getErrorMessage(requestError));
          setSubscribers([]);
          setActivities([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDataLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormDate(parseApiDateString(dateLabel));
    setSlotIndex(0);
    setSelectedSubscriberId("");
    setSelectedKidId("");
    setSelectedActivityId("");
    setSubmitError(null);
  }, [open, dateLabel]);

  const sortedSubscribers = useMemo(() => sortSubscribersByName(subscribers), [subscribers]);
  const sortedActivities = useMemo(() => sortActivitiesByName(activities), [activities]);

  const selectedSubscriber = useMemo(
    () => sortedSubscribers.find((subscriber) => subscriber.id === selectedSubscriberId),
    [sortedSubscribers, selectedSubscriberId]
  );

  const selectedActivity = useMemo(
    () => sortedActivities.find((activity) => activity.id === selectedActivityId),
    [sortedActivities, selectedActivityId]
  );

  const activityWeekdays = useMemo(
    () => (selectedActivity ? getSchedulableWeekdays(selectedActivity) : new Set<number>()),
    [selectedActivity]
  );

  const availableSlots = useMemo(() => {
    if (!selectedActivity) {
      return [];
    }
    return getAvailableSlotsForActivityOnDate(selectedActivity, formDate);
  }, [selectedActivity, formDate]);

  const dateDisabledMatcher = useMemo((): Matcher | undefined => {
    if (!selectedActivity) {
      return undefined;
    }
    if (activityWeekdays.size === 0) {
      return () => true;
    }
    return (date: Date) => {
      if (!isDateOnSchedulableWeekday(date, activityWeekdays)) {
        return true;
      }
      return getAvailableSlotsForActivityOnDate(selectedActivity, date).length === 0;
    };
  }, [selectedActivity, activityWeekdays]);

  const formDateValid = useMemo(
    () => Boolean(selectedActivity && availableSlots.length > 0),
    [selectedActivity, availableSlots.length]
  );

  const resolvedSlotIndex =
    availableSlots.length > 0 ? Math.min(slotIndex, availableSlots.length - 1) : 0;
  const selectedSlot = availableSlots[resolvedSlotIndex];

  useEffect(() => {
    setSlotIndex(0);
  }, [selectedActivityId, formDate]);

  const kidsForSelect = useMemo(() => sortKidsByName(selectedSubscriber), [selectedSubscriber]);

  const handleSubscriberChange = (subscriberId: string) => {
    setSelectedSubscriberId(subscriberId);
    const subscriber = sortedSubscribers.find((item) => item.id === subscriberId);
    const orderedKids = sortKidsByName(subscriber);
    setSelectedKidId(orderedKids[0]?.id ?? "");
  };

  const handleActivityChange = (activityId: string) => {
    setSelectedActivityId(activityId);
    if (!activityId) {
      return;
    }

    const activity = sortedActivities.find((item) => item.id === activityId);
    if (!activity) {
      return;
    }

    const weekdays = getSchedulableWeekdays(activity);
    const first = getFirstSchedulableDate(weekdays, new Date());
    if (first) {
      setFormDate(first);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!selectedActivity) {
      setSubmitError("Selecione uma atividade.");
      return;
    }

    if (!formDateValid || !selectedSlot) {
      setSubmitError("Escolha uma data com horário disponível (com vagas).");
      return;
    }

    const horarioValue = `${selectedSlot.horarioInicio}-${selectedSlot.horarioTermino}`;

    if (!selectedSubscriber || !selectedKidId) {
      setSubmitError("Selecione um usuário e uma criança.");
      return;
    }

    const kid = selectedSubscriber.kids.find((item) => item.id === selectedKidId);
    if (!kid) {
      setSubmitError("Criança inválida para o usuário selecionado.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAppointment(selectedSubscriber.id, {
        atividade_id: selectedActivity.id,
        kidId: kid.id,
        data: formatDateForApi(formDate),
        horario: horarioValue
      });
      onCreated();
      onClose();
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const dataReady = !dataLoading && !dataError;
  const hasUsersWithKids = sortedSubscribers.length > 0;
  const hasActivities = sortedActivities.length > 0;
  const canPickKid = Boolean(selectedSubscriber && kidsForSelect.length > 0);
  const formComplete =
    dataReady &&
    hasUsersWithKids &&
    hasActivities &&
    canPickKid &&
    Boolean(selectedActivityId && formDateValid && selectedSlot);

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
    >
      <ModalContent className="max-h-[min(90vh,40rem)]">
        <ModalTitle className="pr-8 text-lg font-semibold text-slate-900">Novo agendamento</ModalTitle>
        <ModalDescription className="mt-1 text-sm text-slate-500">
          Escolha o usuário e a criança, depois complete o agendamento.
        </ModalDescription>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {dataLoading ? (
            <div className="flex justify-center py-4">
              <Loading message="Carregando dados..." size="sm" />
            </div>
          ) : null}
          {dataError ? <ErrorMessage message={dataError} /> : null}
          {dataReady && !hasUsersWithKids ? (
            <p className="text-sm text-slate-600">Nenhum usuário com criança cadastrada está disponível.</p>
          ) : null}
          {dataReady && !hasActivities ? (
            <p className="text-sm text-slate-600">Nenhuma atividade disponível para agendamento.</p>
          ) : null}

          <div>
            <label className={labelClass} htmlFor={`${formId}-subscriber`}>
              Usuário (responsável) <span className="text-red-600">*</span>
            </label>
            <select
              id={`${formId}-subscriber`}
              name="subscriber"
              value={selectedSubscriberId}
              onChange={(event) => handleSubscriberChange(event.target.value)}
              disabled={!dataReady || !hasUsersWithKids}
              required
              className={selectClass}
            >
              <option value="">Selecione um usuário</option>
              {sortedSubscribers.map((subscriber) => (
                <option key={subscriber.id} value={subscriber.id}>
                  {subscriber.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-kid`}>
              Criança <span className="text-red-600">*</span>
            </label>
            <select
              id={`${formId}-kid`}
              name="kid"
              value={selectedKidId}
              onChange={(event) => setSelectedKidId(event.target.value)}
              disabled={!dataReady || !canPickKid}
              required={canPickKid}
              className={selectClass}
            >
              <option value="">
                {selectedSubscriber ? "Selecione a criança" : "Selecione um usuário primeiro"}
              </option>
              {kidsForSelect.map((kid) => (
                <option key={kid.id} value={kid.id}>
                  {kid.name} · {kid.birthDate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-activity`}>
              Atividade <span className="text-red-600">*</span>
            </label>
            <select
              id={`${formId}-activity`}
              name="activity"
              value={selectedActivityId}
              onChange={(event) => handleActivityChange(event.target.value)}
              disabled={!dataReady || !hasActivities}
              required
              className={selectClass}
            >
              <option value="">Selecione uma atividade</option>
              {sortedActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.nome.trim()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelClass}>Data</span>
            <DatePicker
              value={formDate}
              onChange={setFormDate}
              placeholder={selectedActivity ? "Data do agendamento" : "Selecione uma atividade primeiro"}
              disabled={dateDisabledMatcher}
              defaultMonth={formDate}
              remountKey={selectedActivityId || "no-activity"}
              triggerDisabled={!selectedActivity}
            />
            {selectedActivity && activityWeekdays.size === 0 ? (
              <p className="mt-1 text-xs text-amber-700">Esta atividade não tem horários na grade. Escolha outra atividade.</p>
            ) : null}
          </div>

          <div>
            <span className={labelClass}>
              Horário <span className="text-red-600">*</span>
            </span>
            {!selectedActivity ? (
              <p className="text-sm text-slate-500">Selecione uma atividade e uma data para ver o horário.</p>
            ) : !isDateOnSchedulableWeekday(formDate, activityWeekdays) ? (
              <p className="text-sm text-slate-500">Escolha uma data em que a atividade ocorre.</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-amber-800">Não há vagas neste dia para esta atividade. Escolha outra data.</p>
            ) : availableSlots.length === 1 ? (
              <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                {availableSlots[0].horarioInicio} – {availableSlots[0].horarioTermino}
                <span className="text-slate-500"> · {availableSlots[0].vagas} vaga(s)</span>
              </p>
            ) : (
              <select
                id={`${formId}-horario-slot`}
                name="horarioSlot"
                value={resolvedSlotIndex}
                onChange={(event) => setSlotIndex(Number(event.target.value))}
                className={selectClass}
              >
                {availableSlots.map((slot, index) => (
                  <option key={`${slot.horarioInicio}-${slot.horarioTermino}-${index}`} value={index}>
                    {slot.horarioInicio} – {slot.horarioTermino} ({slot.vagas} vaga(s))
                  </option>
                ))}
              </select>
            )}
          </div>

          {submitError ? <ErrorMessage message={submitError} /> : null}

          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formComplete}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? "Salvando..." : "Salvar agendamento"}
            </button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
