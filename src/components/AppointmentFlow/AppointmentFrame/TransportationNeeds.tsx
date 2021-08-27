import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';
import {styled, Theme} from "@material-ui/core";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {collectServiceRequestIds} from "./utils";
import { ITransportation } from '../../../api/types';
import {TArgCallback, TCallback} from "../../../types/types";
import {setTransportation} from "../../../store/reducers/appointmentFrameReducer/actions";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";

const CardWrapper = styled('div')<Theme, {active?: boolean}>({
    minHeight: 264,
    fontSize: 22,
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    border: ({active}) => `1px solid ${active ? "#000000" : "#DADADA"}`,
    transition: "all .2s"
});

const CardOptions = styled('ul')({
    listStyle: "none",
    margin: 0,
    padding: 0,
    fontSize: 14,
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column",
    gap: "8px",
    fontWeight: "normal",
    width: "100%",
    "&>li": {
        border: '1px solid #DADADA',
        cursor: "pointer",
        textAlign: "left",
        padding: 8,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        "&.active": {
            border: "1px solid #000000"
        }
    }
})

const TransportationWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px"
});

type TTransportationProps = {
    transportation: string;
    selectedTransportation: ITransportation|null;
    active?: boolean;
    options: ITransportation[]|null;
    onSelect: TCallback;
    onSelectOption: TArgCallback<ITransportation>;
}
const TransportationCard: React.FC<TTransportationProps> = ({selectedTransportation, transportation, active, options, onSelectOption, onSelect}) => {
    const handleClick = (t: ITransportation) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        onSelectOption(t);
    }
    return <CardWrapper onClick={onSelect} active={active}>
        {transportation}
        {(active && options)
            ? <CardOptions>{options.map(option => {
                const isActive = option.type === selectedTransportation?.type
                    return <li
                        onClick={handleClick(option)}
                        className={isActive ? "active" : undefined}
                        key={option.type}>
                        {isActive ? <RadioButtonChecked fontSize={'small'} /> : <RadioButtonUnchecked fontSize={'small'} />}
                        {option.description}
                    </li>;
                }
            )}</CardOptions>
            : null}
    </CardWrapper>
}

export const TransportationNeeds: React.FC<TActionProps> = ({onNext, onBack}) => {
    const {id} = useParams();
    const [transportations, setTransportations] = useState<ITransportation[]>([]);
    const transportation = useSelector((state: RootState) => state.appointmentFrame.transportation);

    const [tOptions, customOption]: [ITransportation[], ITransportation|null] = useMemo(() => {
        if (transportations.length) {
            const last = transportations[transportations.length - 1];
            const rest = transportations.slice(0, transportations.length - 1);
            return [rest, last];
        }
        return [[], null];
    }, [transportations]);

    const dispatch = useDispatch();

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
        Api.call<ITransportation[]>(
            Api.endpoints.TransportationOptions.GetActive,
            {
                data: {
                    serviceCenterId: decodeSCID(id),
                    serviceRequestIds,
                    maintenancePackageOptionId: null
                }
            }
        ).then(({data}) => {
            setTransportations(data);
        })
    }, [id, serviceRequestIds]);

    const handleSelectOption = (o: ITransportation|null) => {
        dispatch(setTransportation(o));
    }

    const handleSelectGeneric = () => {
        if (tOptions && (transportation === null || transportation.type === customOption?.type)) {
            dispatch(setTransportation(tOptions[0]));
        }
    }

    return <StepWrapper>
        <TransportationWrapper>
            <TransportationCard
                active={transportation === null}
                selectedTransportation={transportation}
                transportation={"Yes, I will be waiting"}
                options={null}
                onSelect={() => handleSelectOption(null)}
                onSelectOption={handleSelectOption}
            />
            {tOptions.length ? <TransportationCard
                active={Boolean(transportation && transportation.type !== customOption?.type)}
                options={tOptions}
                selectedTransportation={transportation}
                transportation={"No, I would like transportation options"}
                onSelect={handleSelectGeneric}
                onSelectOption={handleSelectOption}
            /> : null}
            {customOption ? <TransportationCard
                active={transportation?.type === customOption.type}
                transportation={customOption.description}
                selectedTransportation={transportation}
                options={null}
                onSelect={() => handleSelectOption(customOption)}
                onSelectOption={handleSelectOption}
            /> : null}
        </TransportationWrapper>
        <Actions onBack={onBack} onNext={onNext} />
    </StepWrapper>
};