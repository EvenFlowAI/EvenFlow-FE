import { IPackageById, IPackageOptionDetailed, TSegmentTitle } from '../../../../api/types';

export const buildOptionsRows = (packageData: IPackageById) =>
  packageData.serviceRequests
    .slice()
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(request => ({
      requestId: request.id,
      cellData: packageData.options.map(option => ({
        optionType: option.type,
        isSelected: !!option.serviceRequests.find(item => item.serviceRequestId === request.id),
      })),
    }));

export const buildComplimentaryRows = (packageData: IPackageById) =>
  packageData.complimentaryServices
    .slice()
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(request => ({
      requestId: request.id,
      cellData: packageData.options.map(option => ({
        optionType: option.type,
        isSelected: option.complimentaryServices.includes(request.id),
      })),
    }));

export const buildUpsellRows = (packageData: IPackageById) =>
  packageData.intervalUpsells
    .slice()
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(request => ({
      requestId: request.id,
      cellData: packageData.options.map(option => ({
        optionType: option.type,
        isSelected: Boolean(
          option.intervalUpsells.find(item => item.serviceRequestId === request.id)
        ),
      })),
    }));

export const updatePackageOption = (
  packageData: IPackageById,
  optionType: number,
  updater: (option: IPackageOptionDetailed) => IPackageOptionDetailed
): IPackageById => {
  const option = packageData.options.find(item => item.type === optionType);
  if (!option) {
    return packageData;
  }

  const updatedOption = updater(option);
  return {
    ...packageData,
    options: packageData.options
      .filter(item => item.type !== updatedOption.type)
      .concat(updatedOption)
      .sort((a, b) => a.type - b.type),
  };
};

export const trimSegmentTitles = (titles: TSegmentTitle[]): TSegmentTitle[] =>
  titles.map(item => ({ ...item, title: item.title.trim() }));

export const normalizePackageOptions = (options: IPackageOptionDetailed[]) =>
  options.map(option => ({
    ...option,
    complimentaryServiceLaborHours: +option.complimentaryServiceLaborHours,
    complimentaryServicePrice: +option.complimentaryServicePrice,
    serviceRequestLaborHours: +option.serviceRequestLaborHours,
    serviceRequestPrice: +option.serviceRequestPrice,
    intervalUpsellServiceLaborHours: +option.intervalUpsellServiceLaborHours,
    intervalUpsellServicePrice: +option.intervalUpsellServicePrice,
  }));
