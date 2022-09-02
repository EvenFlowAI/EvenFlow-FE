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
    onRemoveZip: () => void;
    setCurrentZip: Dispatch<SetStateAction<TZipCode|null>>;
    setSelectedZone: Dispatch<SetStateAction<TZone|null>>;
    selectedZone: TZone|null;
}

const Zones: React.FC<TZonesProps> = ({setCurrentZip, onRemoveZip, setSelectedZone, selectedZone }) => {
    const {zones, isLoading} = useSelector((state: RootState) => state.serviceValet);
    const classes = useStyles();

    return (
        <div className={classes.wrapper}>
            {isLoading
                ? <Loading/>
                : zones.map(item => <Zone
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