import {IServiceConsultant} from "../../../../../../api/types";
import {TCallback} from "../../../../../../types/types";
import React from "react";
import {useTranslation} from "react-i18next";
import {Avatar, ConsultantWrapper} from "./styles";
import {ReactComponent as AnyConsultantIcon} from '../../../../../../assets/img/advisor_black.svg';
import {ReactComponent as ConsultantIcon} from '../../../../../../assets/img/advisor_grey.svg';

type TCardProps = {
    advisor?: IServiceConsultant;
    blank?: boolean;
    active?: boolean;
    onClick: TCallback;
}

export const ConsultantCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TCardProps>>> = ({advisor, blank, active, onClick}) => {
    const {t} = useTranslation();
    return <ConsultantWrapper onClick={onClick} active={active}>
        {blank
            ? <div className={"icon-wrapper"}><AnyConsultantIcon width={80} height={80}/></div>
            : advisor?.iconPath
                ? <Avatar src={advisor?.iconPath}/>
                : <ConsultantIcon width={80} height={80}/>
        }
        <div>
            {blank ? t("Any available advisor") : advisor?.name ?? "-"}
        </div>
    </ConsultantWrapper>
}