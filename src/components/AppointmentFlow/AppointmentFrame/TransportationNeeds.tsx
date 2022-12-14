import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps, TTransportationData} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from './Actions';
import {styled, Theme} from "@material-ui/core";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {collectServiceRequestIds} from "./utils";
import {ITransportation} from '../../../api/types';
import {TArgCallback, TCallback} from "../../../types/types";
import {setTransportation} from "../../../store/reducers/appointmentFrameReducer/actions";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import theme from "../../../theme/theme";
import {Loading} from "../../UI/Loading";
import ReactGA from "react-ga";
import {useTranslation} from "react-i18next";
import {ETransportColumn} from "../../../store/reducers/transportationNeeds/types";

const CardWrapper = styled(({active, ...props}) => (<div {...props}/>))<Theme, {active?: boolean}>(({theme, active}) => ({
    width: 287,
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

const TextWrapper = styled('div')(() => ({
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: '20px 40px'
}))

type TTransportationProps = {
    transportation: string;
    selectedTransportation: ITransportation|null;
    active?: boolean;
    options: ITransportation[]|null;
    onSelect: TCallback;
    onSelectOption: TArgCallback<ITransportation>;
}
const TransportationCard: React.FC<TTransportationProps> = ({selectedTransportation, transportation, active, options, onSelectOption, onSelect}) => {
    const {t} = useTranslation();

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
                        {t(option.description)}
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
    const {transportation} = useSelector((state: RootState) => state.appointmentFrame);
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

    const serviceRequestIds = useMemo(() => {
        return collectServiceRequestIds(s, ss, null, individualOps);
    }, [s, ss, individualOps]);
    const transportationNo = useMemo(() => transportations.filter(item => item.column === ETransportColumn.No), [transportations])
    const transportationYes = useMemo(() => transportations.filter(item => item.column === ETransportColumn.Yes), [transportations])

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

    const handleSelectGeneric = (column: ETransportColumn) => {
        const options = transportations.filter(item => item.column === column);
        if (options.length) {
            dispatch(setTransportation(options[0]));
        }
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
            : transportations.length ? <TransportationWrapper>
                    {transportationNo.length ? <TransportationCard
                        active={Boolean(transportationNo.find(item => item.id === transportation?.id))}
                        selectedTransportation={transportation}
                        transportation={`${t("No, I will")}:`}
                        options={transportationNo}
                        onSelect={() => handleSelectGeneric(ETransportColumn.No)}
                        onSelectOption={handleSelectOption}
                    /> : null}
                    {transportationYes.length ? <TransportationCard
                        active={Boolean(transportationYes.find(item => item.id === transportation?.id))}
                        options={transportationYes}
                        selectedTransportation={transportation}
                        transportation={`${t("Yes, I would like")}:`}
                        onSelect={() => handleSelectGeneric(ETransportColumn.Yes)}
                        onSelectOption={handleSelectOption}
                    /> : null}
            </TransportationWrapper>
                : <TextWrapper>
                    {t("We are sorry but no transportation options are available on the date and time you selected.")} {t("You can always drop off your vehicle and pick it up at your convenience when the service work is completed")}
                </TextWrapper>
        }
        <Actions onBack={onBack} onNext={handleNext} />
    </StepWrapper>
};