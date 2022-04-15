import React, {useEffect, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
import {TArgCallback, TCallback} from "../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    selectCategoriesIds,
    selectService,
    setAdditionalServicesChosen
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TScreen} from "../../Layout/types";
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import {EServiceCategoryPage, IServiceCategory} from "../../../api/types";
import {Loading} from '../../UI/Loading';
import ReactGA from "react-ga";
import CartTable from "./CartTable";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {Routes} from "../../../config/routes";

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: TCallback;
    onLogin: TCallback;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({onSelect, onBack, onLogin}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceCategories, setServiceCategories] = useState<IServiceCategory[]>([]);
    const {service: selectedService, categoriesIds, selectedPackage} = useSelector((state: RootState) => state.appointmentFrame);
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const {id} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleBack = () => {
        if (!customerLoadedData?.id) {
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

    const handleSelectCard = (card: IServiceCategory) => () => {
        dispatch(selectService(card));
    }

    const handleSubmit = () => {
        if (selectedService) {
            const requestsString = selectedService.serviceRequests.map(item => `${item.code} (${item.description})`).join(', ');
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Service',
                label: `With Name ${selectedService.name} And Service Requests ${requestsString}`,
            })
            if (categoriesIds && selectedService.type !== EServiceCategoryType.LinkToPage2) {
                const categories = categoriesIds?.includes(selectedService.id) ? categoriesIds : [...categoriesIds, selectedService.id];
                dispatch(selectCategoriesIds(categories));
            }
            dispatch(setAdditionalServicesChosen(false));

            switch (selectedService?.type) {
                case 2:
                    return history.push(`${Routes.EndUser.AppointmentFrameBase}/${id}/valueService`)
                   // return onSelect('opsCode');
                case 4:
                    return history.push(`${Routes.EndUser.AppointmentFrameBase}/${id}/valueService`)
                    // return onSelect('opsCode');
                case 1:
                    return onSelect('maintenanceDetails');
                case 3:
                    return onSelect('serviceSelection')
                default:
                    return onSelect('describeMore');
            }
        }
    }

    const getCardState = (card: IServiceCategory): boolean => {
        if (card.type === EServiceCategoryType.MaintenancePackage) return Boolean(selectedPackage);
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
                        key={card.name}/>
                })}
            </CardsWrapper> : <Loading />}
            <CartTable/>
            <Actions
                nextDisabled={!selectedService}
                onNext={handleSubmit}
                onBack={handleBack} />
        </StepWrapper>
    );
};