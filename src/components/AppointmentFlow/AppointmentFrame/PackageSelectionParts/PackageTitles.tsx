import React from 'react';
import {IPackageOptions} from "../../../../api/types";
import {TPackage} from "../PackageSelection";

type TPackageTitlesProps = {
    setClasses: (id: number, cls: string) => string;
    handleClick: (p: IPackageOptions) => () => void;
    packages: TPackage[];
}

const PackageTitles: React.FC<TPackageTitlesProps> = ({ packages, setClasses, handleClick }) => {
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