import React from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';
import {styled, Theme} from "@material-ui/core";
import {IEmployee} from "../../../store/reducers/employees/types";
import anyConsultant from '../../../assets/img/anyConsultantIcon.png';


const ConsultantsWrapper = styled('div')({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "20px"
});

const ConsultantWrapper = styled('div')<Theme, {active?: boolean}>({
    display: "flex",
    gap: "16px",
    border: ({active}) => `1px solid ${active ? "#000000" : "#DADADA"}`,
    alignItems: "center",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "18px",
    padding: 16,
    transition: "all .2s",
    cursor: "pointer"
});

const Avatar = styled('div')<Theme, {src?: string}>({
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: ({src}) => src ? `url('${src}') center center no-repeat` : undefined ,
    backgroundSize: "cover",
})

type TCardProps = {
    advisor?: IEmployee;
    blank?: boolean;
    active?: boolean
}
const ConsultantCard: React.FC<TCardProps> = ({advisor, blank, active}) => {
    return <ConsultantWrapper active={active}>
        {blank
            ? <img src={anyConsultant} alt="Any available consultant"/>
            : <Avatar src={advisor?.avatarPath}/>}
        <div>
            {blank ? "Any available consultant" : advisor?.fullName ?? "-"}
        </div>
    </ConsultantWrapper>
}

export const ConsultantSelection: React.FC<TActionProps> = ({onNext, onBack}) => {
    return (<StepWrapper>
        <ConsultantsWrapper>
            <ConsultantCard blank />
            <ConsultantCard blank />
            <ConsultantCard blank active />
            <ConsultantCard blank />
        </ConsultantsWrapper>
        <Actions onNext={onNext} onBack={onBack} />
    </StepWrapper>);
};