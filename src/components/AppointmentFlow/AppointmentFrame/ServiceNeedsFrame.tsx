import React, {useEffect, useState} from 'react';
import {Actions} from "./Actions";
import {StepWrapper} from './StepWrapper';
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
import {Loading} from '../../UI/Loading';
import ReactGA from "react-ga";

type TProps = {
    onSelect: TArgCallback<TScreen>;
    onBack: TCallback;
    onLogin: TCallback;
}
export const ServiceNeedsFrame: React.FC<TProps> = ({onSelect, onBack, onLogin}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [serviceCategories, setServiceCategories] = useState<IServiceCategory[]>([]);
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
                setServiceCategories(data);
                //if (scProfile) {
                    // const dataWithIcons = data.map(el => {
                    //     if (el.iconPath) {
                    //         axios.get(el.iconPath, {withCredentials: false})
                    //             .then(({ data }) => {
                    //                 return {...el, loadedIcon: data};
                    //                 //     setServiceCategories(c =>
                    //                 //         c.map(cat => cat.id === el.id ? {...cat, loadedIcon: data} : cat)
                    //                 //     )
                    //             }
                    //             )
                    //     }
                    //     return el;
                    // });

              //  }
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