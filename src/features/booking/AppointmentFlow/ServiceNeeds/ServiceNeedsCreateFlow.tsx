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
export const ServiceNeedsCreateFlow: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
                                                                                                          onSelect,
                                                                                                          onBack,
                                                                                                          setLastSelectedCategory,
                                                                                                          setNeedToShowServiceSelection,
                                                                                                          page,
                                                                                                          setPage
                                                                                                      }) => {
    const {userType, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {firstScreenOptions} = useSelector((state: RootState) => state.serviceTypes);
    const {id} = useParams<{id: string}>();
    const dispatch = useDispatch();
    const history = useHistory();
    const currentUser = useCurrentUser();

    const onlyVisitCenterOptionExists = useMemo(() => firstScreenOptions.length === 1 && firstScreenOptions[0].type === EServiceType.VisitCenter,
        [firstScreenOptions])
    const shouldSkipServiceTypeSelect = !firstScreenOptions?.length || onlyVisitCenterOptionExists;

    const handleBackScreen = () => {
        setNeedToShowServiceSelection(!shouldSkipServiceTypeSelect)
        const notVisitCenterSelected = serviceTypeOption && serviceTypeOption?.type !== EServiceType.VisitCenter;
        const firstScreenOptionsUnavailable = !firstScreenOptions.length || onlyVisitCenterOptionExists;
        const needsToShowCarsSelection = userType === EUserType.Existing && !currentUser && firstScreenOptionsUnavailable;
        if (notVisitCenterSelected || needsToShowCarsSelection) {
            onBack()
        } else {
            history.push(`${Routes.EndUser.Welcome}/${id}?frame=1`)
        }
    }

    const handleBack = () => {
        if (currentUser) dispatch(setShowServiceCentersList(false));
        handleBackScreen()
    }

    const handleNext = () => {
        onSelect('maintenanceDetails');
    }

    return (
        <ServiceNeedsCards
            onSelect={onSelect}
            setLastSelectedCategory={setLastSelectedCategory}
            page={page}
            setPage={setPage}
            goNext={handleNext}
            goBack={handleBack}/>
    );
};