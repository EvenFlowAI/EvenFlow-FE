import React, {useState} from 'react';
import Zone from "./Zone";
import {TZone} from "../../../../store/reducers/mobileService/types";

const zones = [
    {
        name: 'Zone 1',
        id: 1,
        zipCodes: [
            {
                code: '65671',
                id: 1
            },
            {
                code: '65655',
                id: 2
            },
            {
                code: '65671',
                id: 3
            },
            {
                code: '65655',
                id: 4
            }, {
                code: '65671',
                id: 5
            },
            {
                code: '65655',
                id: 6
            }
        ]
    }
]

const Zones = () => {
    const [selectedZone, setSelectedZone] = useState<TZone | null>(null);
    const setSelected = (zone: TZone) => {
        setSelectedZone(zone);
    }
    return (
        <div>
            {zones.map(item => <Zone
                zone={item}
                zipCodes={item.zipCodes}
                isSelected={selectedZone?.id === item.id}
                setSelected={setSelected}/>
            )}
        </div>
    );
};

export default Zones;