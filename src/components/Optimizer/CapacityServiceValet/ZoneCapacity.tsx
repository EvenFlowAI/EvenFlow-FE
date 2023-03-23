import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EZoneTimeGap} from "../../../store/reducers/capacityServiceValet/types";
import {
    ControlsWrapper,
    CustomPaper,
    CustomRadioGroup,
    RadioLabel,
    RadioWrapper,
    useZoneStyles,
} from "./styledComponents";
import {Button, CircularProgress, FormControlLabel, Radio} from "@material-ui/core";
import ZoneCapacityTable from "./ZoneCapacityTable";

const ZoneCapacity = () => {
    const {isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const {isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const [gap, setGap] = useState<EZoneTimeGap>(EZoneTimeGap.Medium);
    const [isEdit, setEdit] = useState<boolean>(false);
    const classes = useZoneStyles();

    const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        isEdit && setGap(Number(value) as EZoneTimeGap)
    }

    const handleEditCancel = () => {
        setEdit(false)
    }

    const handleSave = () => {
        setEdit(false)
    }

    return <CustomPaper variant="outlined">
        <ControlsWrapper>
            <RadioWrapper>
                <RadioLabel>Gap Slots:</RadioLabel>
                <CustomRadioGroup
                    value={gap}
                    onChange={handleGapChange}
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group">
                    <FormControlLabel
                        value={EZoneTimeGap.Small}
                        disabled={isLoading || isZonesLoading}
                        control={<Radio color="primary" size="small"/>}
                        label="15 min" />
                    <FormControlLabel
                        value={EZoneTimeGap.Medium}
                        disabled={isLoading || isZonesLoading}
                        control={<Radio color="primary" size="small"/>}
                        label="30 min" />
                    <FormControlLabel
                        value={EZoneTimeGap.Large}
                        disabled={isLoading || isZonesLoading}
                        control={<Radio color="primary" size="small"/>}
                        label="60 min" />
                </CustomRadioGroup>
            </RadioWrapper>
            {isEdit
                ? isLoading ? <CircularProgress color="primary" className={classes.progress} />
                    : <div className={classes.editSaveButtons}>
                        <Button
                            className={classes.editButton}
                            color="secondary"
                            onClick={handleEditCancel}>
                            Cancel
                        </Button>
                        <Button
                            className={classes.editButton}
                            color="primary"
                            onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                : <Button
                    color="primary"
                    className={classes.editButton}
                    onClick={() => setEdit(true)}>
                    Edit
                </Button>
            }
        </ControlsWrapper>
        <ZoneCapacityTable gap={gap} isEdit={isEdit}/>
    </CustomPaper>;
};

export default ZoneCapacity;