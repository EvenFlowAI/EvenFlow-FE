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
        const overriden = statistic.overriden > 0 ? roundToHundredth(100 * statistic.overriden / total) : '0.00';
        const confirmed = statistic.confirmed > 0 ?roundToHundredth(100 * statistic.confirmed / total) : '0.00';
        const notReviewed = statistic.notReviewed > 0 ? roundToHundredth(100 * statistic.notReviewed / total) : '0.00';
        return {overriden, confirmed, notReviewed}
    }
    return null
}