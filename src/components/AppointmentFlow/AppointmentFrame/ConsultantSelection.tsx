import React, {useEffect, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';
import {styled, Theme} from "@material-ui/core";
import anyConsultant from '../../../assets/img/anyConsultantIcon.png';
import {useParams} from "react-router-dom";
import {Api} from "../../../config/requests";
import {PaginatedAPIResponse} from "../../../types/types";
import { IServiceConsultant } from '../../../api/types';
import {decodeSCID} from "../../../utils/utils";


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
    advisor?: IServiceConsultant;
    blank?: boolean;
    active?: boolean
}
const ConsultantCard: React.FC<TCardProps> = ({advisor, blank, active}) => {
    return <ConsultantWrapper active={active}>
        {blank
            ? <img src={anyConsultant} alt="Any available consultant"/>
            : <Avatar src={advisor?.iconPath}/>}
        <div>
            {blank ? "Any available consultant" : advisor?.name ?? "-"}
        </div>
    </ConsultantWrapper>
}

export const ConsultantSelection: React.FC<TActionProps> = ({onNext, onBack}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [consultants, setConsultants] = useState<IServiceConsultant[]>([]);

    const {id} = useParams();

    useEffect(() => {
        setLoading(true);
        Api.call<PaginatedAPIResponse<IServiceConsultant>>(
            Api.endpoints.ServiceConsultants.GetDmsAdvisors,
            {
                urlParams: {
                    id: decodeSCID(id)
                }
            })
            .then(({data: {result}}) => {
                setConsultants(result);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id]);

    return (<StepWrapper>
        <ConsultantsWrapper>
            <ConsultantCard blank />
            {consultants.map(c =>
                <ConsultantCard advisor={c} key={c.id} />
            )}
        </ConsultantsWrapper>
        <Actions onNext={onNext} onBack={onBack} />
    </StepWrapper>);
};