import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
import {TArgCallback} from "../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    clearAppointmentSteps,
    selectCategoriesIds,
    selectService,
    selectSubService,
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

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: () => void;
    setLastSelectedCategory: Dispatch<SetStateAction<IServiceCategory|null>>;
    setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
    page: EServiceCategoryPage;
    setPage: Dispatch<SetStateAction<EServiceCategoryPage>>;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({
                                                        onSelect,
                                                        onBack,
                                                        setLastSelectedCategory,
                                                        setNeedToShowServiceSelection,
                                                        page,
                                                        setPage,
}) => {
    const {
        service: selectedService,
        subService,
        categoriesIds,
        selectedPackage,
        valueService,
        userType,
        serviceTypeOption,
        packageEMenuType,
        selectedRecalls,
        hashKey,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSR} = useSelector((state: RootState) => state.appointment);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);

    const [loading, setLoading] = useState<boolean>(false);
    const [serviceCategories, setServiceCategories] = useState<IServiceCategory[]>([]);
    const {id} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = useTranslation();
    const currentUser = useCurrentUser();

    const isManagingAppointment = Boolean(hashKey?.length) && (!serviceTypeOption || firstScreenOptions.find(el => el.id === serviceTypeOption?.id))
    const onlyVisitCenterOptionExists = useMemo(() => firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter,
        [firstScreenOptions])
    const shouldSkipServiceTypeSelect = !firstScreenOptions?.length || onlyVisitCenterOptionExists || isManagingAppointment;
    const currentService = useMemo(() => page === EServiceCategoryPage.Page1
        ? selectedService
        : subService, [page, selectedService, subService]);

    const handleBackScreen = () => {
        setNeedToShowServiceSelection(!shouldSkipServiceTypeSelect)
        const notVisitCenterSelected = serviceTypeOption && serviceTypeOption?.type !== EServiceType.VisitCenter;
        const firstScreenOptionsUnavailable = !firstScreenOptions.length || onlyVisitCenterOptionExists || isManagingAppointment;
        const needsToShowCarsSelection = userType === EUserType.Existing && !currentUser && firstScreenOptionsUnavailable;
        if (notVisitCenterSelected || needsToShowCarsSelection) {
            onBack()
        } else {
            history.push(`${Routes.EndUser.Welcome}/${id}?frame=1`)
        }
    }

    const handleBack = () => {
        if (page === EServiceCategoryPage.Page2) {
            setPage(EServiceCategoryPage.Page1);
        } else {
            if (currentUser) dispatch(setShowServiceCentersList(false));
            handleBackScreen()
        }
    }

    useEffect(() => {
        setLoading(true);
        Api.call<IServiceCategory[]>(
            Api.endpoints.ServiceCategories.GetByPage,
            {data: {
                    serviceCenterId: decodeSCID(id),
                    page,
                    serviceType: serviceTypeOption?.type === EServiceType.MobileService
                        ? EServiceType.MobileService
                        : EServiceType.VisitCenter
            }}
        )
            .then(({data}) => {
                setServiceCategories(data);
            })
            .finally(() => {setLoading(false)});
    }, [id, serviceTypeOption, page]);

    useEffect(() => {
        if (!userType) dispatch(setUserType(EUserType.New))
    }, [userType])


    const handleGA = (selectedCategory: IServiceCategory) => {
        const requestsString = selectedCategory.serviceRequests.map(item => `${item.code} (${item.description})`).join(', ');
        ReactGA.event({
            category: 'EvenFlow User',
            action: `Selected ${page === EServiceCategoryPage.Page1 ? 'Service' : 'Sub Service'} `,
            label: `With Name ${selectedCategory.name} And Service Requests ${requestsString}`,
        })
    }

    const handleCategoryHighlight = (selectedCategory: IServiceCategory) => {
        if (categoriesIds && selectedCategory.type !== EServiceCategoryType.LinkToPage2) {
            dispatch(selectCategoriesIds([...categoriesIds, selectedCategory.id]));
        }
    }

    const clearData = () => {
        dispatch(setAdditionalServicesChosen(false));
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        dispatch(clearAppointmentSteps("appointmentSelection"));
    }

    const handleSubmit = (selectedCategory: IServiceCategory) => {
        if (selectedCategory) {
            setLastSelectedCategory(selectedCategory);
            if (selectedCategory.offer?.description) {
                onSelect('serviceOfferProductPage');
            } else {
                handleGA(selectedCategory);
                handleCategoryHighlight(selectedCategory);
                clearData();

                switch (selectedCategory?.type) {
                    case 2:
                    case 4:
                        return onSelect('opsCode');
                    case 1:
                    case 6:
                        return onSelect('maintenanceDetails');
                    case 3:
                        setPage(EServiceCategoryPage.Page2);
                        return;
                    case 5:
                        return history.push(`${Routes.EndUser.AppointmentFrameBase}/${id}/valueService`)
                    default:
                        return onSelect('describeMore');
                }
            }
        }
    }

    const handleSelectCard = (card: IServiceCategory) => () => {
        page === EServiceCategoryPage.Page1
            ? dispatch(selectService(card))
            : dispatch(selectSubService(card));
        handleSubmit(card);
    }

    const getCardIsSelected = (card: IServiceCategory): boolean => {
        if (card.type === EServiceCategoryType.MaintenancePackage) return Boolean(selectedPackage || (packageEMenuType !== null));
        if (card.type === EServiceCategoryType.ValueService) return Boolean(valueService?.selectedService);
        if (card.type === EServiceCategoryType.OpenRecalls) {
            return Boolean(selectedRecalls.length && categoriesIds?.includes(card.id));
        }
        if (card.type === EServiceCategoryType.IndividualServices) {
            return Boolean(serviceCategories
                .find(cat => cat.type === EServiceCategoryType.IndividualServices && card.id === cat.id
                    && cat.serviceRequests.find(req => selectedSR.includes(req.id))))
        }
        if (card.type === EServiceCategoryType.Diagnose) {
            return Boolean(serviceCategories
                .find(cat => cat.type === EServiceCategoryType.Diagnose && card.id === cat.id
                    && cat.serviceRequests.find(req => selectedSR.includes(req.id))))
        }
        return categoriesIds?.includes(card.id)
    }

    const getCardIsActive = (card: IServiceCategory): boolean => {
        return currentService?.id === card.id && !categoriesIds.includes(card.id) && card.type !== EServiceCategoryType.LinkToPage2
    }

    const handleNext = () => {
        onSelect('maintenanceDetails');
    }

    return (
        <StepWrapper>
            {!loading ? <CardsWrapper>
                {serviceCategories.map(card => {
                    return <ServiceCard
                        selected={getCardIsSelected(card)}
                        active={getCardIsActive(card)}
                        onSelect={handleSelectCard(card)}
                        card={card}
                        key={card.id}/>
                })}
            </CardsWrapper> : <Loading />}
            <CartTable/>
            <Actions
                prevDisabled={history?.location?.search?.includes('view=unique')}
                hideNext={!selectedService && !subService}
                nextLabel={t("Next")}
                onNext={handleNext}
                onBack={handleBack} />
        </StepWrapper>
    );
};