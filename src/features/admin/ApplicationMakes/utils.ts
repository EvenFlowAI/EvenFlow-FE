import {IGlobalMake, TStatisticPercentage, TVehicleStatistic} from "../../../store/reducers/globalVehicles/types";

export const initialOrder = {
    orderBy: "VinName",
    isAscending: true,
}

export const sortByLocalId = (a: IGlobalMake, b: IGlobalMake): number => {
    return a.localId - b.localId
}

export const roundToHundredth = (number: number): string => {
    return (Math.round(number * 100) / 100).toFixed(2)
}

export const getPercentage = (statistic: TVehicleStatistic): TStatisticPercentage | null => {
    if (statistic) {
        const total = (statistic.overriden + statistic.confirmed + statistic.notReviewed)
        const overriden = roundToHundredth(total / 100 * statistic.overriden);
        const confirmed = roundToHundredth(total / 100 * statistic.confirmed);
        const notReviewed = roundToHundredth(total / 100 * statistic.notReviewed);
        return {overriden, confirmed, notReviewed}
    }
    return null
}