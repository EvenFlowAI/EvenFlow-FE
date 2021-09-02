import React, {useEffect, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import { Actions } from './Actions';
import {styled, Theme} from "@material-ui/core";
import {ReactComponent as AnyConsultantIcon} from '../../../assets/img/any-consultant.svg';
import {useParams} from "react-router-dom";
import {Api} from "../../../config/requests";
import {PaginatedAPIResponse, TCallback} from "../../../types/types";
import { IServiceConsultant } from '../../../api/types';
import {decodeSCID} from "../../../utils/utils";
import {setAdvisor} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../UI/Loading";


const ConsultantsWrapper = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "20px",
    width: "100%",
    [theme.breakpoints.down('sm')]: {
        flexDirection: "column",
        alignItems: "stretch"
    }
}));

const ConsultantWrapper = styled('div')<Theme, {active?: boolean}>(({theme, active}) => ({
    display: "flex",
    gap: "16px",
    border: `1px solid ${active ? "#000000" : "#DADADA"}`,
    color: active ? "#FFFFFF" : theme.palette.text.primary,
    background: active ? "#000000" : "transparent",
    alignItems: "center",
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "18px",
    padding: 16,
    transition: "all .2s",
    cursor: "pointer",
    "& .icon-wrapper": {
        width: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: 'center',
        height: 50,
        borderRadius: "50%",
        color: active ? "#FFFFFF" : theme.palette.text.primary,
    }
}));

const Avatar = styled('div')<Theme, {src?: string, contain?: boolean}>({
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    backgroundSize: ({contain}) => contain ? "contain" : "cover",
    backgroundImage: ({src}) => src ? `url('${src}')` : undefined,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
});

type TCardProps = {
    advisor?: IServiceConsultant;
    blank?: boolean;
    active?: boolean;
    onClick: TCallback;
}
// TODO: Advisor|consultant
const ConsultantCard: React.FC<TCardProps> = ({advisor, blank, active, onClick}) => {
    return <ConsultantWrapper active={active} onClick={onClick}>
        {blank
            ? <div className={"icon-wrapper"}><AnyConsultantIcon /></div>
            : <Avatar src={advisor?.iconPath}/>}
        <div>
            {blank ? "Any available advisor" : advisor?.name ?? "-"}
        </div>
    </ConsultantWrapper>
}

export const ConsultantSelection: React.FC<TActionProps> = ({onNext, onBack}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [consultants, setConsultants] = useState<IServiceConsultant[]>([]);
    const dispatch = useDispatch();
    const selectedConsultant = useSelector((state: RootState) => state.appointmentFrame.advisor);

    const {id} = useParams();

    useEffect(() => {
        setLoading(true);
        Api.call<PaginatedAPIResponse<IServiceConsultant>>(
            Api.endpoints.ServiceConsultants.GetByQuery,
            {
                data: {
                    serviceCenterId: decodeSCID(id)
                }
            })
            .then(({data: {result}}) => {
                setConsultants(result);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id]);

    const handleSelectConsultant = (c: IServiceConsultant|null) => () => {
        dispatch(setAdvisor(c));
    }

    return (<StepWrapper>
        <ConsultantsWrapper>
            <ConsultantCard
                blank
                onClick={handleSelectConsultant(null)}
                active={selectedConsultant === null}
            />
            {loading ? <Loading /> : consultants.map(c =>
                <ConsultantCard
                    onClick={handleSelectConsultant(c)}
                    advisor={c}
                    key={c.id}
                    active={selectedConsultant?.id === c.id} />
            )}
        </ConsultantsWrapper>
        <Actions onNext={onNext} onBack={onBack} />
    </StepWrapper>);
};