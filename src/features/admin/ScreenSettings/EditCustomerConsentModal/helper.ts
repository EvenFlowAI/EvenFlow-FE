import dayjs from 'dayjs';
import { timeSpanString } from '../../../../utils/constants';
import { TForm } from './types';
import { ISlotRange } from '../../../../store/reducers/slotScoring/types';
import { IBaseCustomerConsent } from '../../../../store/reducers/screenSettings/types';
import { IPodShort } from '../../../../store/reducers/pods/types';

export function hasStartTimeError(
  form: TForm,
  slotRange: ISlotRange | null,
  formIsChecked: boolean
) {
  if (!formIsChecked) return false;

  const from = dayjs(form.appointmentTimeFrom, timeSpanString);
  const to = dayjs(form.appointmentTimeTo, timeSpanString);
  const start = dayjs(slotRange?.start, timeSpanString);
  const end = dayjs(slotRange?.end, timeSpanString);

  return (
    to.isSameOrBefore(from, 'minute') ||
    from.isBefore(start, 'minute') ||
    from.isAfter(end, 'minute')
  );
}

export function hasEndTimeError(form: TForm, slotRange: ISlotRange | null, formIsChecked: boolean) {
  if (!formIsChecked) return false;

  const from = dayjs(form.appointmentTimeFrom, timeSpanString);
  const to = dayjs(form.appointmentTimeTo, timeSpanString);
  const start = dayjs(slotRange?.start, timeSpanString);
  const end = dayjs(slotRange?.end, timeSpanString);

  return (
    to.isSameOrBefore(from, 'minute') || to.isBefore(start, 'minute') || to.isAfter(end, 'minute')
  );
}

interface BuildConsentParams {
  form: TForm;
  selectedSC: { id: number };
  selectedPod?: IPodShort | null;
  allModelIds: number[];
}

export function buildCustomerConsent({
  form,
  selectedSC,
  selectedPod,
  allModelIds,
}: BuildConsentParams): IBaseCustomerConsent {
  return {
    serviceCenterId: selectedSC.id,
    podId: selectedPod?.id ?? null,
    name: form.name,
    title: form.title,
    makeIds: form.makes.map(({ id }: { id: number }) => id),
    modelIds: allModelIds,
    modelYearFrom: form.modelYearFrom ?? null,
    modelYearTo: form.modelYearTo ?? null,
    customerType: form.customerType ?? null,
    serviceRequestIds: form.serviceRequests.map(({ id }: { id: number }) => id),
    serviceBookIds: form.serviceBooks.map(({ id }: { id: number }) => id),
    appointmentTimeFrom: form.appointmentTimeFrom ?? '',
    appointmentTimeTo: form.appointmentTimeTo ?? '',
    daysOfWeek: form.daysOfWeek,
    advisorIds: form.advisors.map(({ id }: { id: string }) => id),
    transportationOptionIds: form.transportationOptions.map(({ id }: { id: number }) => id),
    mobileServiceZoneIds: form.mobileServiceZones.map(({ id }: { id: number }) => id),
    serviceValetZoneIds: form.serviceValetZones.map(({ id }: { id: number }) => id),
    isWaitlistEnabled: form.isWaitlistEnabled,
    message: form.message,
  };
}
