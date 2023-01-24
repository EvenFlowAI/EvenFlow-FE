import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
import {TArgCallback, TCallback} from "../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    selectCategoriesIds,
    selectService,
    setAdditionalServicesChosen,
    setUserType,
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TScreen} from "../../Layout/types";
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import {EServiceCategoryPage, IServiceCategory} from "../../../api/types";
import {Loading} from '../../UI/Loading';
//import ReactGA from "react-ga4";
import ReactGA from "react-ga";
import CartTable from "./CartTable";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {Routes} from "../../../config/routes";
import {EServiceType, EUserType} from "../../../store/reducers/appointmentFrameReducer/types";

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: TCallback;
    onLogin: TCallback;
    setLastSelectedCategory: Dispatch<SetStateAction<IServiceCategory|null>>;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({onSelect, onBack, onLogin, setLastSelectedCategory}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceCategories, setServiceCategories] = useState<IServiceCategory[]>([]);
    const {
        service: selectedService,
        categoriesIds,
        selectedPackage,
        valueService,
        serviceType,
        userType
    } = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {id} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleBack = () => {
        if (!customerLoadedData?.id && serviceType === EServiceType.VisitCenter) {
            onLogin();
        } else {
            onBack();
        }
    }

    useEffect(() => {
        setLoading(true);
        Api.call<IServiceCategory[]>(
            Api.endpoints.ServiceCategories.GetByPage,
            {data: {
                serviceCenterId: decodeSCID(id),
                page: EServiceCategoryPage.Page1
            }}
        )
            .then(({data}) => {
                setServiceCategories(data);
            })
            .finally(() => {setLoading(false)});
    }, [id]);

    useEffect(() => {
        if (!userType) dispatch(setUserType(EUserType.New))
    }, [userType])

    const handleSelectCard = (card: IServiceCategory) => () => {
        dispatch(selectService(card));
    }

    const handleGA = () => {
        if (selectedService) {
            const requestsString = selectedService.serviceRequests.map(item => `${item.code} (${item.description})`).join(', ');
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Service',
                label: `With Name ${selectedService.name} And Service Requests ${requestsString}`,
            })
        }
    }

    const handleCategoryHighlight = () => {
        if (selectedService) {
            if (categoriesIds && selectedService.type !== EServiceCategoryType.LinkToPage2) {
                const categories = categoriesIds?.includes(selectedService.id)
                    ? categoriesIds
                    : [...categoriesIds, selectedService.id];
                dispatch(selectCategoriesIds(categories));
            }
        }
    }

    const handleSubmit = () => {
        if (selectedService) {
            setLastSelectedCategory(selectedService);
            if (selectedService.offer?.description) {
                onSelect('serviceOfferProductPage');
            } else {
                handleGA();
                handleCategoryHighlight();
                dispatch(setAdditionalServicesChosen(false));

                switch (selectedService?.type) {
                    case 2:
                    case 4:
                        return onSelect('opsCode');
                    case 1:
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

    const getCardState = (card: IServiceCategory): boolean => {
        if (card.type === EServiceCategoryType.MaintenancePackage) return Boolean(selectedPackage);
        if (card.type === EServiceCategoryType.ValueService) return Boolean(valueService?.selectedService);
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
                onNext={handleSubmit}
                onBack={handleBack} />
        </StepWrapper>
    );
};