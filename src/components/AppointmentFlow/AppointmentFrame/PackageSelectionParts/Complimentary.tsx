import React from 'react';
import {ReactComponent as CheckboxCircle} from "../../../../assets/img/done_icon_black.svg";
import {InfoOutlined} from "@material-ui/icons";
import {TComplimentary, TPackage, TService} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";
import {useTranslation} from "react-i18next";
import {HtmlTooltip} from "../ServiceCard";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";

type TComplimentaryProps = {
    packages: TPackage[];
    services: TService[];
    complimentary: TComplimentary[];
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions, pricing?: EPackagePricingType) => () => void;
    isBmWService: boolean;
}

const Complimentary: React.FC<TComplimentaryProps> =
    ({complimentary, packages, setClasses, isBmWService, handleClick}) => {
        const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();
    return <React.Fragment>
            <div className="green subtitle">{t("Complimentary")}</div>
        
            {packages.map(p =>
                <div
                    key={p.id}
                    onClick={handleClick(p)}
                    className={setClasses(p.id, "green subtitle")}/>
            )}

            {complimentary
                .slice()
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((c, i) => <React.Fragment key={c.name}>
                <div
                    className={`serviceWithInfo ${!scProfile?.isShowPriceDetails && i === complimentary.length - 1 ? "last" : ""}`}
                     style={isBmWService ? {fontSize: 18} : {}}>
                    {c.name} {c.detailedDescription?.length
                    ? <HtmlTooltip
                        placement="right-end"
                        title={<div dangerouslySetInnerHTML={{__html: c.detailedDescription}}/>}
                    >
                        <InfoOutlined style={{cursor: 'pointer', marginLeft: 20}}/>
                    </HtmlTooltip>
                    : null}
                </div>

                {packages.map((p) => {
                        return <div
                            key={p.id}
                            onClick={handleClick(p)}
                            className={setClasses(p.id, `service green ${scProfile?.isShowPriceDetails ? "" 
                                : i === complimentary.length - 1 ? "last" : ""}`)}>
                            {c.packages.includes(p.id) ? <CheckboxCircle/> : ""}
                        </div>
                    }
                )}
            </React.Fragment>)}
        </React.Fragment>;
};

export default Complimentary;