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

    const getPrice = (p: TPackage): string => {
        let price: string = '';
        if (p.marketPriceComplimentaryServices) {
            price = scProfile?.isRoundPrice
                ? p.marketPriceComplimentaryServices.toString()
                : p.marketPriceComplimentaryServices.toFixed(2)
        } else {
            const suggestedPrice = p.complimentaryServices.reduce((acc, el) => acc + el.price, 0);
            price = scProfile?.isRoundPrice
                ? suggestedPrice.toString()
                : suggestedPrice.toFixed(2)
        }
        return price;
    }

    return <React.Fragment>
        <div className="totalComplimentary complimentaryTitle" style={isBmWService ? {fontSize: 16} : {}}>
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
                return <div
                    onClick={handleClick(p)}
                    className={setClasses(p.id, "totalComplimentary last")}
                    key={p.id}>
                    <span style={{ fontSize: 20 }}>
                        {getPrice(p)}
                    </span>
                </div>;
            })}
    </React.Fragment>
    ;
};

export default TotalComplimentary;