import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from './Actions';
import {styled, Theme} from "@material-ui/core";
import {ReactComponent as AnyConsultantIcon} from '../../../assets/img/advisor_black.svg';
import {ReactComponent as ConsultantIcon} from '../../../assets/img/advisor_grey.svg';
import {TCallback} from "../../../types/types";
import {IConsultantsRequestData, IServiceConsultant} from '../../../api/types';
import {
    loadConsultants,
    selectCategoriesIds,
    selectService,
    selectSubService,
    setAdvisor,
    setPackage,
    setPackageIsSelected,
    setSelectedPackageOptionType,
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
    selectSRMultiple
} from "../../../store/reducers/appointment/actions";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {useTranslation} from "react-i18next";
import {collectServiceRequestIds, getCurrentMenu, getStepsMap, getStepsScreen, mapRecallsForRequest} from "./utils";
import {useParams} from "react-router-dom";
import {decodeSCID} from "../../../utils/utils";

const ConsultantsWrapper = styled('div')(({theme}) => ({
    display: "grid",
   // gridTemplateColumns: "1fr 1fr 1fr 1fr",
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
    //display: "flex",
    display: 'grid',
    gridGap: 16,
    // rowGap: 16,
    // columnGap: 16,
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
        serviceType,
        selectedRecalls,
        selectedVehicle,
        packagePricingType,
        serviceTypeOption,
        address,
        zipCode,
        valueService,
        packageEMenuType,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSR} = useSelector((state: RootState) => state.appointment);
    const {allCategories} = useSelector((state: RootState) => state.categories);
    const {config} = useSelector((state: RootState) => state.bookingFlowConfig);
    const dispatch = useDispatch();
    const {id} = useParams();

    const currentConfig = useMemo(() => {
        return config.find(item => item.serviceType.toString() === serviceType.toString());
    }, [config, serviceType]);
    const advisorSelection = useMemo(() => Boolean(currentConfig?.advisorSelection) && Boolean(consultants.length), [currentConfig, consultants]);
    const appointmentSelection = useMemo(() => Boolean(currentConfig?.appointmentSelection), [currentConfig]);
    const transportationNeeds = useMemo(() => Boolean(currentConfig?.transportationNeeds), [currentConfig]);
    const serviceRequestIds = useMemo(() => {
        return collectServiceRequestIds(service, subService, null, selectedSR, selectedRecalls);
    }, [service, subService, selectedRecalls, selectedSR]);

    const getCategories = useCallback((): number[] => {
        return allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }, [allCategories, EServiceCategoryType, categoriesIds])

    useEffect(() => {
        if (selectedVehicle) {
            const maintenancePackageOption = selectedPackage
                ? {id: selectedPackage?.id, priceType: packagePricingType}
                : packageEMenuType !== null
                    ? {optionType: packageEMenuType}
                    : null;

            const data: IConsultantsRequestData = {
                serviceCenterId: decodeSCID(id),
                pageIndex: 0,
                pageSize: 0,
                serviceRequestIds,
                recalls: mapRecallsForRequest(selectedRecalls),
                serviceCategoryIds: getCategories(),
                maintenancePackageOption,
                serviceTypeOptionId: serviceTypeOption?.id ??  null,
                searchTerm: "",
                vehicle: {
                    vin: selectedVehicle.vin,
                    year: selectedVehicle.year,
                    make: selectedVehicle.make,
                    model: selectedVehicle.model,
                    mileage: selectedVehicle.mileage,
                    engineTypeId: selectedVehicle.engineTypeId,
                },
                address: typeof address === 'string' ? address : address?.label ?? '',
                zipCode,
            }
            if (valueService?.selectedService) {
                data.valueServiceOfferIds = [valueService.selectedService.id];
            }
            dispatch(loadConsultants(data, onNext))
        }
    }, [id, serviceRequestIds, selectedVehicle, selectedRecalls, getCategories, mapRecallsForRequest, packageEMenuType, packagePricingType, selectedPackage])

    useEffect(() => {
        dispatch(setSideBarMenu(getCurrentMenu(serviceType, advisorSelection, transportationNeeds)))
    }, [serviceType, advisorSelection, transportationNeeds, getCurrentMenu])

    useEffect(() => {
        dispatch(setSideBarActualSteps(getStepsMap(serviceType, advisorSelection, appointmentSelection, transportationNeeds)))
        dispatch(setSideBarStepsList(getStepsScreen(serviceType, advisorSelection, appointmentSelection, transportationNeeds)))
    }, [serviceType, advisorSelection, appointmentSelection, transportationNeeds, getStepsMap, getStepsScreen])

    const handleSelectConsultant = (c: IServiceConsultant|null) => () => {
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        dispatch(setAdvisor(c));
    }

    const clearPackage = () => {
        dispatch(setPackage(null));
        dispatch(selectService(null));
        dispatch(setSelectedPackageOptionType(null))
        dispatch(setPackageIsSelected(false));
    }

    const clearIndOpsCodes = () => {
        let codes: number[];
        const diagnoseCategory = allCategories.find(item => item.type === EServiceCategoryType.Diagnose);
        const diagnoseCategoryRequestsIds: number[] = diagnoseCategory?.serviceRequests.map(item => item.id) || [];
        codes = selectedSR.filter(item => {
            return !subService?.serviceRequests.find(el => item === el.id)
                || (diagnoseCategory && categoriesIds.includes(diagnoseCategory.id) && diagnoseCategoryRequestsIds.includes(item))
        })
        dispatch(selectSubService(null));
        dispatch(selectCategoriesIds(categoriesIds.filter(item => item !== subService?.id)));
        dispatch(selectSRMultiple(codes));
    }

    const clearDiagnoseCodes = () => {
        let codes: number[];
        const individualCategory = allCategories.find(item => item.type === EServiceCategoryType.IndividualServices);
        const individualRequestsIds = individualCategory?.serviceRequests.map(item => item.id) || [];
        codes = selectedSR.filter(code => {
            return !service?.serviceRequests.find(request => code === request.id)
                || (individualCategory && categoriesIds.includes(individualCategory?.id) && individualRequestsIds.includes(code))
        })
        dispatch(selectService(null));
        dispatch(selectCategoriesIds(categoriesIds.filter(item => item !== service?.id)));
        dispatch(selectSRMultiple(codes));
    }

    const clearCategories = () => {
        let categories = [...categoriesIds];
        if (service && categoriesIds?.includes(service.id)) {
            dispatch(selectService(null));
            categories = categories.filter(item => item !== service.id);
        }
        if (subService && categoriesIds?.includes(subService.id)) {
            dispatch(selectSubService(null));
            categories = categories.filter(item => item !== subService.id);
        }
        dispatch(selectCategoriesIds(categories));
    }

    const handleBack = () => {
        if (selectedPackage && service?.type === EServiceCategoryType.MaintenancePackage) {
            clearPackage();
        }
        if (selectedSR?.length && subService?.type === EServiceCategoryType.IndividualServices) {
            clearIndOpsCodes();
        } else if (service?.type === EServiceCategoryType.Diagnose) {
            clearDiagnoseCodes()
        }
        clearCategories();
        onBack();
    }

    return (<StepWrapper>
        <ConsultantsWrapper>
            {loading || !advisorSelection ? <Loading /> : <React.Fragment>
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
        <Actions onNext={onNext} onBack={handleBack} />
    </StepWrapper>);
};