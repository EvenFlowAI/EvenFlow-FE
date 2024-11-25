import React, {useState} from 'react';
import {FiltersWrapper, TitleWrapper, Wrapper} from "./styles";
import {TArgCallback} from "../../../../../../types/types";
import {IFirstScreenOption} from "../../../../../../store/reducers/serviceTypes/types";
import ServiceOption from "./ServiceOption/ServiceOption";
import SelectedConsultant from "./SelectedConsultant/SelectedConsultant";
import {ReactComponent as Arrow} from "../../../../../../assets/img/arrow_small.svg";
import SelectedTransportation from "./SelectedTransportation/SelectedTransportation";

type TProps = {
    isSm: boolean;
    onChangeServiceOption: TArgCallback<IFirstScreenOption>;
}

const AppointmentFilters: React.FC<TProps> = ({isSm, onChangeServiceOption }) => {
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(!isSm)
    const onArrowClick = () => setFiltersOpen(prev => !prev);

    return (
        <Wrapper>
            <TitleWrapper onClick={isSm ? onArrowClick : undefined}>
                <div>Appointment Options</div>
                {isSm
                    ? <Arrow style={{transform: !isFiltersOpen ? 'rotate(180deg) translate(0px, 3px)' : 'none', transition: '0.6s ease'}} />
                    : null}
            </TitleWrapper>
            {isFiltersOpen ? <FiltersWrapper>
                <ServiceOption onChangeServiceOption={onChangeServiceOption}/>
                <SelectedTransportation/>
                <SelectedConsultant/>
            </FiltersWrapper> : null}
        </Wrapper>
    );
};

export default AppointmentFilters;