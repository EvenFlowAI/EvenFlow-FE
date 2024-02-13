import {IServiceCategory} from "../../../../api/types";
import {EOfferType} from "../../../../store/reducers/offers/types";

export const getOfferView = (selectedService: IServiceCategory): string => {
    if (selectedService.offer?.type === EOfferType.AmountOff) {
        return `${selectedService.offer?.valueOff}% Off`
    }
    if (selectedService.offer?.type === EOfferType.PercentOff) {
        return `${selectedService.offer?.valueOff}% Off`
    }
    if (selectedService.offer?.type === EOfferType.FreeService) {
        return selectedService?.offer?.title ?? ''
    }
    return '';
}