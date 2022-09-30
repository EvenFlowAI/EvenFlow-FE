import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps, TTransportationData} from "./types";
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
import theme from "../../../theme/theme";
import {Loading} from "../../UI/Loading";
import ReactGA from "react-ga";
import {useTranslation} from "react-i18next";

const CardWrapper = styled(({active, ...props}) => (<div {...props}/>))<Theme, {active?: boolean}>(({theme, active}) => ({
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
    background: active ? "#000000" : "transparent",
    color: active ? "#FFFFFF" : theme.palette.text.primary,
    border: `1px solid ${active ? "#000000" : "#DADADA"}`,
    transition: "all .2s",
    [theme.breakpoints.down("sm")]: {
        minHeight: 100
    }
}));

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
        transition: "all .2s",
        color: theme.palette.text.primary,
        background: "#FFFFFF",
        "&.active": {
            border: "1px solid #FFFFFF",
            color: "#FFFFFF",
            background: "#000000"
        }
    }
})

const TransportationWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));

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
    const {t} = useTranslation();
    const [transportations, setTransportations] = useState<ITransportation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedLocally, setSelectedLocally] = useState<ITransportation|null>(null);
    const transportation = useSelector((state: RootState) => state.appointmentFrame.transportation);
    const [
        s, ss,
        individualOps, categoriesIds, packageOpt, appointmentDate,
        hashKey
    ] = useSelector((state: RootState) => [
        state.appointmentFrame.service,
        state.appointmentFrame.subService,
        state.appointment.selectedSR,
        state.appointmentFrame.categoriesIds,
        state.appointmentFrame.selectedPackage,
        state.appointment.appointment?.appointmentDate,
        state.appointmentFrame.hashKey,
    ]);
    //
    // const [tOptions, customOption]: [ITransportation[], ITransportation|null] = useMemo(() => {
    //     if (transportations.length) {
    //         const last = transportations[transportations.length - 1];
    //         const rest = transportations.slice(0, transportations.length - 1);
    //         return [rest, last];
    //     }
    //     return [[], null];
    // }, [transportations]);
    const serviceRequestIds = useMemo(() => {
        return collectServiceRequestIds(s, ss, null, individualOps);
    }, [s, ss, individualOps]);
    const localOptions = useMemo(() => ([
        {type:0, name: '', description: t("Wait at the dealership")},
        {type: 1, name: '', description: t("Drop off my vehicle and have a ride")}
    ]), [])
    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(true);
        const data: TTransportationData = {
            serviceCenterId: decodeSCID(id),
            serviceRequestIds,
            maintenancePackageOptionId: packageOpt?.id ?? null,
            slot: appointmentDate,
            serviceCategoryIds: packageOpt?.id || serviceRequestIds.length ? [] : categoriesIds,
        }
        if (appointmentDate) data.slot = appointmentDate;
        if (hashKey) data.appointmentHashKey = hashKey;

        Api.call<ITransportation[]>(Api.endpoints.TransportationOptions.GetActive, {data})
            .then(({data}) => {
            setTransportations(data);
        })
            .finally(() => {
                setLoading(false)
            })
    }, [id, serviceRequestIds, packageOpt]);

    const handleSelectOption = (o: ITransportation|null) => {
        dispatch(setTransportation(o));
    }

    const handleSelectNo = (o: ITransportation) => {
        dispatch(setTransportation(null));
        setSelectedLocally(o);
    }

    const handleSelectGeneric = () => {
        setSelectedLocally(null);
        if (transportations?.length && (transportation === null)) {
            dispatch(setTransportation(transportations[0]));
        }
    }

    const handleSelectLocal = () => {
        setSelectedLocally(localOptions[0]);
        dispatch(setTransportation(null));
    }

    const handleNext = (): void => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Selected Transportation Need',
            label: `With Name ${transportation ? transportation.name : 'I Will Be Waiting'}`,
        })
        onNext();
    }

    return <StepWrapper>
        {loading ? <Loading/>
            : <TransportationWrapper>
                <TransportationCard
                    active={transportation === null}
                    selectedTransportation={selectedLocally}
                    transportation={`${t("No, I will")}:`}
                    options={localOptions}
                    onSelect={handleSelectLocal}
                    onSelectOption={handleSelectNo}
                />
                {transportations.length ? <TransportationCard
                    active={Boolean(transportation)}
                    options={transportations}
                    selectedTransportation={transportation}
                    transportation={`${t("Yes, I would like")}:`}
                    onSelect={handleSelectGeneric}
                    onSelectOption={handleSelectOption}
                /> : null}
                {/*{customOption ? <TransportationCard*/}
                {/*    active={transportation?.type === customOption.type}*/}
                {/*    transportation={customOption.description}*/}
                {/*    selectedTransportation={transportation}*/}
                {/*    options={null}*/}
                {/*    onSelect={() => handleSelectOption(customOption)}*/}
                {/*    onSelectOption={handleSelectOption}*/}
                {/*/> : null}*/}
            </TransportationWrapper>
        }
        <Actions onBack={onBack} onNext={handleNext} />
    </StepWrapper>
};