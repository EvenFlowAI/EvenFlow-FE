import React, {Dispatch, SetStateAction} from 'react';
import GeographicZone from "../../../components/GeographicZone/GeographicZone";
import {TZipCode, TZone} from "../../../store/reducers/mobileService/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../../components/UI/Loading";
import {useStyles} from "./styles";

type TZonesProps = {
    onRemoveZip: () => void;
    setCurrentZip: Dispatch<SetStateAction<TZipCode|null>>;
    selectedZone: TZone|null;
    setSelectedZone: Dispatch<SetStateAction<TZone|null>>
}

const Zones: React.FC<TZonesProps> = ({ setCurrentZip, onRemoveZip, setSelectedZone, selectedZone }) => {
    const {zones, isLoading} = useSelector((state: RootState) => state.mobileService);
    const classes = useStyles();

    return (
        <div className={classes.wrapper}>
            {isLoading
                ? <Loading/>
                : zones.map(item => <GeographicZone
                    zone={item}
                    key={item.id}
                    setCurrentZip={setCurrentZip}
                    onRemoveZip={onRemoveZip}
                    zipCodes={item.zipCodes}
                    setSelectedZone={setSelectedZone}
                    isSelected={selectedZone?.id === item.id}
                    />
                )}
        </div>
    );
};

export default Zones;