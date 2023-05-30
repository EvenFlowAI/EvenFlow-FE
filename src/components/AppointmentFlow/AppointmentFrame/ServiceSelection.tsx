import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {TArgCallback, TCallback} from "../../../types/types";
import {TScreen} from "../../Layout/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    clearAppointmentSteps,
    selectCategoriesIds,
    selectSubService,
    setAdditionalServicesChosen
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {CardsWrapper} from "./styled";
import {ServiceCard} from "./ServiceCard";
import {EServiceCategoryPage, IServiceCategory} from "../../../api/types";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {useHistory, useParams} from "react-router-dom";
import {Loading} from "../../UI/Loading";
//import ReactGA from "react-ga4";
import ReactGA from "react-ga";
import CartTable from "./CartTable";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";
import {Routes} from "../../../config/routes";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {useTranslation} from "react-i18next";
import {selectAppointment, selectServiceValetAppointment} from "../../../store/reducers/appointment/actions";

type TProps = {
    onNext: TArgCallback<TScreen>;
    onBack: TCallback;
    setLastSelectedCategory: Dispatch<SetStateAction<IServiceCategory|null>>;
}
export const ServiceSelection: React.FC<TProps> = ({onNext, onBack, setLastSelectedCategory}) => {
    const {subService, categoriesIds, serviceTypeOption} = useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile, selectedSR} = useSelector((state: RootState) => state.appointment);
    const [loading, setLoading] = useState<boolean>(false);
    const [services, setServices] = useState<IServiceCategory[]>([]);
    const dispatch = useDispatch();
    const history = useHistory();
    const {id} = useParams();
    const {t} = useTranslation();

    useEffect(() => {
        setLoading(true);
        Api.call<IServiceCategory[]>(
            Api.endpoints.ServiceCategories.GetByPage,
            {data: {
                    serviceCenterId: decodeSCID(id),
                    page: EServiceCategoryPage.Page2,
                    serviceType: serviceTypeOption?.type === EServiceType.MobileService
                        ? EServiceType.MobileService
                        : EServiceType.VisitCenter
            }}
        )
            .then(({data}) => {
                setServices(data);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id, scProfile]);

    const handleGA = (subService: IServiceCategory) => {
        const requestsString = subService.serviceRequests.map(item => `${item.code} (${item.description})`).join(', ');
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Selected Sub Service',
            label: `With Name ${subService.name} ${subService.serviceRequests?.length && `And Service Requests ${requestsString}`}`,
        })
    }

    const handleCategories = (subService: IServiceCategory) => {
        if (categoriesIds && subService.type !== EServiceCategoryType.LinkToPage2) {
            const categories = categoriesIds?.includes(subService.id) ? categoriesIds : [...categoriesIds, subService.id];
            dispatch(selectCategoriesIds(categories));
        }
    }

    const clearData = () => {
        dispatch(setAdditionalServicesChosen(false));
        dispatch(selectAppointment(null));
        dispatch(selectServiceValetAppointment(null));
        dispatch(clearAppointmentSteps("serviceNeeds"));
    }

    const handleSubmit = (subService: IServiceCategory) => {
        if (subService) {
            setLastSelectedCategory(subService);
            if (subService.offer?.description) {
                onNext('serviceOfferProductPage')
            } else {
                handleGA(subService);
                handleCategories(subService);
                clearData();

                switch (subService.type) {
                    case 2:
                    case 4:
                        return onNext('opsCode');
                    case 5:
                        return history.push(`${Routes.EndUser.AppointmentFrameBase}/${id}/valueService`)
                    default:
                        return onNext('describeMore');
                }
            }
        }
    }

    const handleSelectCard = (card: IServiceCategory) => () => {
        dispatch(selectSubService(card));
        handleSubmit(card);
    }

    const handleBack = () => {
        dispatch(selectSubService(null));
        onBack();
    }

    const getCardState = (card: IServiceCategory): boolean => {
        // todo refactor double code
        if (card.type === EServiceCategoryType.IndividualServices) {
            return Boolean(services
                .find(cat => cat.type === EServiceCategoryType.IndividualServices
                    && cat.serviceRequests.find(req => selectedSR.includes(req.id))))
        }
        if (card.type === EServiceCategoryType.Diagnose) {
            return Boolean(services
                .find(cat => cat.type === EServiceCategoryType.Diagnose
                    && cat.serviceRequests.find(req => selectedSR.includes(req.id))))
        }
        return categoriesIds?.includes(card.id)
    }

    return (
        <StepWrapper>
            {!loading ? <CardsWrapper>
                {services.map(card => {
                    return <ServiceCard
                        selected={getCardState(card)}
                        active={subService?.id === card.id}
                        onSelect={handleSelectCard(card)}
                        card={card}
                        key={card.name}/>
                })}
            </CardsWrapper> : <Loading />}
            <CartTable/>
            <Actions
                nextDisabled={!subService}
                nextLabel={t("Next")}
                hideNext
                onNext={() => {}}
                onBack={handleBack} />
        </StepWrapper>
    );
};