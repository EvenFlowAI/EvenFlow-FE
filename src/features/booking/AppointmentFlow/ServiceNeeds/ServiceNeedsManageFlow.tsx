import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {ActionButtons} from "../../ActionButtons/ActionButtons";
import {StepWrapper} from '../../../../components/styled/StepWrapper';
import {TArgCallback, TScreen} from "../../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    checkCarIsValid,
    clearAppointmentSteps,
    selectCategoriesIds,
    selectService,
    selectSubService,
    setAdditionalServicesChosen, setCurrentFrameScreen,
    setShowServiceCentersList,
    setUserType
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {CardsWrapper} from "./styles";
import {ServiceCard} from "./ServiceCard/ServiceCard";
import {decodeSCID, getMaintenanceList} from "../../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import {EServiceCategoryPage, IServiceCategory} from "../../../../api/types";
import {Loading} from '../../../../components/wrappers/Loading/Loading';
import ReactGA from "react-ga4";
import ShoppingCart from "./ShoppingCart/ShoppingCart";
import {EServiceCategoryType} from "../../../../store/reducers/categories/types";
import {EServiceType, EUserType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {
    selectAppointment,
    selectServiceValetAppointment,
} from "../../../../store/reducers/appointment/actions";
import {checkPodChanged} from "../../../../store/reducers/appointments/actions";
import {useException} from "../../../../hooks/useException/useException";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";
import {Routes} from "../../../../routes/constants";
import {Api} from "../../../../api/ApiEndpoints/ApiEndpoints";
import {ServiceNeedsCards} from "./ServiceNeedsCards";

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: () => void;
    setLastSelectedCategory: Dispatch<SetStateAction<IServiceCategory|null>>;
    setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
    page: EServiceCategoryPage;
    setPage: Dispatch<SetStateAction<EServiceCategoryPage>>;
}
export const ServiceNeedsManageFlow: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
                                                        onSelect,
                                                        onBack,
                                                        setLastSelectedCategory,
                                                        setNeedToShowServiceSelection,
                                                        page,
                                                        setPage,
}) => {
    const {
        categoriesIds,
        selectedPackage,
        valueService,
        packageEMenuType,
        selectedRecalls,
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSR, serviceRequests, scProfile} = useSelector((state: RootState) => state.appointment);
    const { allCategories } = useSelector((state: RootState) => state.categories);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const showError = useException();

    const selectedServices = useMemo(() => {
            return getMaintenanceList(
                serviceRequests,
                selectedRecalls,
                selectedSR,
                selectedPackage,
                allCategories,
                categoriesIds,
                valueService,
                packageEMenuType,
                scProfile?.maintenancePackageOptionTypes)
        },
        [serviceRequests, selectedSR, selectedPackage, allCategories, categoriesIds, valueService,
            selectedRecalls, packageEMenuType, scProfile])

    const handleBack = () => {
        // todo redirect to manage url
        dispatch(setCurrentFrameScreen("manageAppointment"))
    }

    const goNext = () => onSelect('maintenanceDetails');

    const onCarIsValid = () => scProfile && dispatch(checkPodChanged(scProfile.id, showError));

    const handleNext = () => {
        if (!selectedServices.length) {
            showError(t("You do not have any services selected in your appointment. Please add items you wish to have serviced"))
        } else {
            dispatch(checkCarIsValid(onCarIsValid, goNext))
        }
    }

    return (
        <ServiceNeedsCards
            onSelect={onSelect}
            setLastSelectedCategory={setLastSelectedCategory}
            page={page}
            setPage={setPage}
            goNext={handleNext}
            goBack={handleBack}
            isManagingAppointment={true}/>
    );
};