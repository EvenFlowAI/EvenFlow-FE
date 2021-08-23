import React, {useEffect, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
import {ReactComponent as TireIcon} from "../../../assets/img/tire-rotation-icon.svg";
import {ReactComponent as WorksIcon} from "../../../assets/img/oil-icon.svg";
import {ReactComponent as RecallIcon} from "../../../assets/img/recall.svg";
import {ReactComponent as MoreIcon} from "../../../assets/img/tell-more.svg";
import {TArgCallback, TCallback} from "../../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectService} from "../../../store/reducers/appointmentFrameReducer/actions";
import {TScreen} from "../../Layout/types";
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {EServiceCategoryPage, IServiceCategory} from "../../../api/types";


const icons: JSX.Element[] = [
    <WorksIcon />,
    <RecallIcon />,
];


const packageCard: IServiceCategory = {
    id: -1,
    name: "Factory or Dealer Scheduled Maintenance",
    loadedIcon: <TireIcon />,
    page: EServiceCategoryPage.Page1,
    serviceRequests: []
};
const tellMoreCard: IServiceCategory = {
    id: -2,
    name: "Tell us more",
    loadedIcon: <MoreIcon />,
    page: EServiceCategoryPage.Page1,
    serviceRequests: []
};

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: TCallback;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({onSelect, onBack}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceCategories, setServiceCategories] = useState<IServiceCategory[]>(
        [packageCard, tellMoreCard]
    );
    const selectedService = useSelector((state: RootState) => state.appointmentFrame.service);
    const {id} = useParams();
    const dispatch = useDispatch();


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
                setServiceCategories([
                    packageCard, ...data.map((el, idx) => icons[idx] ? {...el, loadedIcon: icons[idx]} : el), tellMoreCard
                ]);
               /* data.forEach(el => {
                    if (el.iconPath) {
                        // TODO: Load icons after BE Fix <CORS>
                        /!*fetch(el.iconPath)
                            .then(r => r.text())
                            .then(loadedIcon =>
                                setServiceCategories(c =>
                                    c.map(cat => cat.id === el.id ? {...cat, loadedIcon} : cat)
                                )
                            )*!/
                    }
                });*/
            })
            .finally(() => {setLoading(false)});
    }, [id]);

    const handleSelectCard = (card: IServiceCategory) => () => {
        dispatch(selectService(card));
    }
    const handleSubmit = () => {
        if (selectedService) {
            switch (selectedService?.id) {
                case -2:
                    return onSelect('serviceSelection');
                case -1:
                    return onSelect('maintenanceDetails');
                default:
                    return onSelect('describeMore');
            }
        }
    }
    return (
        <StepWrapper>
            <CardsWrapper>
                {serviceCategories.map(card => {
                    return <ServiceCard
                        active={selectedService?.id === card.id}
                        onSelect={handleSelectCard(card)}
                        card={card}
                        key={card.name} />
                })}
            </CardsWrapper>
            <Actions
                nextDisabled={!selectedService}
                onNext={handleSubmit}
                onBack={onBack} />
        </StepWrapper>
    );
};