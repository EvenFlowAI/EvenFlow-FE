import React, {useEffect, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectSubService} from "../../../store/reducers/appointmentFrameReducer/actions";
import {ReactComponent as TireIcon} from "../../../assets/img/tire-rotation-icon.svg";
import {ReactComponent as WorksIcon} from "../../../assets/img/oil-icon.svg";
import {ReactComponent as RecallIcon} from "../../../assets/img/recall.svg";
import {ReactComponent as MoreIcon} from "../../../assets/img/tell-more.svg";
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";
import {EServiceCategoryPage, IServiceCategory} from "../../../api/types";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {Loading} from "../../UI/Loading";

/*const cards: TServiceCard[] = [
    {
        name: "engineLight",
        label: "Engine Light On",
        icon: <TireIcon />,
        type: ECardType.Maintenance
    },
    {
        name: "tireReplacement",
        label: "Tire Repair and Replacement",
        icon: <WorksIcon />,
        type: ECardType.Other
    }
]*/

const icons: JSX.Element[] = [
    <TireIcon />, <WorksIcon />, <MoreIcon />
];

const addServices: IServiceCategory[] = [
    {
        id: -1,
        name: "Search Individual Services",
        loadedIcon: <RecallIcon />,
        page: EServiceCategoryPage.Page2,
        serviceRequests: []
    },
    /*{
        id: -2,
        name: "Describe What’s Going On",
        loadedIcon: <MoreIcon />,
        page: EServiceCategoryPage.Page2,
        serviceRequests: []
    },*/
]

type TProps = {
    onNext: TArgCallback<TScreen>;
    onBack: TCallback;
}
export const ServiceSelection: React.FC<TProps> = ({onNext, onBack}) => {
    const subService = useSelector((state: RootState) => state.appointmentFrame.subService);
    const dispatch = useDispatch();
    const {id} = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [services, setServices] = useState<IServiceCategory[]>([...addServices]);

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
                data = data.map((el, idx) => icons[idx] ? {...el, loadedIcon: icons[idx]} : el);
                const more = data.pop();
                const nServices = [...data, ...addServices];
                if (more) {
                    nServices.push(more);
                }
                setServices(nServices);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id]);

    const handleSelectCard = (card: IServiceCategory) => () => {
        dispatch(selectSubService(card));
    }

    const handleSubmit = () => {
        if (subService) {
            switch (subService.id) {
                case -1:
                    return onNext('opsCode');
                default:
                    return onNext('describeMore');
            }
        }
    }
    return (
        <StepWrapper>
            {!loading ? <CardsWrapper>
                {services.map(card => {
                    return <ServiceCard
                        active={subService?.id === card.id}
                        onSelect={handleSelectCard(card)}
                        card={card}
                        key={card.name}/>
                })}
            </CardsWrapper> : <Loading />}
            <Actions
                nextDisabled={!subService}
                onNext={handleSubmit}
                onBack={onBack} />
        </StepWrapper>
    );
};