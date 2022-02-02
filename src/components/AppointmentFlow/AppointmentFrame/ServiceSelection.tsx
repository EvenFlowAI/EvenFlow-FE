import React, {useEffect, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    selectCategoriesIds,
    selectSubService,
    setAdditionalServicesChosen
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";
import {EServiceCategoryPage, IServiceCategory} from "../../../api/types";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {Loading} from "../../UI/Loading";
import ReactGA from "react-ga";
import CartTable from "./CartTable";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";

type TProps = {
    onNext: TArgCallback<TScreen>;
    onBack: TCallback;
}
export const ServiceSelection: React.FC<TProps> = ({onNext, onBack}) => {
    const {subService, categoriesIds} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile, selectedSR} = useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();
    const {id} = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [services, setServices] = useState<IServiceCategory[]>([]);

    useEffect(() => {
        setLoading(true);
        Api.call<IServiceCategory[]>(
            Api.endpoints.ServiceCategories.GetByPage,
            {data: {
                serviceCenterId: decodeSCID(id),
                page: EServiceCategoryPage.Page2
            }}
        )
            .then(({data}) => {
                setServices(data);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id, scProfile]);

    const handleSelectCard = (card: IServiceCategory) => () => {
        dispatch(selectSubService(card));
    }

    const handleSubmit = () => {
        if (subService) {
            const requestsString = subService.serviceRequests.map(item => `${item.code} (${item.description})`).join(', ');
            ReactGA.event({
                category: 'EvenFlow User',
                action: 'Selected Sub Service',
                label: `With Name ${subService.name} ${subService.serviceRequests?.length && `And Service Requests ${requestsString}`}`,
            })
            if (subService.type === 0 && categoriesIds) {
                const categories = categoriesIds?.includes(subService.id) ? categoriesIds : [...categoriesIds, subService.id];
                dispatch(selectCategoriesIds(categories));
            }
            dispatch(setAdditionalServicesChosen(false));

            switch (subService.type) {
                case 2:
                    return onNext('opsCode');
                default:
                    return onNext('describeMore');
            }
        }
    }

    const handleBack = () => {
        dispatch(selectSubService(null));
        onBack();
    }

    return (
        <StepWrapper>
            {!loading ? <CardsWrapper>
                {services.map(card => {
                    return <ServiceCard
                        selected={categoriesIds?.includes(card.id)
                        || (card.type === EServiceCategoryType.IndividualServices && Boolean(selectedSR?.length))
                        }
                        active={subService?.id === card.id}
                        onSelect={handleSelectCard(card)}
                        card={card}
                        key={card.name}/>
                })}
            </CardsWrapper> : <Loading />}
            <CartTable/>
            <Actions
                nextDisabled={!subService}
                onNext={handleSubmit}
                onBack={handleBack} />
        </StepWrapper>
    );
};