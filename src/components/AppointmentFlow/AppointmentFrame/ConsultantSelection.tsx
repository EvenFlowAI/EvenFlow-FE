import React, {useEffect, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from './Actions';
import {styled, Theme} from "@material-ui/core";
import {ReactComponent as AnyConsultantIcon} from '../../../assets/img/any-consultant.svg';
import {useParams} from "react-router-dom";
import {TCallback} from "../../../types/types";
import {IServiceConsultant} from '../../../api/types';
import {
    loadConsultants, selectCategoriesIds,
    selectService, selectSubService,
    setAdvisor,
    setPackage
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../UI/Loading";
import {selectAppointment, selectSR} from "../../../store/reducers/appointment/actions";
import {EServiceCategoryType} from "../../../store/reducers/categories/types";

const ConsultantsWrapper = styled('div')(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    alignItems: "center",
    justifyContent: "flex-start",
    gridGap: "20px",
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
    const {advisor: selectedConsultant, consultants, selectedPackage, service, subService, categoriesIds}= useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSR} = useSelector((state: RootState) => state.appointment);
    const {id} = useParams();
    const dispatch = useDispatch();

    const getData = async (id: string) => {
        setLoading(true);
        await dispatch(loadConsultants(id));
        await setLoading(false);
    }

    useEffect(() => {
        getData(id).then()
    }, [id]);

    const handleSelectConsultant = (c: IServiceConsultant|null) => () => {
        dispatch(selectAppointment(null));
        dispatch(setAdvisor(c));
    }

    const handleBack = () => {
        let categories = [...categoriesIds];
        if (selectedPackage && service?.type === EServiceCategoryType.MaintenancePackage) {
            dispatch(setPackage(null));
            dispatch(selectService(null));
        }
        if (selectedSR?.length && subService?.type === EServiceCategoryType.IndividualServices) {
            dispatch(selectSR(null));
            dispatch(selectSubService(null));
        }
        if (service && categoriesIds?.includes(service.id)) {
            dispatch(selectService(null));
            categories = categories.filter(item => item !== service.id);
        }
        if (subService && categoriesIds?.includes(subService.id)) {
            dispatch(selectSubService(null));
            categories = categories.filter(item => item !== subService.id);
        }
        dispatch(selectCategoriesIds(categories));
        onBack();
    }

    return (<StepWrapper>
        <ConsultantsWrapper>
            {loading ? <Loading /> : <React.Fragment>
                <ConsultantCard
                    blank
                    onClick={handleSelectConsultant(null)}
                    active={selectedConsultant === null}
                />
                {consultants.map(c =>
                <ConsultantCard
                    onClick={handleSelectConsultant(c)}
                    advisor={c}
                    key={c.id}
                    active={selectedConsultant?.id === c.id} />
            )}
            </React.Fragment>
            }
        </ConsultantsWrapper>
        <Actions onNext={onNext} onBack={handleBack} />
    </StepWrapper>);
};