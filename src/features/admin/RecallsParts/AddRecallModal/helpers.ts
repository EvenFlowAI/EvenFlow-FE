import { ICreateUpdateRecall, IRecall } from '../../../../store/reducers/recall/types';
import { IMakeExtended } from '../../../../api/types';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';
import { TForm } from './types';

export const mapRecallToForm = (
  editingItem: IRecall,
  makes: IMakeExtended[],
  allAssignedList: IAssignedServiceRequest[]
): TForm => {
  const make = makes.find(el => el.id === editingItem.make?.id);
  const models =
    make?.models.filter(el => editingItem.models.find(item => item.id === el.id)) ?? [];
  const sr = allAssignedList.find(item => item.id === editingItem.serviceRequest?.id);

  return {
    recallCampaignNumber: editingItem.recallCampaignNumber ?? '',
    make: make ?? null,
    models,
    yearFrom: editingItem.yearFrom?.toString() ?? '',
    yearTo: editingItem.yearTo?.toString() ?? '',
    recallComponent: editingItem.recallComponent,
    recallSummary: editingItem.recallSummary,
    serviceRequest: sr ?? null,
    oemProgram: editingItem.oemProgram ?? '',
  };
};

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
