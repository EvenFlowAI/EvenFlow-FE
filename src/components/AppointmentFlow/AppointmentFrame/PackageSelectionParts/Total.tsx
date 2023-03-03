import React from 'react';
import {TPackage} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";

type TTotalProps = {
    packages: TPackage[];
    handleClick: (p: IPackageOptions) => () => void;
    isSanfordInfinity: boolean;
    isBmWService: boolean;
    setClasses: (id: number, cls: string) => string;
}

const Total: React.FC<TTotalProps> = ({ isBmWService, packages, handleClick, isSanfordInfinity, setClasses }) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();

    return <React.Fragment>
        <div className="total end" style={isBmWService ? {fontSize: 16} : {}}>
            {t("Total")} <span className="info" >({t("excluding taxes")})</span>
        </div>

        {packages.map(p => {
            const priceBefore = p.marketPriceComplimentaryServices ? p.marketPriceComplimentaryServices + p.price : 0;
                return <div
                    onClick={handleClick(p)}
                    className={setClasses(p.id, `total ${scProfile?.isShowPriceDetails && !!priceBefore ? 'priceWithBefore' : 'price'} end`)}
                    key={p.id}>
                    { scProfile?.isShowPriceDetails && !!priceBefore &&
                    <div className="before">
                      ${scProfile?.isRoundPrice ? priceBefore : priceBefore.toFixed(2)}
                    </div> }
                    <div className="currentWrp">
                        <div className="triangle"/>
                        <div className="current">${scProfile?.isRoundPrice ? p.price : p.price.toFixed(2)}</div>
                    </div>
                </div>
            }
        )}
    </React.Fragment>;
};

export default Total;