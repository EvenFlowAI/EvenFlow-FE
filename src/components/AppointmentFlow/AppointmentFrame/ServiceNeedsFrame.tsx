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
import {useParams} from "react-router-dom";
import {EServiceCategoryPage, IServiceCategory} from "../../../api/types";
import {Loading} from '../../UI/Loading';
import ReactGA from "react-ga";
import CartTable from "./CartTable";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: TCallback;
    onLogin: TCallback;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({onSelect, onBack, onLogin}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceCategories, setServiceCategories] = useState<IServiceCategory[]>([]);
    const {service: selectedService, isAdditionalServices, categoriesIds, selectedPackage} = useSelector((state: RootState) => state.appointmentFrame);
    const scProfile = useSelector((state: RootState) => state.appointment.scProfile);
    const customerLoadedData = useSelector((state: RootState) => state.appointment.customerLoadedData);
    const {id} = useParams();
    const dispatch = useDispatch();

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
    }, [id, scProfile]);

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
            if (selectedService.type === 0) {
                if (isAdditionalServices) {
                    dispatch(setAdditionalServicesChosen(false));
                    const categories = categoriesIds.includes(selectedService.id) ? categoriesIds : [...categoriesIds, selectedService.id];
                    dispatch(selectCategoriesIds(categories));
                } else {
                    let categories = [...categoriesIds];
                    if (categories.length) {
                        categories[categories.length - 1] = selectedService.id;
                    } else {
                        categories = [selectedService.id]
                    }
                    dispatch(selectCategoriesIds(categories));
                }
            } else {
                if (!isAdditionalServices && categoriesIds.length) {
                    let categories = [...categoriesIds];
                    categories.pop();
                    dispatch(selectCategoriesIds(categories));
                }
            }

            switch (selectedService?.type) {
                case 2:
                    return onSelect('opsCode');
                case 1:
                    return onSelect('maintenanceDetails');
                case 3:
                    return onSelect('serviceSelection')
                default:
                    return onSelect('describeMore');
            }
        }
    }
    return (
        <StepWrapper>
            {!loading ? <CardsWrapper>
                {serviceCategories.map(card => {
                    return <ServiceCard
                        selected={categoriesIds.includes(card.id) || (card.type === EServiceCategoryType.MaintenancePackage && Boolean(selectedPackage))}
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