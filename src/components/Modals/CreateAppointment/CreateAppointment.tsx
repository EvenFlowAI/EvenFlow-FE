import React, {useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {DialogProps} from "../types";
import {TextField} from "../../UI/TextField";
import {useException} from "../../../utils/hooks";
import {updateVehicle} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useDispatch} from "react-redux";

type TCreateAppointmentProps = DialogProps & {
    loading: boolean;
    handleCreateAppointment: (vin: string, withVin?: boolean) => void;
}

const CreateAppointment: React.FC<TCreateAppointmentProps> = (props) => {
    const [vin, setVin] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const showError = useException();
    const dispatch = useDispatch();

    const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setVin(e.target.value.trim());
    }

    const onSaveWithoutVin = () => {
        setError(false)
        props.handleCreateAppointment('', false);
    }

    const onCancel = () => {
        setError(false)
        setVin('');
        props.onClose();
    }

    const onSave = async (vin: string) => {
        if (vin.match(/[a-zA-Z0-9]{9}[a-zA-Z0-9-]{2}[0-9]{6}/g)) {
            setError(false)
            try {
                await dispatch(updateVehicle({vin}));
            } catch (e) {
                showError(e)
            } finally {
                await props.handleCreateAppointment(vin)
            }
        } else {
            setError(true);
            showError('Please enter valid VIN code')
        }
    }

    return <BaseModal
        width={500}
        open={props.open}
        onClose={onCancel}
    >
        <DialogTitle onClose={onCancel}>Providing your VIN allows us to better prepare for your visit</DialogTitle>
        <DialogContent>
            <TextField
                value={vin}
                onChange={handleVinChange}
                fullWidth
                placeholder="Enter VIN"
                error={error}
            />
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
                onClick={() => onSave(vin)}
                variant="contained"
                color="primary">
                Add VIN and Submit
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};

export default CreateAppointment;