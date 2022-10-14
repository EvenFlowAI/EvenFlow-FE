import React from 'react';
import {ReactComponent as CheckboxCircle} from "../../../../assets/img/done_icon_black.svg";
import {CheckBoxOutlined, InfoOutlined} from "@material-ui/icons";
import {IPackageOptions} from "../../../../api/types";
import {TPackage, TService} from "../PackageSelection";
import {useTranslation} from "react-i18next";
import {HtmlTooltip} from "../ServiceCard";

type TIncludedInPackageProps = {
    packages: TPackage[];
    services: TService[];
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions) => () => void;
    isRiverviewFord: boolean;
    isBmWService: boolean;
}

const IncludedInPackage: React.FC<TIncludedInPackageProps> =
    ({packages, services, setClasses, handleClick, isRiverviewFord, isBmWService}) => {
    const {t} = useTranslation();
    return <React.Fragment>
        <div className="gray subtitle">{t("Included in package")}</div>
        {packages.map(p => <div className={setClasses(p.id, "gray subtitle")} key={p.id}/>)}
        {services
            .slice()
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((s, idx) => {
            const isLast = idx + 1 === services.length;
            const cls = `service${isLast ? ' last' : ''}`;
            return <React.Fragment key={s.id}>
                <div className={`serviceWithInfo${isLast ? ' last' : ''}`} style={isBmWService ? {fontSize: 18} : {}}>
                    {s.description} {s.detailedDescription?.length
                    ? <HtmlTooltip
                        placement="right-end"
                        title={<div dangerouslySetInnerHTML={{__html: s.detailedDescription}}/>}
                    ><InfoOutlined style={{cursor: 'pointer', marginLeft: 20}}/></HtmlTooltip> : null}
                </div>

                {packages.map(p => {
                        const clsx = p.lastIdx === idx ? 'service last' : cls;
                        const wMoreClsx = p.moreIdx?.includes(idx) ? `${clsx} lgray` : clsx;
                        return <div
                            key={p.id}
                            onClick={handleClick(p)}
                            className={setClasses(p.id, wMoreClsx)}>
                            {s.packages.includes(p.id) ?  isRiverviewFord ? <CheckboxCircle/> : <CheckBoxOutlined/> : ""}
                        </div>;
                    }
                )}
            </React.Fragment>;
        })}
    </React.Fragment>;
};

export default IncludedInPackage;