import React, {Dispatch, SetStateAction} from 'react';
import {TZipCode, TZone} from "../../../../store/reducers/mobileService/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import GeographicZone from "../../../../components/wrappers/GeographicZone/GeographicZone";
import {useStyles} from "./styles";

type TZonesProps = {
    onRemoveZip: () => void;
    setCurrentZip: Dispatch<SetStateAction<TZipCode|null>>;
    setSelectedZone: Dispatch<SetStateAction<TZone|null>>;
    selectedZone: TZone|null;
}

const Zones: React.FC<React.PropsWithChildren<TZonesProps>> = ({setCurrentZip, onRemoveZip, setSelectedZone, selectedZone }) => {
    const {zones, isLoading} = useSelector((state: RootState) => state.serviceValet);
    const classes = useStyles();

    return (
        <div className={classes.wrapper}>
            {isLoading
                ? <Loading/>
                : zones.map(item => <GeographicZone
                zone={item}
                key={item.id}
                setSelectedZone={setSelectedZone}
                setCurrentZip={setCurrentZip}
                onRemoveZip={onRemoveZip}
                zipCodes={item.zipCodes}
                isSelected={selectedZone?.id === item.id}
                />
            )}
        </div>
    );
};

export default Zones;