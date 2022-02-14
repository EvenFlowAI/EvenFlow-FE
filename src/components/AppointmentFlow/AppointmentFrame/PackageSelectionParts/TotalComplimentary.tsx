import React from 'react';
import {TPackage} from "../PackageSelection";
import {IPackageOptions} from "../../../../api/types";

type TTotalComplimentaryProps = {
    packages: TPackage[];
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions) => () => void;
    isBmWService: boolean;
    isSanfordInfinity: boolean;
}

const TotalComplimentary: React.FC<TTotalComplimentaryProps> = ({isBmWService, isSanfordInfinity, packages, handleClick, setClasses}) => {
    return <React.Fragment>
        <div className="totalComplimentary last" style={isBmWService ? {fontSize: 16} : {}}>Total Complimentary Value</div>
        {isBmWService|| isSanfordInfinity
            ? packages.map(p => {
                return <div
                    onClick={handleClick(p)}
                    className={setClasses(p.id, "totalComplimentary last")}
                    key={p.id}>
                    <span style={{ fontSize: 20 }}>
                        {p.marketPriceComplimentaryServices ? `$${p.marketPriceComplimentaryServices}` : ''}
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
                    <span style={{ fontSize: 20 }}>{price ? `$${price}` : ''}</span>
                </div>;
            })}
    </React.Fragment>
    ;
};

export default TotalComplimentary;