import React from 'react';
import {IPackageOptions} from "../../../../../api/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {EPackagePricingType} from "../../../../../store/reducers/appointmentFrameReducer/types";
import {TPackage} from "../types";

type TTotalComplimentaryProps = {
    packages: TPackage[];
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions, pricing?: EPackagePricingType) => () => void;
    isBmWService: boolean;
}

const PackagesTotalComplimentary: React.FC<React.PropsWithChildren<TTotalComplimentaryProps>> = ({isBmWService, packages, setClasses, handleClick}) => {
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
                    <span style={{fontSize: 20}}>
         ${scProfile?.isRoundPrice
                        ? +p.marketPriceComplimentaryServices
                        : (+p.marketPriceComplimentaryServices).toFixed(2)}
                    </span>
                </div>;
            })}
        </React.Fragment>;
};

export default PackagesTotalComplimentary;