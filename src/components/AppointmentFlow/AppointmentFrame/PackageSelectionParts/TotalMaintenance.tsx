import React from 'react';
import {TPackage} from "../PackageSelection";

type TTotalMaintenanceProps = {
    isBmWService: boolean;
    setClasses: (id: number, cls: string) => string;
    packages: TPackage[];
}

const TotalMaintenance: React.FC<TTotalMaintenanceProps> = ({ packages, isBmWService, setClasses }) => {
    return (
        <React.Fragment key="maintenance">
            <div className="totalMaintenance"
                 style={isBmWService ? {fontSize: 16} : {}}>
                Total Maintenance Value:
            </div>
            {packages.map(p => (
                <div className={setClasses(p.id, '')}>
                <span style={{ fontSize: 20 }}>${p.price}</span>
            </div>
            ))}
        </React.Fragment>
    );
};

export default TotalMaintenance;