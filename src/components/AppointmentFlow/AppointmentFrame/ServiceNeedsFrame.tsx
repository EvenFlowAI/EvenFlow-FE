import React, {useEffect, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
import {ReactComponent as TireIcon} from "../../../assets/img/tire-rotation-icon.svg";
import {ReactComponent as WorksIcon} from "../../../assets/img/oil-icon.svg";
import {ReactComponent as RecallIcon} from "../../../assets/img/recall.svg";
import {ReactComponent as MoreIcon} from "../../../assets/img/tell-more.svg";
import {TArgCallback, TCallback} from "../../../types/types";
import {ECardType, TServiceCard} from "../../../store/reducers/appointmentFrameReducer/types";
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


const cards: TServiceCard[] = [
    {
        name: "FoD",
        label: "Factory or Dealer Scheduled Maintenance",
        icon: <TireIcon />,
        type: ECardType.Maintenance
    },
    {
        name: "QLC",
        label: "The Works Quick Lane Checkup",
        icon: <WorksIcon />,
        type: ECardType.Other
    },
    {
        name: "R",
        label: "Recall",
        icon: <RecallIcon />,
        type: ECardType.Other
    },
    {
        name: "TM",
        label: "Tell us more",
        icon: <MoreIcon />,
        type: ECardType.TellMore
    },
]

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: TCallback;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({onSelect, onBack}) => {
    const [loading, setLoading] = useState<boolean>(false);
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
                console.log(data);
            })
            .finally(() => {setLoading(false)});
    }, [id]);

    const handleSelectCard = (card: TServiceCard) => () => {
        dispatch(selectService(card));
    }
    const handleSubmit = () => {
        switch (selectedService?.name) {
            case "TM":
                return onSelect('serviceSelection');
            case "R":
            case "QLC":
                return onSelect('describeMore');
            case "FoD":
                return onSelect('maintenanceDetails');
            default:
                return;
        }
    }
    return (
        <StepWrapper>
            <CardsWrapper>
                {cards.map(card => {
                    return <ServiceCard
                        active={selectedService?.name === card.name}
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