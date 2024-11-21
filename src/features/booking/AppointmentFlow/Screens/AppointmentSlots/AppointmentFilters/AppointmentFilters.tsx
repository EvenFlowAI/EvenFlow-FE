import React, {useState} from 'react';
import {FiltersWrapper, TitleWrapper, Wrapper} from "./styles";
import {TArgCallback, TScreen} from "../../../../../../types/types";
import {IFirstScreenOption} from "../../../../../../store/reducers/serviceTypes/types";
import ServiceOption from "./ServiceOption/ServiceOption";
import SelectedConsultant from "./SelectedConsultant/SelectedConsultant";
import {ReactComponent as Arrow} from "../../../../../../assets/img/arrow_small.svg";

type TProps = {
    isSm: boolean;
    handleSetScreen: TArgCallback<TScreen>;
    onChangeServiceOption: TArgCallback<IFirstScreenOption>;
}

const AppointmentFilters: React.FC<TProps> = ({isSm, handleSetScreen, onChangeServiceOption }) => {
    const [isFiltersOpen, setFiltersOpen] = useState<boolean>(!isSm)
    const onArrowClick = () => setFiltersOpen(prev => !prev);

    return (
        <Wrapper>
            <TitleWrapper>
                <div>Appointment Options</div>
                {isSm
                    ? <Arrow
                        style={{transform: !isFiltersOpen ? 'rotate(180deg) translate(0px, 3px)' : 'none', transition: '0.6s ease'}}
                        onClick={onArrowClick}/>
                    : null}
            </TitleWrapper>
            {isFiltersOpen ? <FiltersWrapper>
                <ServiceOption isSm={isSm} handleSetScreen={handleSetScreen}
                               onChangeServiceOption={onChangeServiceOption}/>
                <SelectedConsultant/>
            </FiltersWrapper> : null}
        </Wrapper>
    );
};

export default AppointmentFilters;