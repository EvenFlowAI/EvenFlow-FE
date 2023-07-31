import React from 'react';
import {ReactComponent as CheckboxCircle} from "../../../../assets/img/done_icon_black.svg";
import {InfoOutlined} from "@material-ui/icons";
import {TPackage, TService, TUpsell} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";
import {useTranslation} from "react-i18next";
import {HtmlTooltip} from "../ServiceCard";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";

type TComplimentaryProps = {
    packages: TPackage[];
    services: TService[];
    upsell: TUpsell[];
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions, pricing?: EPackagePricingType) => () => void;
    isBmWService: boolean;
}

const IntervalUpsells: React.FC<TComplimentaryProps> =
    ({upsell, packages, setClasses, isBmWService, handleClick}) => {
        const {t} = useTranslation();
        return upsell.length
            ? <React.Fragment>
                <div className="yellow subtitle">{t("Dashboard Indicator Services")}</div>

                {packages.map(p =>
                    <div
                        key={p.id}
                        onClick={handleClick(p)}
                        className={setClasses(p.id, "yellow subtitle")}/>
                )}

                {upsell
                    .slice()
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((c, i) => <React.Fragment key={c.name + c.id + i}>
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
                                className={setClasses(p.id, "service yellow")}>
                                {c.packages.includes(p.id) ? <CheckboxCircle/> : ""}
                            </div>
                        )}
                    </React.Fragment>)}
            </React.Fragment>
            : null;
    };

export default IntervalUpsells;