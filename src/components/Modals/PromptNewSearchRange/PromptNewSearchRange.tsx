import React from 'react';
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {DialogProps} from "../types";

type TPromptNewSearchRangeProps = DialogProps & {
    onSave: () => void
}

const PromptNewSearchRange: React.FC<TPromptNewSearchRangeProps> = (props) => {
    return (
        <BaseModal
            width={400}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
               To see more options please adjust your appointment search. Would you like to see more options?
            </DialogTitle>
            <DialogActions>
                <LoadingButton
                    loading={false}
                    onClick={props.onSave}
                    variant="outlined"
                    color="primary">
                    Yes
                </LoadingButton>
                <LoadingButton
                    loading={false}
                    onClick={props.onClose}
                    color="primary"
                    variant="contained">
                    No
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default PromptNewSearchRange;