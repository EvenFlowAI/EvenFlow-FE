import React, {useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {DialogProps} from "../types";
import {TextField} from "../../UI/TextField";

type TCreateAppointmentProps = DialogProps & {
    onSave: (vin: string) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    loading: boolean;
    onSaveWithoutVin: () => void;
}

const CreateAppointment: React.FC<TCreateAppointmentProps> = (props) => {
    const [vin, setVin] = useState<string>('');

    const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVin(e.target.value.trim());
    }

    const onSaveWithoutVin = () => {
        props.onSaveWithoutVin()
    }

    const onCancel = () => {
        setVin('');
        props.onClose();
    }

    return <BaseModal
        width={500}
        open={props.open}
        onClose={onCancel}
    >
        <DialogTitle onClose={onCancel}>Do you want to save VIN Code for future appointments?</DialogTitle>
        <DialogContent>
            <TextField value={vin} onChange={handleVinChange} fullWidth placeholder="Type VIN"/>,
        </DialogContent>
        <DialogActions>
            <LoadingButton
                loading={props.loading}
                variant="outlined"
                onClick={onSaveWithoutVin}>
                Submit Without VIN
            </LoadingButton>
            <LoadingButton
                loading={props.loading}
                onClick={props.onSave(vin)}
                variant="contained"
                color="primary">
                Add VIN and Submit
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};

export default CreateAppointment;