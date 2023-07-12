import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
import {TArgCallback, TCallback} from "../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    clearAppointmentSteps,
    selectCategoriesIds,
    selectService,
    setAdditionalServicesChosen,
    setShowServiceCentersList,
    setUserType
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TScreen} from "../../Layout/types";
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import {EServiceCategoryPage, IServiceCategory} from "../../../api/types";
import {Loading} from '../../UI/Loading';
import ReactGA from "react-ga4";
//import ReactGA from "react-ga";
import CartTable from "./CartTable";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {Routes} from "../../../config/routes";
import {EServiceType, EUserType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {selectAppointment, selectServiceValetAppointment} from "../../../store/reducers/appointment/actions";
import {useCurrentUser} from "../../../utils/hooks";
import {TView} from "../../Welcome/types";

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: () => void;
    onLogin: TCallback;
    setLastSelectedCategory: Dispatch<SetStateAction<IServiceCategory|null>>;
    setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
    onGoToFirstScreen: TArgCallback<TView>;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({
                                                        onSelect,
                                                        onBack,
                                                        onLogin,
                                                        setLastSelectedCategory,
                                                        setNeedToShowServiceSelection,
    onGoToFirstScreen
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceCategories, setServiceCategories] = useState<IServiceCategory[]>([]);
    const {
        service: selectedService,
        categoriesIds,
        selectedPackage,
        valueService,
        userType,
        serviceTypeOption,
        packageEMenuType,
        selectedRecalls,
        selectedVehicle,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData, selectedSR} = useSelector((state: RootState) => state.appointment);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const serviceType = useMemo(() => serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter, [serviceTypeOption]);
    const {id} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = useTranslation();
    const currentUser = useCurrentUser();

    const handleBackScreen = (shouldSkipServiceTypeSelect: boolean) => {
        setNeedToShowServiceSelection(shouldSkipServiceTypeSelect)
        if (serviceTypeOption && serviceTypeOption?.type !== EServiceType.VisitCenter) {
            onBack()
        } else {
            history.push(`${Routes.EndUser.Welcome}/${id}?frame=1`)
        }
    }

    const handleBack = () => {
        const onlyVisitCenterExists = firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter
        const shouldSkipServiceTypeSelect = !firstScreenOptions?.length || onlyVisitCenterExists;
        const prevScreen = shouldSkipServiceTypeSelect ? "select" : "serviceSelect";
        if (currentUser) {
            dispatch(setShowServiceCentersList(false));
            handleBackScreen(shouldSkipServiceTypeSelect)
        // } else if (!customerLoadedData?.id && serviceType === EServiceType.VisitCenter) {
        //     onLogin();
        //     onGoToFirstScreen(prevScreen)
        } else {
            handleBackScreen(shouldSkipServiceTypeSelect)
        }
    }

    useEffect(() => {
        setLoading(true);
        Api.call<IServiceCategory[]>(
            Api.endpoints.ServiceCategories.GetByPage,
            {data: {
                    serviceCenterId: decodeSCID(id),
                    page: EServiceCategoryPage.Page1,
                    serviceType: serviceTypeOption?.type === EServiceType.MobileService
                        ? EServiceType.MobileService
                        : EServiceType.VisitCenter
            }}
        )
            .then(({data}) => {
                setServiceCategories(data);
            })
            .finally(() => {setLoading(false)});
    }, [id, serviceTypeOption]);

    useEffect(() => {
        if (!userType) dispatch(setUserType(EUserType.New))
    }, [userType])

    // useEffect(() => {
    //     const indRequestsCategory = serviceCategories.find(cat => cat.serviceRequests.find(req => selectedSR.includes(req.id)));
    //     if (indRequestsCategory) {
    //         dispatch(selectCategoriesIds([indRequestsCategory]))
    //     }
    // }, [serviceCategories, selectedSR])

    const handleGA = (selectedService: IServiceCategory) => {
        const requestsString = selectedService.serviceRequests.map(item => `${item.code} (${item.description})`).join(', ');
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Selected Service',
            label: `With Name ${selectedService.name} And Service Requests ${requestsString}`,
        })
    }

    const handleCategoryHighlight = (selectedService: IServiceCategory) => {
        if (categoriesIds && selectedService.type !== EServiceCategoryType.LinkToPage2) {
            const categories = categoriesIds?.includes(selectedService.id)
                ? categoriesIds
                : [...categoriesIds, selectedService.id];
            dispatch(selectCategoriesIds(categories));
        }
    }

    const clearData = () => {
        dispatch(setAdditionalServicesChosen(false));
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        dispatch(clearAppointmentSteps("appointmentSelection"));
    }

    const handleSubmit = (selectedService: IServiceCategory) => {
        if (selectedService) {
            setLastSelectedCategory(selectedService);
            if (selectedService.offer?.description) {
                onSelect('serviceOfferProductPage');
            } else {
                handleGA(selectedService);
                handleCategoryHighlight(selectedService);
                clearData();

                switch (selectedService?.type) {
                    case 2:
                    case 4:
                        return onSelect('opsCode');
                    case 1:
                    case 6:
                        return onSelect('maintenanceDetails');
                    case 3:
                        return onSelect('serviceSelection');
                    case 5:
                        return history.push(`${Routes.EndUser.AppointmentFrameBase}/${id}/valueService`)
                    default:
                        return onSelect('describeMore');
                }
            }
        }
    }

    const handleSelectCard = (card: IServiceCategory) => () => {
        dispatch(selectService(card));
        handleSubmit(card);
    }

    const getCardState = (card: IServiceCategory): boolean => {
        if (card.type === EServiceCategoryType.MaintenancePackage) return Boolean(selectedPackage || (packageEMenuType !== null));
        if (card.type === EServiceCategoryType.ValueService) return Boolean(valueService?.selectedService);
        if (card.type === EServiceCategoryType.OpenRecalls) return Boolean(selectedRecalls.length && categoriesIds?.includes(card.id));
        if (card.type === EServiceCategoryType.IndividualServices) {
            return Boolean(serviceCategories
                .find(cat => cat.type === EServiceCategoryType.IndividualServices
                    && cat.serviceRequests.find(req => selectedSR.includes(req.id))))
        }
        if (card.type === EServiceCategoryType.Diagnose) {
            return Boolean(serviceCategories
                .find(cat => cat.type === EServiceCategoryType.Diagnose
                    && cat.serviceRequests.find(req => selectedSR.includes(req.id))))
        }
        return categoriesIds?.includes(card.id)
    }

    return (
        <StepWrapper>
            {!loading ? <CardsWrapper>
                {serviceCategories.map(card => {
                    return <ServiceCard
                        selected={getCardState(card)}
                        active={selectedService?.id === card.id}
                        onSelect={handleSelectCard(card)}
                        card={card}
                        key={card.id}/>
                })}
            </CardsWrapper> : <Loading />}
            <CartTable/>
            <Actions
                prevDisabled={history?.location?.search?.includes('view=unique')}
                nextDisabled={!selectedService}
                hideNext
                nextLabel={t("Next")}
                onNext={() => {}}
                onBack={handleBack} />
        </StepWrapper>
    );
};