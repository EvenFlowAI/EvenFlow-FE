import { ICreateUpdateRecall, IEditRecall, IRecall } from '../../../../store/reducers/recall/types';
import { IMakeExtended } from '../../../../api/types';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';
import { TForm } from './types';
import { getRecallVehicleLines } from '../utils';

export const mapRecallToForm = (
  editingItem: IRecall,
  makes: IMakeExtended[],
  allAssignedList: IAssignedServiceRequest[]
): TForm => {
  const lines = getRecallVehicleLines(editingItem);
  const makeId = lines.find(line => line.make)?.make?.id;
  const make = makes.find(el => el.id === makeId);
  const models = make?.models.filter(el => lines.some(line => line.model?.id === el.id)) ?? [];
  const sr = allAssignedList.find(item => item.id === editingItem.serviceRequest?.id);
  const years = lines
    .flatMap(line => [line.yearFrom, line.yearTo])
    .filter((year): year is number => year !== null);

  return {
    recallCampaignNumber: editingItem.recallCampaignNumber ?? '',
    make: make ?? null,
    models,
    yearFrom: years.length ? Math.min(...years).toString() : '',
    yearTo: years.length ? Math.max(...years).toString() : '',
    recallComponent: editingItem.recallComponent,
    recallSummary: editingItem.recallSummary,
    serviceRequest: sr ?? null,
    oemProgram: editingItem.oemProgram ?? '',
  };
};

export const buildEditRecallPayload = (form: TForm, serviceCenterId: number): IEditRecall => ({
  serviceCenterId,
  recallComponent: form.recallComponent.trim(),
  serviceRequestId: form.serviceRequest?.id ?? null,
});

export const buildRecallPayload = (form: TForm, serviceCenterId: number): ICreateUpdateRecall => {
  const data: ICreateUpdateRecall = {
    recallCampaignNumber: form.recallCampaignNumber,
    makeId: form.make?.id ?? null,
    modelIds: form.models.map(el => el.id),
    yearFrom: form.yearFrom?.length ? +form.yearFrom : null,
    yearTo: form.yearTo?.length ? +form.yearTo : null,
    recallComponent: form.recallComponent,
    recallSummary: form.recallSummary,
    serviceRequestId: form.serviceRequest?.id ?? null,
    serviceCenterId,
  };

  if (form.oemProgram) {
    data.oemProgram = form.oemProgram;
  }

  return data;
};
