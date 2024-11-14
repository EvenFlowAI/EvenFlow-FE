import {IGlobalMake} from "../../../store/reducers/globalVehicles/types";

export const initialOrder = {
    orderBy: "VinName",
    isAscending: true,
}
export const sortMakesById = (a: IGlobalMake, b: IGlobalMake): number => {
    return a.localId - b.localId
}