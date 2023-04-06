import React from 'react';
import {TPackage} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";

type TTotalComplimentaryProps = {
    packages: TPackage[];
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions, pricing?: EPackagePricingType) => () => void;
    isBmWService: boolean;
}

const TotalComplimentary: React.FC<TTotalComplimentaryProps> = ({isBmWService, packages, setClasses, handleClick}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();

    return <React.Fragment>
        <div className="totalComplimentary complimentaryTitle" style={isBmWService ? {fontSize: 16} : {}}>
            {t("Total Complimentary Value")}:
        </div>
        {packages.map(p => {
            return <div
                onClick={handleClick(p)}
                className={setClasses(p.id, "totalComplimentary last")}
                key={p.id}>
                    <span style={{ fontSize: 20 }}>
                        {p.marketPriceComplimentaryServices
                            ? `$${scProfile?.isRoundPrice
                                ? p.marketPriceComplimentaryServices
                                : p.marketPriceComplimentaryServices.toFixed(2)}`
                            : ''}
                    </span>
            </div>;
        })}
    </React.Fragment>
    ;
};

export default TotalComplimentary;