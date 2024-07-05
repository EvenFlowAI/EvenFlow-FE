import React, {Dispatch, SetStateAction, useMemo} from 'react';
import {TArgCallback, TScreen} from "../../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    setShowServiceCentersList,
} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useHistory, useParams} from "react-router-dom";
import {EServiceCategoryPage, IServiceCategory} from "../../../../api/types";
import {EServiceType, EUserType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";
import {Routes} from "../../../../routes/constants";
import {ServiceNeedsCards} from "../../ServiceNeedsCards/ServiceNeedsCards";

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: () => void;
    setLastSelectedCategory: Dispatch<SetStateAction<IServiceCategory|null>>;
    setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
    page: EServiceCategoryPage;
    setPage: Dispatch<SetStateAction<EServiceCategoryPage>>;
}
export const ServiceNeedsCreate: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
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