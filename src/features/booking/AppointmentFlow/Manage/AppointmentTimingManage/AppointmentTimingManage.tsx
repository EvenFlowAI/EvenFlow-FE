import React, {useMemo} from 'react';
import {TArgCallback, TScreen} from "../../../../../types/types";
import {AppointmentTiming} from "../../Screens/AppointmentTiming/AppointmentTiming";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {EServiceType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {setServiceTypeOption, setWelcomeScreenView} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {Routes} from "../../../../../routes/constants";
import {useHistory, useParams} from "react-router-dom";

const AppointmentTimingManage: React.FC<{handleSetScreen: TArgCallback<TScreen>}> = ({handleSetScreen}) => {
    const {
        serviceTypeOption,
        consultants,
        appointmentByKey,
        editingPosition,
    } = useSelector((state: RootState) => state.appointmentFrame)
    const {isAdvisorAvailable, isTransportationAvailable} = useSelector((state: RootState) => state.bookingFlowConfig)

    const dispatch = useDispatch();
    const {id} = useParams<{id: string}>();
    const history = useHistory();

    const fromServiceValetToVisitCenter = useMemo(() => {
        return serviceTypeOption?.type === EServiceType.VisitCenter
            && appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff
    }, [serviceTypeOption, appointmentByKey])

    const redirectToServiceTypeOptions = () => {
        dispatch(setServiceTypeOption(appointmentByKey?.serviceTypeOption ?? null))
        dispatch(setWelcomeScreenView('serviceSelect'));
        history.push(Routes.EndUser.Welcome + "/" + id + "?frame=1");
    }

    const onBack = () => {
        if (fromServiceValetToVisitCenter) {
            redirectToServiceTypeOptions()
        } else {
            if (editingPosition === 'slot') {
                handleSetScreen("manageAppointment")
            } else {
                const prev: TScreen = isTransportationAvailable && !serviceTypeOption?.transportationOption
                    ? "transportationNeeds"
                    : isAdvisorAvailable && consultants.length
                        ? 'consultantSelection'
                        : 'serviceNeeds'
                handleSetScreen(prev)
            }
        }
    }

    return <AppointmentTiming handleSetScreen={handleSetScreen} onBack={onBack}/>
};

export default AppointmentTimingManage;