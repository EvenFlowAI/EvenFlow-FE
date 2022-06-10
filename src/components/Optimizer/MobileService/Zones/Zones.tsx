import React, {Dispatch, SetStateAction} from 'react';
import Zone from "./Zone";
import {TZone} from "../../../../store/reducers/mobileService/types";
import {makeStyles} from "@material-ui/core/styles";

export const mockZones = [
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
    },
    {
        name: 'Zone 2',
        id: 2,
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
    },
    {
        name: 'Zone 3',
        id: 3,
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

const useStyles = makeStyles(() => ({
    wrapper: {
        width: '70%',
        display: "grid",
        gridTemplateColumns: '1fr 1fr',
        gridGap: 24,
    }
}))

type TZonesProps = {
    currentZone: TZone|null;
    setCurrentZone: Dispatch<SetStateAction<TZone|null>>;
    onRemoveZip: () => void;
    setCurrentZip: Dispatch<SetStateAction<string>>;
}

const Zones: React.FC<TZonesProps> = ({ currentZone, setCurrentZone, setCurrentZip, onRemoveZip }) => {
    const classes = useStyles();

    const setSelected = (zone: TZone) => {
        setCurrentZone(zone);
    }

    return (
        <div className={classes.wrapper}>
            {mockZones.map(item => <Zone
                zone={item}
                setCurrentZip={setCurrentZip}
                onRemoveZip={onRemoveZip}
                zipCodes={item.zipCodes}
                isSelected={currentZone?.id === item.id}
                setSelected={setSelected}/>
            )}
        </div>
    );
};

export default Zones;