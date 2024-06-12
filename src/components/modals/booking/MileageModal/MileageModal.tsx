import React, {useEffect, useState} from 'react';
import {
    BaseModal,
    DialogActions,
    DialogContent,
    DialogTitle
} from "../../BaseModal/BaseModal";
import {DialogProps} from "../../BaseModal/types";
import {Autocomplete, Button} from "@mui/material";
import {TCallback} from "../../../../types/types";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {updateVehicle} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {useTranslation} from "react-i18next";

const MileageModal: React.FC<DialogProps & {onSave: TCallback}> = ({open, onClose, onSave}) => {
    const {mileage} = useSelector((state: RootState) => state.vehicleDetails);
    const {selectedVehicle} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [value, setValue] = useState<string>('')

    useEffect(() => {
        setValue(selectedVehicle?.mileage ? selectedVehicle.mileage.toString() : '')
    }, [selectedVehicle])

    const handleChange = (e: React.ChangeEvent<{}>, option: string) => {
        setValue(option)
    }

    const handleSave = () => {
        dispatch(updateVehicle({mileage: +value}))
        onSave()
    }

    return (
        <BaseModal open={open} onClose={onClose} width={550}>
            <DialogTitle onClose={onClose}>Please select the mileage value to proceed</DialogTitle>
            <DialogContent>
                <div style={{margin: '20px auto', width: '70%',}}>
                    <Autocomplete
                        isOptionEqualToValue={(o, v) => o === v}
                        options={mileage.map(item => item.value.toString())}
                        onChange={handleChange}
                        disableClearable
                        autoComplete={true}
                        renderInput={autocompleteRender({
                            label: t("Estimated mileage"),
                            required: true
                        })}
                        value={value}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="info">Save</Button>
            </DialogActions>
        </BaseModal>
    );
};

export default MileageModal;