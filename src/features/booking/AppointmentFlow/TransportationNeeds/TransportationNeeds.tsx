import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StepWrapper} from "../../../../components/styled/StepWrapper";
import {ActionButtons} from '../../ActionButtons/ActionButtons';
import {collectServiceRequestIds, decodeSCID, mapRecallsForRequest} from "../../../../utils/utils";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {ITransportation} from '../../../../api/types';
import {setCurrentFrameScreen, setTransportation} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import ReactGA from "react-ga4";
import {useTranslation} from "react-i18next";
import {ETransportColumn} from "../../../../store/reducers/transportationNeeds/types";
import {EServiceCategoryType} from "../../../../store/reducers/categories/types";
import moment from "moment";
import {setChangesCompletedOpen} from "../../../../store/reducers/modals/actions";
import {TextWrapper, TransportationsWrapper} from "./styles";
import {TransportationCard} from "./TransportationCard/TransportationCard";
import {TTransportationData} from "./types";
import {TActionProps} from "../../../../types/types";
import {Api} from "../../../../api/ApiEndpoints/ApiEndpoints";

export const TransportationNeeds: React.FC<React.PropsWithChildren<React.PropsWithChildren<TActionProps>>> = ({onNext, onBack}) => {
    const {
        subService,
        service,
        categoriesIds,
        isUsualFlowNeeded,
        hashKey,
        selectedRecalls,
        transportation,
        packagePricingType,
        selectedPackage,
        selectedVehicle,
        packageEMenuType,
        appointmentByKey
    } = useSelector(({appointmentFrame}: RootState) => appointmentFrame)
    const {selectedSR, customerLoadedData, appointment} = useSelector(({appointment}: RootState) => appointment)
    const {allCategories} = useSelector(({categories}: RootState) => categories)
    const {id} = useParams<{id: string}>();
    const {t} = useTranslation();
    const [transportations, setTransportations] = useState<ITransportation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    const serviceRequestIds = useMemo(() => {
        return collectServiceRequestIds(service, subService, null, selectedSR);
    }, [service, subService, selectedSR]);
    const transportationNo = useMemo(() => transportations.filter(item => item.column === ETransportColumn.No), [transportations])
    const transportationYes = useMemo(() => transportations.filter(item => item.column === ETransportColumn.Yes), [transportations])

    const date = useMemo(() => {
        let fullDateString = ''
        if (appointmentByKey) {
            const [hh, mm] = appointmentByKey?.timeSlot.split(":");
            fullDateString = moment.utc(appointmentByKey?.dateInUtc).set('hour', hh ? +hh : 0).set('minute', mm ? +mm : 0).toISOString(true)
        }
        if (appointment) {
            return appointment.appointmentDate
        } else {
            return appointmentByKey ? fullDateString : '';
        }
    }, [appointmentByKey, appointment])

    const getCategories = useCallback((): number[] => {
        return allCategories
            .filter(category => {
                return category.type === EServiceCategoryType.GeneralCategory && categoriesIds.includes(category.id)
            })
            .map(item => item.id)
    }, [allCategories, EServiceCategoryType, categoriesIds])

    useEffect(() => {
        if (selectedVehicle) {
            setLoading(true);
            const maintenancePackageOption = selectedPackage
                ? {id: selectedPackage?.id, priceType: packagePricingType}
                : packageEMenuType !== null
                    ? {optionType: packageEMenuType}
                    : null;

            const data: TTransportationData = {
                serviceCenterId: decodeSCID(id),
                serviceRequestIds,
                slot: date,
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
        }
    }, [id, serviceRequestIds, selectedVehicle, selectedPackage, selectedRecalls,
        packagePricingType, packageEMenuType, selectedPackage, categoriesIds, hashKey, date]);

    const handleNext = (transportation: ITransportation|null): void => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Selected Transportation Need',
            label: `With Name ${transportation ? transportation.name : 'I Will Be Waiting'}`,
        })
        if (customerLoadedData?.isUpdating) {
            dispatch(setChangesCompletedOpen(true))
        } else {
            onNext();
        }
    }

    const handleSelectOption = (o: ITransportation|null) => {
        dispatch(setTransportation(o));
        handleNext(o);
    }

    const handleBack = () => {
        if (customerLoadedData?.isUpdating && !isUsualFlowNeeded) {
            dispatch(setCurrentFrameScreen("manageAppointment"))
        } else {
            dispatch(setTransportation(null));
            onBack();
        }
    }

    return <StepWrapper>
        {loading ? <Loading/>
            : transportations.length ? <TransportationsWrapper>
                    {transportationNo.length ? <TransportationCard
                        active
                        selectedTransportation={transportation}
                        transportation={`${t("No, I will")}:`}
                        options={transportationNo}
                        onSelectOption={handleSelectOption}
                    /> : null}
                    {transportationYes.length ? <TransportationCard
                        active
                        options={transportationYes}
                        selectedTransportation={transportation}
                        transportation={`${t("Yes, I would like")}:`}
                        onSelectOption={handleSelectOption}
                    /> : null}
            </TransportationsWrapper>
                : <TextWrapper>
                    {t("We are sorry but no transportation options are available on the date and time you selected.")} {t("You can always drop off your vehicle and pick it up at your convenience when the service work is completed")}
                </TextWrapper>
        }
        <ActionButtons
            onBack={handleBack}
            nextLabel={t("Next")}
            hideNext={!!transportations.length}
            onNext={onNext}
            nextDisabled={loading || Boolean(transportations.length) && !transportation}
        />
    </StepWrapper>
};