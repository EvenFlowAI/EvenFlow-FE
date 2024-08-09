import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StepWrapper} from "../../../../../components/styled/StepWrapper";
import {ActionButtons} from '../../../ActionButtons/ActionButtons';
import {collectServiceRequestIds, decodeSCID, mapRecallsForRequest} from "../../../../../utils/utils";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {ITransportation} from '../../../../../api/types';
import {
    setTransportation
} from "../../../../../store/reducers/appointmentFrameReducer/actions";
import {Loading} from "../../../../../components/wrappers/Loading/Loading";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";
import {EServiceCategoryType} from "../../../../../store/reducers/categories/types";
import {TextWrapper} from "./styles";
import {TTransportationData} from "./types";
import {TActionProps, TCallback} from "../../../../../types/types";
import {Api} from "../../../../../api/ApiEndpoints/ApiEndpoints";
import CustomerConsents from "../../../../../components/modals/booking/CustomerConsents/CustomerConsents";
import {CardsWrapper} from "../../../../../components/wrappers/CardsWrapper/CardsWrapper";
import {TransportationOptionCard} from "./TransportationCard/TransportationOptionCard";

export type TProps = TActionProps & {
    handleConsentsAccepted: TCallback;
}

export const TransportationNeeds: React.FC<TProps> = ({onNext, onBack, handleConsentsAccepted}) => {
    const {
        subService,
        service,
        categoriesIds,
        hashKey,
        selectedRecalls,
        transportation,
        packagePricingType,
        selectedPackage,
        selectedVehicle,
        packageEMenuType,
        isConsentsLoading,
        trackerData,
    } = useSelector(({appointmentFrame}: RootState) => appointmentFrame)
    const {selectedSR} = useSelector(({appointment}: RootState) => appointment)
    const {allCategories} = useSelector(({categories}: RootState) => categories)
    const [transportations, setTransportations] = useState<ITransportation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {id} = useParams<{id: string}>();
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const serviceRequestIds = useMemo(() => {
        return collectServiceRequestIds(service, subService, null, selectedSR);
    }, [service, subService, selectedSR]);

    const getCategories = useCallback((): number[] => {
        return allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }, [allCategories, EServiceCategoryType, categoriesIds])

    useEffect(() => {
        if (selectedVehicle) {
            const maintenancePackageOption = selectedPackage
                ? {id: selectedPackage?.id, priceType: packagePricingType}
                : packageEMenuType !== null
                    ? {optionType: packageEMenuType}
                    : null;

            const data: TTransportationData = {
                serviceCenterId: decodeSCID(id),
                serviceRequestIds,
                serviceCategoryIds: getCategories(),
                recalls: mapRecallsForRequest(selectedRecalls),
                maintenancePackageOption,
                vehicle: {
                    vin: selectedVehicle.vin,
                    year: selectedVehicle.year,
                    make: selectedVehicle.make,
                    model: selectedVehicle.model,
                    mileage: selectedVehicle.mileage,
                    engineTypeId: selectedVehicle.engineTypeId,
                },
            }
            if (hashKey) data.appointmentHashKey = hashKey;
            Api.call<ITransportation[]>(Api.endpoints.TransportationOptions.GetActive, {data})
                .then(({data}) => {
                    setTransportations(data);
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setTimeout(() => setLoading(false), 500)
        }
    }, [id, serviceRequestIds, selectedVehicle, selectedPackage, selectedRecalls,
        packagePricingType, packageEMenuType, selectedPackage, categoriesIds, hashKey]);

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
    }

    return <StepWrapper>
        {loading || isConsentsLoading
            ? <Loading/>
            : transportations.length
                ? <CardsWrapper>
                    {transportations.map(item => {
                        return <TransportationOptionCard
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
            nextDisabled={loading || isConsentsLoading || (!transportation && !!transportations.length)}
        />
        <CustomerConsents onNext={handleConsentsAccepted}/>
    </StepWrapper>
};