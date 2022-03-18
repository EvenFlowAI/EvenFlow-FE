import React from 'react';
import {TPackage} from "../PackageSelection";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

type TTotalMaintenanceProps = {
    isBmWService: boolean;
    setClasses: (id: number, cls: string) => string;
    packages: TPackage[];
}

const TotalMaintenance: React.FC<TTotalMaintenanceProps> = ({ packages, isBmWService, setClasses }) => {
    const {scProfile} = useSelector((state: RootState) => state.appointment);

    return (
        <React.Fragment key="maintenance">
            <div className="totalMaintenance"
                 style={isBmWService ? {fontSize: 16} : {}}>
                Total Maintenance Value:
            </div>
            {packages.map(p => (
                <div className={setClasses(p.id, '')}>
                <span style={{ fontSize: 20 }}>${scProfile?.isRoundPrice ? p.price : p.price.toFixed(2)}</span>
            </div>
            ))}
        </React.Fragment>
    );
};

export default TotalMaintenance;