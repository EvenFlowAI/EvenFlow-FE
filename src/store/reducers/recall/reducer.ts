import {createReducer} from "@reduxjs/toolkit";
import {IRecall} from "./types";
import {getRecalls, setLoading, setRecallPageData} from "./actions";
import {IPageRequest} from "../../../types/types";
import {IRecallByVin} from "../../../components/AppointmentFlow/AppointmentFrame/types";

const mockRecalls: IRecallByVin[] = [
    {
        shortDescription: "Airbag Recall for 2013 to 2015 Honda Civic Models",
        recallOpenDate: new Date().toDateString(),
        recallComponent: "Cfsgdfhgfgh",
        nhtsaRecallNumber: "324534566",
        recallStatus: "Recall Incomplete",
        summary: "On your vehicle, it may be possible the transmssion shifter cable bushing is damaged or missing.",
        safetyRisk: " damaged or missing bushing could prevent the shifter from moving the transmission into the intended gear position and cause the vehicle to move in an unexpected direction. The transmission may not be in the park position, even though the shifter position indicates that the",
        serviceRequestId: 67,
    },
    {
        shortDescription: "Airbag Recall for 2013 to 2015 Honda Civic Models",
        recallOpenDate: new Date().toDateString(),
        recallComponent: "Cfsgdfhg666",
        nhtsaRecallNumber: "324534566",
        recallStatus: "Recall Incomplete",
        summary: "On your vehicle, it may be possible the transmssion shifter cable bushing is damaged or missing.",
        safetyRisk: " damaged or missing bushing could prevent the shifter from moving the transmission into the intended gear position and cause the vehicle to move in an unexpected direction. The transmission may not be in the park position, even though the shifter position indicates that the",
        serviceRequestId: 68,
    },
    {
        shortDescription: "Airbag Recall for 2013 to 2015 Honda Civic Models",
        recallOpenDate: new Date().toDateString(),
        recallComponent: "Cfsgdffgh",
        nhtsaRecallNumber: "324534566",
        recallStatus: "Recall Incomplete",
        summary: "On your vehicle, it may be possible the transmssion shifter cable bushing is damaged or missing.",
        safetyRisk: " damaged or missing bushing could prevent the shifter from moving the transmission into the intended gear position and cause the vehicle to move in an unexpected direction. The transmission may not be in the park position, even though the shifter position indicates that the",
        serviceRequestId: 69,
    },
    {
        shortDescription: "Airbag Recall for 2013 to 2015 Honda Civic Models",
        recallOpenDate: new Date().toDateString(),
        recallComponent: "Cfsgdfhg6",
        nhtsaRecallNumber: "324534566",
        recallStatus: "Recall Incomplete",
        summary: "On your vehicle, it may be possible the transmssion shifter cable bushing is damaged or missing.",
        safetyRisk: " damaged or missing bushing could prevent the shifter from moving the transmission into the intended gear position and cause the vehicle to move in an unexpected direction. The transmission may not be in the park position, even though the shifter position indicates that the",
        serviceRequestId: 65,
    }
]

type TState = {
    recalls: IRecall[];
    isLoading: boolean;
    recallPageData: IPageRequest;
    recallsCount: number,
    recallsByVin: IRecallByVin[];
}
const initialState: TState = {
    recalls: [],
    isLoading: false,
    recallsCount: 0,
    recallPageData: {
        pageIndex: 0,
        pageSize: 10,
    },
    recallsByVin: mockRecalls,
}

export const recallsReducer = createReducer(initialState, builder => builder
    .addCase(getRecalls, (state, {payload}) => {
        return {...state, recalls: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(setRecallPageData, (state, {payload}) => {
        return {...state, recallPageData: {...state.recallPageData, ...payload}};
    })
)