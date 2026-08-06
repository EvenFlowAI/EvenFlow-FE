import { UPLOAD_CSV, VIN_CHECK_API } from '../../../../helper';
import { RecallListType } from '../../../../../../../store/reducers/recall/types';
import { RecallEventStatus } from '../../../types';

export const formatFileSize = (bytes: number): string => {
  const fmt = (n: number) => (n % 1 === 0 ? n.toFixed(0) : n.toFixed(1));
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1000 * 1000) return `${fmt(bytes / 1000)} KB`;
  if (bytes < 1000 * 1000 * 1000) return `${fmt(bytes / (1000 * 1000))} MB`;
  return `${fmt(bytes / (1000 * 1000 * 1000))} GB`;
};

export const getListMethodValue = (listType: RecallListType): string => {
  if (listType === RecallListType.VIN_CHECK_API) {
    return VIN_CHECK_API;
  }

  if (listType === RecallListType.CSV_UPLOADED) {
    return UPLOAD_CSV;
  }

  return '';
};

export const isRecallLocked = (status?: RecallEventStatus) =>
  status === RecallEventStatus.Running ||
  status === RecallEventStatus.CheckRequested ||
  status === RecallEventStatus.ResultsAvailable;
