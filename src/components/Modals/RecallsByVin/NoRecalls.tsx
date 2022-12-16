import React from 'react';
import {DialogTitle, BaseModal, DialogActions, DialogContent} from "../BaseModal";
import {DialogProps} from "../types";
import {Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        fontSize: 18,
    }
}))

const NoRecalls: React.FC<DialogProps & {handleNext : () => void}> = ({ open, onClose, handleNext }) => {
    const classes = useStyles();
    const onProceed = () => {
        handleNext();
        onClose();
    }
    return (
        <BaseModal open={open} onClose={onClose}>
            <DialogTitle onClose={onClose} style={{justifyContent: "flex-start"}}/>
            <DialogContent>
                <div className={classes.wrapper}>
                    There are not Open Recalls for Your Vehicle, but you can proceed with booking appointment
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onProceed} variant="contained" color="primary">Proceed</Button>
            </DialogActions>
        </BaseModal>
    );
};

export default NoRecalls;