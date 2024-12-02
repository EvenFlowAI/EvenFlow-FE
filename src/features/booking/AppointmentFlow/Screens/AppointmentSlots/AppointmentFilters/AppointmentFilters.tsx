import React, {useMemo, useState} from 'react';
import {FiltersWrapper, TitleWrapper, Wrapper} from "./styles";
import {TArgCallback} from "../../../../../../types/types";
import {IFirstScreenOption} from "../../../../../../store/reducers/serviceTypes/types";
import ServiceOption from "./ServiceOption/ServiceOption";
import SelectedConsultant from "./SelectedConsultant/SelectedConsultant";
import {ReactComponent as Arrow} from "../../../../../../assets/img/arrow_small.svg";
import SelectedTransportation from "./SelectedTransportation/SelectedTransportation";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {EServiceType} from "../../../../../../store/reducers/appointmentFrameReducer/types";
import {MenuItem} from "@mui/material";

type TProps = {
    isSm: boolean;
    onChangeServiceOption: TArgCallback<IFirstScreenOption>;
}

const AppointmentFilters: React.FC<TProps> = ({isSm, onChangeServiceOption }) => {
    const { serviceTypeOption, transportations, consultants} = useSelector((state: RootState) => state.appointmentFrame);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const { isTransportationAvailable, isAdvisorAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(!isSm)

    const someServicesHaveDefaultTransportation = useMemo(() => {
        const someOptionHasDefaultTransportation = firstScreenOptions.some(el => el.transportationOption)
        const someOptionHasNotDefaultTransportation = firstScreenOptions.some(el => !el.transportationOption)
        return someOptionHasDefaultTransportation && someOptionHasNotDefaultTransportation
    }, [firstScreenOptions])

    const noOneServiceHasTransportation = firstScreenOptions
        .filter(el => !el.transportationOption).length === firstScreenOptions.length

    const isTransportationsVisible = useMemo(() => {
        return ((someServicesHaveDefaultTransportation && (serviceTypeOption?.transportationOption || isTransportationAvailable))
                || (noOneServiceHasTransportation && isTransportationAvailable))
            && serviceTypeOption?.type !== EServiceType.MobileService
            && transportations.length
    }, [someServicesHaveDefaultTransportation, serviceTypeOption, isTransportationAvailable, noOneServiceHasTransportation, transportations])

    const serviceOptions = useMemo(() => {
        return serviceTypeOption?.type !== EServiceType.MobileService
            ? firstScreenOptions
                .filter(option => option.type === EServiceType.PickUpDropOff || option.type === EServiceType.VisitCenter)
                .map(option => <MenuItem value={option.id} key={option.name}>{option.name}</MenuItem>)
            : firstScreenOptions
                .filter(option => option.type === EServiceType.MobileService)
                .map(option => <MenuItem value={option.id} key={option.name}>{option.name}</MenuItem>)
    }, [firstScreenOptions, serviceTypeOption])

    const isServiceOptionVisible = useMemo(() => {
        return serviceOptions.length > 1 || serviceTypeOption?.type !== EServiceType.VisitCenter
    }, [serviceOptions, serviceTypeOption])

    const isAdvisorVisible = useMemo(() => {
        return isAdvisorAvailable && consultants?.length
    }, [isAdvisorAvailable, consultants])


    const isVisible = useMemo(() => {
        return isAdvisorVisible || isServiceOptionVisible || isTransportationsVisible
    }, [isAdvisorVisible, isServiceOptionVisible, isTransportationsVisible])

    const onArrowClick = () => setFiltersOpen(prev => !prev);

    return isVisible ? (
        <Wrapper>
            <TitleWrapper onClick={isSm ? onArrowClick : undefined}>
                <div>Appointment Options</div>
                {isSm
                    ? <Arrow style={{transform: !isFiltersOpen ? 'rotate(180deg) translate(0px, 3px)' : 'none', transition: '0.6s ease'}} />
                    : null}
            </TitleWrapper>
            {isFiltersOpen ? <FiltersWrapper>
                <ServiceOption onChangeServiceOption={onChangeServiceOption} isVisible={isServiceOptionVisible} options={serviceOptions}/>
                <SelectedTransportation isVisible={!!isTransportationsVisible}/>
                <SelectedConsultant isVisible={!!isAdvisorVisible}/>
            </FiltersWrapper> : null}
        </Wrapper>
    ) : null;
};

export default AppointmentFilters;