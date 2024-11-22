import React, {useEffect} from 'react';
import {StepWrapper} from "../../../../../components/styled/StepWrapper";
import {ActionButtons} from '../../../ActionButtons/ActionButtons';
import {decodeSCID} from "../../../../../utils/utils";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {ITransportation} from '../../../../../api/types';
import {
    loadActiveTransportations,
    setTransportation
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {Loading} from "../../../../../components/wrappers/Loading/Loading";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";
import {TextWrapper} from "./styles";
import {TActionProps, TCallback} from "../../../../../types/types";
import CustomerConsents from "../../../../../components/modals/booking/CustomerConsents/CustomerConsents";
import {CardsWrapper} from "../../../../../components/wrappers/CardsWrapper/CardsWrapper";
import {TransportationOptionCard} from "./TransportationCard/TransportationOptionCard";

export type TProps = TActionProps & {
    handleConsentsAccepted: TCallback;
}

export const TransportationNeeds: React.FC<TProps> = ({onNext, onBack, handleConsentsAccepted}) => {
    const {
        transportation,
        isConsentsLoading,
        trackerData,
        transportations,
        isTransportationsLoading,
    } = useSelector(({appointmentFrame}: RootState) => appointmentFrame)
    const {id} = useParams<{id: string}>();
    const {t} = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadActiveTransportations(decodeSCID(id)))
    }, [id]);

    const handleGA = (transportation: ITransportation|null) => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Selected Transportation Need',
            label: `With Name ${transportation ? transportation.name : 'I Will Be Waiting'}`,
        }, trackerData.ids)
    }

    const handleNext = (transportation: ITransportation|null): void => {
        handleGA(transportation);
        onNext();
    }

    const handleSelectOption = (o: ITransportation|null) => {
        dispatch(setTransportation(o));
        handleNext(o)
    }

    return <StepWrapper>
        {isTransportationsLoading || isConsentsLoading
            ? <Loading/>
            : transportations.length
                ? <CardsWrapper>
                    {transportations.map(item => {
                        return <TransportationOptionCard
                            key={item.id}
                            active={transportation?.id === item.id}
                            onSelect={() => handleSelectOption(item)}
                            card={item}
                        />
                    })}
                </CardsWrapper>
                : <TextWrapper>
                    {t("Based on your selected services, the only available option is to drop off your vehicle and pick it up at your convenience when the service work is completed")}.
                </TextWrapper>
        }
        <ActionButtons
            onBack={onBack}
            nextLabel={t("Next")}
            onNext={() => handleNext(transportation)}
            hideNext={!transportation && !!transportations.length}
            nextDisabled={isTransportationsLoading || isConsentsLoading}
        />
        <CustomerConsents onNext={handleConsentsAccepted}/>
    </StepWrapper>
};