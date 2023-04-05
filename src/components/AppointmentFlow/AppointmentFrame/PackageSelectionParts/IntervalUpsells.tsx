import React from 'react';
import {ReactComponent as CheckboxCircle} from "../../../../assets/img/done_icon_black.svg";
import {CheckBoxOutlined, InfoOutlined} from "@material-ui/icons";
import {TPackage, TService, TUpsell} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";
import {useTranslation} from "react-i18next";
import {HtmlTooltip} from "../ServiceCard";

type TComplimentaryProps = {
    packages: TPackage[];
    services: TService[];
    upsell: TUpsell[];
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions) => () => void;
    isRiverviewFord: boolean;
    isBmWService: boolean;
}

const IntervalUpsells: React.FC<TComplimentaryProps> =
    ({upsell, packages, handleClick, setClasses, isBmWService, isRiverviewFord}) => {
    const {t} = useTranslation();
    return <React.Fragment>
            <div className="green subtitle">{t("Complimentary")}</div>
        
            {packages.map(p =>
                <div
                    key={p.id}
                    onClick={handleClick(p)}
                    className={setClasses(p.id, "green subtitle")}/>
            )}

            {upsell
                .slice()
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map(c => <React.Fragment key={c.name}>
                <div className="serviceWithInfo" style={isBmWService ? {fontSize: 18} : {}}>
                    {c.name} {c.detailedDescription?.length
                    ? <HtmlTooltip
                        placement="right-end"
                        title={<div dangerouslySetInnerHTML={{__html: c.detailedDescription}}/>}
                    >
                        <InfoOutlined style={{cursor: 'pointer', marginLeft: 20}}/>
                    </HtmlTooltip>
                    : null}
                </div>

                {packages.map(p =>
                    <div
                        key={p.id}
                        onClick={handleClick(p)}
                        className={setClasses(p.id, "service green")}>
                        {c.packages.includes(p.id) ? isRiverviewFord ? <CheckboxCircle/> : <CheckBoxOutlined/> : ""}
                    </div>
                )}
            </React.Fragment>)}
        </React.Fragment>;
};

export default IntervalUpsells;