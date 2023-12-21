import {IServiceRequest} from "../../../../store/reducers/serviceRequests/types";

export const getSortedRequests = (requests: IServiceRequest[]): IServiceRequest[] => {
    return [...requests].sort((a, b) => {
        return a.orderIndex !== undefined && b.orderIndex !== undefined
            ? a.orderIndex - b.orderIndex
            : 0
    })
}