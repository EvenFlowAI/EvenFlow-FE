import React, {useEffect, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
import {ReactComponent as TireIcon} from "../../../assets/img/tire-rotation-icon.svg";
import {ReactComponent as WorksIcon} from "../../../assets/img/oil-icon.svg";
import {ReactComponent as BrakeIcon} from "../../../assets/img/breaks-icon.svg";
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
import {EServiceCategoryPage, EServiceCenterName, IServiceCategory} from "../../../api/types";
import { Loading } from '../../UI/Loading';
import {tellMoreCard} from "../../../store/reducers/appointmentFrameReducer/initial";
import ReactGA from "react-ga";


const icons: JSX.Element[] = [
    <TireIcon />,
    <BrakeIcon />,
];

const packageCard: IServiceCategory = {
    id: -1,
    name: "The Works Quick Lane Check Up",
    loadedIcon: <WorksIcon />,
    page: EServiceCategoryPage.Page1,
    serviceRequests: []
};

const BMWPackageCard: IServiceCategory = {
    id: -1,
    name: "Factory Or Dealer Scheduled Maintenance",
    loadedIcon: <WorksIcon />,
    page: EServiceCategoryPage.Page1,
    serviceRequests: []
}


type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: TCallback;
    onLogin: TCallback;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({onSelect, onBack, onLogin}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceCategories, setServiceCategories] = useState<IServiceCategory[]>(
        [packageCard, tellMoreCard]
    );
    const selectedService = useSelector((state: RootState) => state.appointmentFrame.service);
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
                if (scProfile) {
                    const isBmWService = scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
                        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest;
                    const card = isBmWService ? BMWPackageCard : packageCard;
                    setServiceCategories([
                        card, ...data.map((el, idx) => icons[idx] ? {...el, loadedIcon: icons[idx]} : el), tellMoreCard
                    ]);
                    data.forEach(el => {
                        if (el.iconPath) {
                            // TODO: Load icons after BE Fix <CORS>
                            // fetch(el.iconPath)
                            //     .then(r => r.text())
                            //     .then(loadedIcon =>
                            //         setServiceCategories(c =>
                            //             c.map(cat => cat.id === el.id ? {...cat, loadedIcon} : cat)
                            //         )
                            //     )
                        }
                    });
                }
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
                category: 'User',
                action: 'Selected Service',
                label: `With Name ${selectedService.name} And Service Requests ${requestsString}`,
                nonInteraction: true
            })

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
            {!loading ? <CardsWrapper>
                {serviceCategories.map(card => {
                    return <ServiceCard
                        active={selectedService?.id === card.id}
                        onSelect={handleSelectCard(card)}
                        card={card}
                        key={card.name}/>
                })}
            </CardsWrapper> : <Loading />}
            <Actions
                nextDisabled={!selectedService}
                onNext={handleSubmit}
                onBack={handleBack} />
        </StepWrapper>
    );
};