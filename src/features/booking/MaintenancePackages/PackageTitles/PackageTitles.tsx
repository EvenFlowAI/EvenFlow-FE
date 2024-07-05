import React from 'react';
import {IPackageOptions} from "../../../../api/types";
import {EPackagePricingType} from "../../../../store/reducers/appointmentFrameReducer/types";
import {TPackage} from "../types";

type TPackageTitlesProps = {
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions, pricing?: EPackagePricingType) => () => void;
    packages: TPackage[];
}

const PackageTitles: React.FC<React.PropsWithChildren<React.PropsWithChildren<TPackageTitlesProps>>> = ({ packages, setClasses, handleClick }) => {
    return (
        <React.Fragment>
            <div className='top'/>
            {packages.map(p => <div
                className={setClasses(p.id, "top title")}
                onClick={handleClick(p)}
                key={p.id}>
                {p.name}
            </div>)}
    </React.Fragment>
    );
};

export default PackageTitles;