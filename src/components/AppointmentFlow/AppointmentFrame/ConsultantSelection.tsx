import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from './Actions';
import {styled, Theme} from "@material-ui/core";
import {ReactComponent as AnyConsultantIcon} from '../../../assets/img/advisor_black.svg';
import {ReactComponent as ConsultantIcon} from '../../../assets/img/advisor_grey.svg';
import {TCallback} from "../../../types/types";
import {IServiceConsultant} from '../../../api/types';
import {
    loadConsultants,
    setAdvisor, setCurrentFrameScreen,
    setSideBarActualSteps,
    setSideBarMenu,
    setSideBarStepsList
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../UI/Loading";
import {
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../store/reducers/appointment/actions";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {useTranslation} from "react-i18next";
import {collectServiceRequestIds, getCurrentMenu, getStepsMap, getStepsScreen, mapRecallsForRequest} from "./utils";
import {useParams} from "react-router-dom";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";

const ConsultantsWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gridGap: "20px",
    width: "100%",
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: "1fr 1fr",
    },
    [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: "1fr",
    }
}));

const ConsultantWrapper = styled(
    ({active, ...props}) => (<div {...props}/>))<Theme, {active?: boolean}>(({theme, active}) => ({
    display: 'grid',
    gridGap: 16,
    gridTemplateColumns: '1fr 1fr',
    border: `1px solid ${active ? "#000000" : "#DADADA"}`,
    color: active ? "#FFFFFF" : theme.palette.text.primary,
    background: active ? "#000000" : "transparent",
    alignItems: "center",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "18px",
    padding: 16,
    transition: "all .2s",
    cursor: "pointer",
    "& .icon-wrapper": {
        width: 84,
        display: "flex",
        alignItems: "center",
        justifyContent: 'center',
        height: 84,
        borderRadius: "50%",
        color: active ? "#FFFFFF" : theme.palette.text.primary,
    }
}));

const Avatar = styled('div')<Theme, {src?: string, contain?: boolean}>({
    width: 84,
    height: 84,
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    backgroundSize: ({contain}) => contain ? "contain" : "cover",
    backgroundImage: ({src}) => src ? `url('${src}')` : undefined,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
});

type TCardProps = {
    advisor?: IServiceConsultant;
    blank?: boolean;
    active?: boolean;
    onClick: TCallback;
}

const ConsultantCard: React.FC<TCardProps> = ({advisor, blank, active, onClick}) => {
    const {t} = useTranslation();
    return <ConsultantWrapper onClick={onClick} active={active}>
        {blank
            ? <div className={"icon-wrapper"}><AnyConsultantIcon width={84} height={84}/></div>
            : advisor?.iconPath
                ? <Avatar src={advisor?.iconPath}/>
                : <ConsultantIcon width={84} height={84}/>
        }
        <div>
            {blank ? t("Any available advisor") : advisor?.name ?? "-"}
        </div>
    </ConsultantWrapper>
}

export const ConsultantSelection: React.FC<TActionProps> = ({onNext, onBack}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const {
        advisor: selectedConsultant,
        consultants,
        selectedPackage,
        service,
        subService,
        categoriesIds,
        selectedVehicle,
        packagePricingType,
        serviceTypeOption,
        packageEMenuType,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSR, customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {allCategories} = useSelector((state: RootState) => state.categories);
    const {isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable} = useSelector((state: RootState) => state.bookingFlowConfig);
    const dispatch = useDispatch();
    const {id} = useParams();
    const {t} = useTranslation();

    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const serviceRequestIds = useMemo(() => {
        return collectServiceRequestIds(service, subService, null, selectedSR);
    }, [service, subService, selectedSR]);

    const getCategories = useCallback((): number[] => {
        return allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }, [allCategories, EServiceCategoryType, categoriesIds])

    useEffect(() => {
        dispatch(loadConsultants(id, serviceTypeOption?.id ?? null, onNext))
    }, [id, serviceRequestIds, selectedVehicle, getCategories, mapRecallsForRequest, packageEMenuType, packagePricingType, selectedPackage, serviceTypeOption])

    useEffect(() => {
        dispatch(setSideBarMenu(getCurrentMenu(serviceType, isAdvisorAvailable, isTransportationAvailable)))
    }, [serviceType, isAdvisorAvailable, isTransportationAvailable, getCurrentMenu])

    useEffect(() => {
        dispatch(setSideBarActualSteps(getStepsMap(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable)))
        dispatch(setSideBarStepsList(getStepsScreen(serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable)))
    }, [serviceType, isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, getStepsMap, getStepsScreen])

    const handleSelectConsultant = (c: IServiceConsultant|null) => () => {
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        dispatch(setAdvisor(c));
    }

    const handleBack = () => {
        customerLoadedData?.isUpdating ? dispatch(setCurrentFrameScreen("manageAppointment")) : onBack()
    }

    return (<StepWrapper>
        <ConsultantsWrapper>
            {loading || !isAdvisorAvailable ? <Loading /> : <React.Fragment>
                <ConsultantCard
                    blank
                    onClick={handleSelectConsultant(null)}
                    active={selectedConsultant === null}
                />
                {consultants.map(c =>
                    <ConsultantCard
                        onClick={handleSelectConsultant(c)}
                        advisor={c}
                        key={c.id}
                        active={selectedConsultant?.id === c.id} />
                )}
            </React.Fragment>
            }
        </ConsultantsWrapper>
        <Actions onNext={onNext} onBack={handleBack} nextLabel={t("Next")}/>
    </StepWrapper>);
};