import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import {TCallback} from "../../../../../types/types";

type TProps = PickersActionBarProps & {
    onNext: TCallback;
}

export const CustomActionBar: React.FC<TProps> = ({onNext, ...props}) => {
    const { onCancel, actions, className } = props;

    if (actions == null || actions.length === 0) {
        return null;
    }

    return (
        <DialogActions className={className}>
            <Button onClick={onCancel}>
                Cancel
            </Button>
            <Button onClick={onNext}>
                Ok
            </Button>
        </DialogActions>
    );
}
