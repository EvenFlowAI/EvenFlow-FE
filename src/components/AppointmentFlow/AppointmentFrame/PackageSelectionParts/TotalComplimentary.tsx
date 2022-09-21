import React from 'react';
import {TPackage} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";

type TTotalComplimentaryProps = {
    packages: TPackage[];
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions) => () => void;
    isBmWService: boolean;
    isSanfordInfinity: boolean;
}

const TotalComplimentary: React.FC<TTotalComplimentaryProps> = ({isBmWService, isSanfordInfinity, packages, handleClick, setClasses}) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {t} = useTranslation();

    return <React.Fragment>
        <div className="totalComplimentary last" style={isBmWService ? {fontSize: 16} : {}}>
            {t("Total Complimentary Value")}
        </div>
        {isBmWService|| isSanfordInfinity
            ? packages.map(p => {
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
            })
            : packages.map(p => {
                const price = p.complimentaryServices.reduce(
                    (acc, el) => acc + el.price, 0
                );
                return <div
                    onClick={handleClick(p)}
                    className={setClasses(p.id, "totalComplimentary last")}
                    key={p.id}>
                    <span style={{ fontSize: 20 }}>
                        {price ? `$${scProfile?.isRoundPrice ? price : price.toFixed(2)}` : ''}
                    </span>
                </div>;
            })}
    </React.Fragment>
    ;
};

export default TotalComplimentary;