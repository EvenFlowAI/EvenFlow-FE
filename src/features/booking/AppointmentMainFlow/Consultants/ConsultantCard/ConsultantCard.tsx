import {IServiceConsultant} from "../../../../../api/types";
import {TCallback} from "../../../../../types/types";
import React from "react";
import {useTranslation} from "react-i18next";
import {Avatar, ConsultantWrapper} from "./styles";

type TCardProps = {
    advisor?: IServiceConsultant;
    blank?: boolean;
    active?: boolean;
    onClick: TCallback;
}
export const ConsultantCard: React.FC<TCardProps> = ({advisor, blank, active, onClick}) => {
    const {t} = useTranslation();
    return <ConsultantWrapper onClick={onClick} active={active}>
        {blank
            ? <div className={"icon-wrapper"}><AnyConsultantIcon width={84} height={84}/></div>
            : advisor?.iconPath
                ? <Avatar src={advisor?.iconPath}/>
                : <ConsultantIcon width={84} height={84}/>
        }
        <div>
            {blank ? t("Any available advisor") : advisor?.name ?? "-"}
        </div>
    </ConsultantWrapper>
}