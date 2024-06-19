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

const MileageModal: React.FC<DialogProps & {onSave: TCallback, isManagePage?: boolean}> = ({open, onClose, isManagePage, onSave}) => {
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

    const updateData = async () => {
        await dispatch(updateVehicle({mileage: +value}))
    }

    const handleSave = () => {
        isManagePage
            ? updateData().then(onClose)
            : updateData().then(onSave)
    }

    return (
        <BaseModal open={open} onClose={() => {}} width={550}>
            <DialogTitle onClose={onClose}>{t("Please select your estimated mileage")}</DialogTitle>
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
                <Button onClick={onClose} variant="outlined">{t("Cancel")}</Button>
                <Button onClick={handleSave} variant="contained" color="info">{isManagePage ? t("Save") : t("Next")}</Button>
            </DialogActions>
        </BaseModal>
    );
};

export default MileageModal;