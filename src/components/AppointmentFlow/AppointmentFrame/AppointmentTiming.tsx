import React, {useCallback, useEffect, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from './Actions';
import {styled, Theme, useMediaQuery, useTheme} from '@material-ui/core';
import {ReactComponent as SelectDateIcon} from "../../../assets/img/selectDateIcon.svg";
import {ReactComponent as FirstAvailableIcon} from "../../../assets/img/firstAvailableIcon.svg";
import {ReactComponent as OffersIcon} from "../../../assets/img/offersIcon.svg";
import {RadioButtonChecked, RadioButtonUnchecked} from "@material-ui/icons";
import {TArgCallback, TCallback} from "../../../types/types";
import {DatePicker} from "@material-ui/pickers";
import {DateRangeIcon} from "@material-ui/pickers/_shared/icons/DateRangeIcon";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setTime, setTiming} from "../../../store/reducers/appointmentFrameReducer/actions";
import moment from "moment";
import {EAppointmentTimingType, IAppointmentSlotsRequest} from "../../../store/reducers/appointment/types";
import {loadAppointmentSlots, selectAppointment} from "../../../store/reducers/appointment/actions";
import ReactGA from "react-ga";
import {decodeSCID} from "../../../utils/utils";
import {collectServiceRequestIds} from "./utils";
import {EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useParams} from "react-router-dom";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {useTranslation} from "react-i18next";

const TimingWrapper = styled('div')<Theme, {columns: number}>(({theme, columns}) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    width: "100%",
    alignItems: "stretch",
    gap: "20px",
    [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr"
    }
}));
const StyledDate = styled(DatePicker)(({theme}) => ({
    marginTop: 16,
    cursor: "pointer",
    "&>div:not(.Mui-disabled)": {
        borderColor: theme.palette.primary.main,
        cursor: "pointer",
        "&>input": {
            color: theme.palette.primary.main,
            cursor: "pointer"
        }
    },
    "&>div": {
        paddingRight: 4,
        backgroundColor: "#fff"
    },
    [theme.breakpoints.down("xs")]: {
        marginTop: 0
    }
}))
const CardWrapper = styled(({active, ...props}) => <div {...props}/>)<Theme, {active?: boolean}>(({theme, active}) => ({
    border: "1px solid #DADADA",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    borderColor: active ? "#000000" : "#DADADA",
    background: active ? "#E7E7E7" : "transparent",
    gap: "20px",
    padding: 20,
    fontSize: 15,
    transition: "all .2s",
    cursor: "pointer",
    "& .icon": {
        borderRadius: "50%",
        width: 86,
        height: 86,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#FFFFFF" : "#E7E7E7",
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    "&>div:last-child": {
        marginTop: "auto",
    },
    [theme.breakpoints.down("sm")]: {
        flexDirection: "row",
    }
}));

const MobileWrapper = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    flexGrow: 1,
    flexDirection: "column",
    "&>div+div": {
        marginTop: 8
    }
})

type TCard = {
    description: string;
    name: EAppointmentTimingType;
    icon: JSX.Element;
}
const cards: TCard[] = [
    {
        description: "See appointments with special offer and shorter wait times",
        icon: <OffersIcon />,
        name: EAppointmentTimingType.SpecialOffers
    },
    {
        description: "Choose a preferred date",
        icon: <SelectDateIcon />,
        name: EAppointmentTimingType.PreferredDate
    },
    {
        description: "Choose first available date",
        icon: <FirstAvailableIcon />,
        name: EAppointmentTimingType.FirstAvailable
    }
];

type TCardProps = {
    card: TCard;
    active?: boolean;
    onClick: TCallback;
    selectedTime: moment.Moment|null;
    onChangeTime: TArgCallback<moment.Moment|null>;
    isLoading: boolean;
}

const timingTypes = ['Special Offers', 'Preferred Date', 'First Available Date'];

const TimingCard: React.FC<TCardProps> = ({card, active, onClick,
                                              onChangeTime, selectedTime, isLoading}) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const {t} = useTranslation();
    const {appointmentSlots} = useSelector((state: RootState) => state.appointment)
    const shouldDisableDate = (date: moment.Moment|null) => !appointmentSlots.find(item => moment(item.date).format("YYYY-MM-DD") === moment(date).format('YYYY-MM-DD'));
    const content = card.name === EAppointmentTimingType.PreferredDate
        ? <StyledDate
            value={selectedTime}
            onChange={onChangeTime}
            disabled={!active}
            placeholder={t("Choose here")}
            disablePast
            // shouldDisableDate={shouldDisableDate}
            InputProps={{
                disableUnderline: true,
                endAdornment: <DateRangeIcon color={active ? "primary" : "disabled"}/>
            }}
        />
        : null;
    return <CardWrapper onClick={onClick} active={active}>
        {active ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
        <div className="icon">{card.icon}</div>
        {!isSm
            ? <>
                {content}
                <div>{card.description}</div>
            </>
            : <MobileWrapper>
                {content}
                <div>{card.description}</div>
            </MobileWrapper>
        }

    </CardWrapper>
}

export const AppointmentTiming: React.FC<TActionProps> = ({onNext, onBack}) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const {id} = useParams();
    const [
        selectedType,
        selectedTime,
        appointment,
        consultant,
        selectedPackage,
        customerData,
        selectedVehicle,
        service,
        subService,
        valueService,
        customerEnteredEmail,
        userType,
        vehicle,
        selectedOpsCodes,
        categoriesIds,
        allCategories,
        serviceType,
        selectedRecalls
    ] = useSelector(
        (state: RootState) => [
            state.appointmentFrame.selectedTiming,
            state.appointmentFrame.selectedTime,
            state.appointment.appointment,
            state.appointmentFrame.advisor,
            state.appointmentFrame.selectedPackage,
            state.appointment.customerLoadedData,
            state.appointment.customerSelectedVehicle,
            state.appointmentFrame.service,
            state.appointmentFrame.subService,
            state.appointmentFrame.valueService,
            state.appointment.customerEnteredEmail,
            state.appointmentFrame.userType,
            state.appointmentFrame.selectedVehicle,
            state.appointment.selectedSR,
            state.appointmentFrame.categoriesIds,
            state.categories.allCategories,
            state.appointmentFrame.serviceType,
            state.appointmentFrame.selectedRecalls,
        ]);

    useEffect(() => {
        setLoading(true);
        const date = moment();
        const dd: IAppointmentSlotsRequest = {
            appointmentTimingType: EAppointmentTimingType.PreferredDate,
            serviceCenterId: decodeSCID(id),
            consultantId: consultant?.id ?? null,
            fromDate: date.toISOString(),
            maintenancePackageOptionId: selectedPackage?.id ?? null,
            serviceRequestIds: collectServiceRequestIds(
                service, subService, selectedRecalls, selectedPackage, selectedOpsCodes
            ),
            serviceCategoryIds: getCategories(),
            countOfDays: 21,
            customerId: customerData?.id,
            warrantyExpiration: selectedVehicle?.warrantyExpiration,
            serviceType,
        }
        if (valueService?.selectedService) {
            dd.valueServiceOfferIds = [valueService.selectedService.id];
        }
        if (vehicle) {
            dd.vehicle = {
                vin: vehicle.vin,
                year: vehicle.year,
                make: vehicle.make,
                model: vehicle.model,
                mileage: vehicle.mileage,
            }
        }
        if (userType === EUserType.Existing && customerEnteredEmail) dd.searchTerm = customerEnteredEmail;
        dispatch(loadAppointmentSlots(dd, () => {}, () => setLoading(false)));
    }, [consultant, service, subService, selectedPackage, selectedOpsCodes, customerData, selectedVehicle, valueService, vehicle, userType, customerEnteredEmail])

    const getCategories = (): number[] => {
        return allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }

    const handleSelectTiming = (t: EAppointmentTimingType) => () => {
        dispatch(setTiming(t));
    }

    const handleChangeTime = (t: moment.Moment|null) => {
        dispatch(setTime(t));
        if (!moment(selectedTime).isSame(t, 'date')) {
            dispatch(selectAppointment(null));
        }
    }

    const isValid = Boolean(
        selectedType !== null
        && (selectedType !== EAppointmentTimingType.PreferredDate || selectedTime)
    );

    const onSubmit = useCallback((): void => {
        if (selectedType) {
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Timing Type',
                label: `Selected ${timingTypes[selectedType]}`,
            });
        }
        if (appointment?.timingType !== selectedType) dispatch(selectAppointment(null))
        onNext();
    }, [appointment, dispatch, onNext, selectedType])

    return (
        <StepWrapper>
            <TimingWrapper columns={2}>
                {cards.map((card, idx) => {
                    if (!idx) {
                        return null;
                    }
                    return <TimingCard
                        onClick={handleSelectTiming(card.name)}
                        card={card}
                        isLoading={isLoading}
                        onChangeTime={handleChangeTime}
                        selectedTime={selectedTime}
                        active={selectedType === card.name}
                        key={card.name}/>
                })}
            </TimingWrapper>
            <Actions onBack={onBack} onNext={onSubmit} nextDisabled={!isValid} />
        </StepWrapper>
    );
};