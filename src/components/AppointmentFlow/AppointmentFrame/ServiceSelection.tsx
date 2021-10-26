import React, {useEffect, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {selectSubService} from "../../../store/reducers/appointmentFrameReducer/actions";
import {ReactComponent as BatteryIcon} from "../../../assets/img/battery-icon.svg";
import {ReactComponent as AlignmentIcon} from "../../../assets/img/alignment-icon.svg";
import {ReactComponent as RecallIcon} from "../../../assets/img/recall.svg";
import {ReactComponent as MoreIcon} from "../../../assets/img/tell-more.svg";
import {ReactComponent as CarIcon} from "../../../assets/img/car_wheel-icon.svg";
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";
import {EServiceCategoryPage, EServiceCenterName, IServiceCategory} from "../../../api/types";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useParams} from "react-router-dom";
import {Loading} from "../../UI/Loading";
import ReactGA from "react-ga";

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
    <BatteryIcon />, <AlignmentIcon />, <MoreIcon />
];

const bmwIcons: JSX.Element[] = [
    <AlignmentIcon />, <RecallIcon />, <MoreIcon />
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

const addBMWServices: IServiceCategory[] = [
    {
        id: -1,
        name: "Search Individual Services",
        loadedIcon: <CarIcon />,
        page: EServiceCategoryPage.Page2,
        serviceRequests: []
    },
]

type TProps = {
    onNext: TArgCallback<TScreen>;
    onBack: TCallback;
}
export const ServiceSelection: React.FC<TProps> = ({onNext, onBack}) => {
    const {subService} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
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
                const isBmWService = scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
                    || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest;
                const iconsData = isBmWService ? bmwIcons : icons;
                data = data.map((el, idx) => iconsData[idx] ? {...el, loadedIcon: iconsData[idx]} : el);
                const more = data.pop();
                const additional = isBmWService ? addBMWServices : addServices;
                const nServices = [...data, ...additional];
                if (more) {
                    nServices.push(more);
                }
                setServices(nServices);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id, scProfile]);

    useEffect(() => {
        window.addEventListener('unload', () => {
            ReactGA.event({
                category: 'User',
                action: 'Abandoned Page',
                label: `From Page SubService Selection`
            })
        })
    }, [])

    const handleSelectCard = (card: IServiceCategory) => () => {
        dispatch(selectSubService(card));
    }

    const handleSubmit = () => {
        if (subService) {
            const requestsString = subService.serviceRequests.map(item => `${item.code} (${item.description})`).join(', ');
            ReactGA.event({
                category: 'User',
                action: 'Selected Sub Service',
                label: `With Name ${subService.name} ${subService.serviceRequests?.length && `And Service Requests ${requestsString}`}`
            })
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