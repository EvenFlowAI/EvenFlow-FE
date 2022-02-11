import React from 'react';
import {TPackage} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";

type TTotalProps = {
    packages: TPackage[];
    handleClick: (p: IPackageOptions) => () => void;
    isSanfordInfinity: boolean;
    isBmWService: boolean;
    setClasses: (id: number, cls: string) => string;
}

const Total: React.FC<TTotalProps> = ({ isBmWService, packages, handleClick, isSanfordInfinity, setClasses }) => {
    return <React.Fragment>
        <div className="total end" style={isBmWService ? {fontSize: 16} : {}}>
            Total <span className="info" >(excluding taxes)</span>
        </div>

        {packages.map(p =>
            <div
                onClick={handleClick(p)}
                className={setClasses(p.id, `total ${isBmWService || isSanfordInfinity ? 'priceWithBefore' : 'price'} end`)}
                key={p.id}>
                {(isBmWService || isSanfordInfinity) &&
                <div className="before">
                  ${p.marketPriceComplimentaryServices + p.price}
                </div>}
                <div className="currentWrp">
                    <div className="triangle"/>
                    <div className="current">${p.price}</div>
                </div>
            </div>
        )}
    </React.Fragment>;
};

export default Total;