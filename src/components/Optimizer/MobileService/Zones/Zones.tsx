import React, {Dispatch, SetStateAction} from 'react';
import Zone from "./Zone";
import {TZipCode, TZone} from "../../../../store/reducers/mobileService/types";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../UI/Loading";

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
    setCurrentZip: Dispatch<SetStateAction<TZipCode|null>>;
}

const Zones: React.FC<TZonesProps> = ({ currentZone, setCurrentZone, setCurrentZip, onRemoveZip }) => {
    const {zones, isLoading} = useSelector((state: RootState) => state.mobileService);
    const classes = useStyles();

    const setSelected = (zone: TZone) => {
        setCurrentZone(zone);
    }

    return (
        <div className={classes.wrapper}>
            {isLoading
                ? <Loading/>
                : zones.map(item => <Zone
                    zone={item}
                    key={item.id}
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