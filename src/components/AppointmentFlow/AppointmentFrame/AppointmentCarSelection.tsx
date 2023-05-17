import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Title} from "./Title";
import {CarCard} from "./CarCard";
import {styled, Theme, useMediaQuery, useTheme} from "@material-ui/core";
import {Actions} from "./Actions";
import {TArgCallback, TCallback} from "../../../types/types";
import { StepWrapper } from './StepWrapper';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {ILoadedVehicle} from "../../../api/types";
import {checkSelectedCar} from "./utils";
import {setMaintenanceDetails} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useTranslation} from "react-i18next";
import {TScreen} from "../../Layout/types";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {TServiceTypeSettings} from "../../../store/reducers/bookingFlowConfig/types";

const CarsWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    gap: "20px",
    width: "100%",
    justifyContent: "stretch"
});

const Info = styled('div')({
    fontSize: 18,
    "& span": {
        fontWeight: "bold",
        textDecoration: "underline",
        cursor: "pointer",
        "&:hover": {
            textDecoration: "none"
        }
    }
});

const Arrow = styled("span")<Theme, {disabled?: boolean}>(({theme, disabled}) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    cursor: "pointer",
    border: "1px solid #91CFF7",
    backgroundColor: "#E5F5FF",
    color: "#202021",
    opacity: disabled ? 0.4 : 1,
    "&:hover": {
        border: "1px solid #E5F5FF",
        backgroundColor: "#91CFF7",
    },
    "& .text": {
        position: 'absolute',
        bottom: -24,
        fontSize: 12,
        whiteSpace: 'nowrap',
        [theme.breakpoints.down("sm")]: {
            bottom: -40,
            fontSize: 12,
            whiteSpace: 'normal',
            textAlign: 'center',
        }
    }
}));

type TProps = {
    onNext: TCallback;
    onBack: TCallback;
    onAddNew: TCallback;
    onAddNewCarAppointment: TArgCallback<ILoadedVehicle>;
    loading: boolean;
    clearData: () => void;
    needToShowServiceSelection: boolean;
    handleServiceTypeSelection: () => void;
    currentConfig: TServiceTypeSettings|undefined;
    handleSetScreen: TArgCallback<TScreen>;
    onSelectCar: TArgCallback<ILoadedVehicle>;
}
export const AppointmentCarSelection: React.FC<TProps> = ({
                                                              onNext, onBack, loading, onAddNew, onAddNewCarAppointment, clearData, handleSetScreen,
                                                              needToShowServiceSelection, handleServiceTypeSelection, currentConfig, onSelectCar
                                                          }) => {

    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const {
        selectedVehicle,
        valueService,
        serviceType,
        consultants
    } = useSelector((state: RootState) => state.appointmentFrame);
    const [idx, setIdx] = useState<number>(0);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("xs"));
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const vehiclesPerScreen = useMemo(() => {
        return isXs ? 1 : 2;
    }, [isXs]);

    const next = () => {
        if (!nextDisabled()) {
            setIdx(p => p + 1);
        }
    }
    const prev = () => {
        if (!prevDisabled()) {
            setIdx(p => p - 1);
        }
    }

    const getNextScreen = useCallback((): TScreen => {
        let nextScreen: TScreen = serviceType === EServiceType.VisitCenter ? 'serviceNeeds' : 'location';
        if (valueService?.selectedService) {
            nextScreen = currentConfig?.advisorSelection
                ? 'consultantSelection'
                : 'appointmentTiming'
        }
        return nextScreen;
    }, [serviceType, valueService, currentConfig, consultants])

    useEffect(() => {
        if (customerLoadedData && (!customerLoadedData.vehicles?.length || customerLoadedData?.fromSearchByName)) {
            if (needToShowServiceSelection) {
                handleServiceTypeSelection()
            } else {
                handleSetScreen(getNextScreen());
            }
        }
        dispatch(setMaintenanceDetails({ mileage: ''}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerLoadedData, selectedVehicle]);

    const nextDisabled = () => idx >= (customerLoadedData?.vehicles.length ?? 0) - vehiclesPerScreen;
    const prevDisabled = () => idx <= 0;

    const isSelected = (vehicle: ILoadedVehicle) => {
        if (!selectedVehicle) {
            return false;
        }
        if (!selectedVehicle.vin) {
            return selectedVehicle.make === vehicle.make
                && selectedVehicle.model === vehicle.model
                && selectedVehicle.year === vehicle.year;
        }
        return selectedVehicle.vin === vehicle.vin;
    }

    return (
        <StepWrapper>
            <Title>{t("Which vehicle are you coming in for?")}</Title>
            <CarsWrapper>
                {customerLoadedData?.vehicles.length ?
                    <>
                        <Arrow onClick={prev} disabled={prevDisabled()}>
                            <ChevronLeft />
                            <span className="text" style={{left: isSm ? -6 : -27}}>Previous Vehicle</span>
                        </Arrow>
                        {customerLoadedData.vehicles
                            .slice(idx, idx + vehiclesPerScreen)
                            .map((vehicle, index) =>
                                <CarCard
                                    onNext={onNext}
                                    onSelectCar={onSelectCar}
                                    onAddNewAppointment={onAddNewCarAppointment}
                                    selected={isSelected(vehicle)}
                                    clearData={clearData}
                                    car={vehicle}
                                    key={vehicle.dmsId || new Date().toISOString() + index}/>
                            )}
                        <Arrow onClick={next} disabled={nextDisabled()}>
                            <ChevronRight />
                            <span className="text" style={{left: isSm ? -4 : -13}}>Next Vehicle</span>
                        </Arrow>
                    </> : <p>{t("No vehicles present")}</p>
                }
            </CarsWrapper>
            <Info>
                {t("Click here to")} <span onClick={onAddNew}>{t("add new vehicle")}</span>
            </Info>
            <Actions
                hideNext
                onBack={onBack}
                nextLabel={t("Next")}
                onNext={onNext}
                nextDisabled={!selectedVehicle
                    || !checkSelectedCar(selectedVehicle, customerLoadedData?.vehicles)}
                loading={loading} />
        </StepWrapper>
    );
};