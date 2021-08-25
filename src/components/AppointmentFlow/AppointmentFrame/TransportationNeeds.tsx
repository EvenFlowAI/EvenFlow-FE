import React, {useEffect, useMemo} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';
import {styled, Theme} from "@material-ui/core";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {collectServiceRequestIds} from "./utils";

const CardWrapper = styled('div')<Theme, {active?: boolean}>({
    minHeight: 264,
    fontSize: 22,
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    border: ({active}) => `1px solid ${active ? "#000000" : "#DADADA"}`,
    transition: "all .2s"
});

const TransportationWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px"
});

type TTransportation = string;
const transportationNeeds: TTransportation[] = [
    "Yes, I will be waiting",
    "No, I would like transportation options",
    "No, I would like vehicle pick up / drop off services"
];

type TTransportationProps = {
    transportation: TTransportation;
    active?: boolean;
}
const TransportationCard: React.FC<TTransportationProps> = ({transportation, active}) => {
    return <CardWrapper active={active}>
        {transportation}
    </CardWrapper>
}

export const TransportationNeeds: React.FC<TActionProps> = ({onNext, onBack}) => {
    const {id} = useParams();
    const [
        s, ss
    ] = useSelector((state: RootState) => [
        state.appointmentFrame.service,
        state.appointmentFrame.subService
    ]);
    const serviceRequestIds = useMemo(() => {
        return collectServiceRequestIds(s, ss);
    }, [s, ss]);
    useEffect(() => {
        Api.call(
            Api.endpoints.TransportationOptions.GetActive,
            {
                data: {
                    serviceCenterId: decodeSCID(id),
                    serviceRequestIds,
                    maintenancePackageOptionId: null
                }
            }
        ).then(({data}) => {
            console.log(data)
        })
    }, [id, serviceRequestIds]);
    return <StepWrapper>
        <TransportationWrapper>
            {transportationNeeds.map((t, idx) => {
                return <TransportationCard active={!idx} transportation={t} key={t} />
            })}
        </TransportationWrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>
};