import React from 'react';
import {DialogTitle, BaseModal, DialogContent} from "../BaseModal";
import {DialogProps} from "../types";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {Paper} from "@material-ui/core";
import {PaperTitle} from "../../Optimizer/PricingSettings/UI";

type TProps = {

} & DialogProps;

const useStyles = makeStyles(() => ({
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 30,
        fontWeight: 'bold',
    }
}))

const ViewDetailsPopup:React.FC<TProps> = ({...props}) => {
    const appointment = useSelector((state: RootState) => state.appointment.appointment);
    const classes = useStyles();

    return (
        <BaseModal {...props} width={500} onClose={props.onClose}>
            <DialogTitle onClose={props.onClose} className={classes.title}>
                <span>Total: </span>
                <span>${appointment?.price.value ?? 0}</span>
            </DialogTitle>
            <DialogContent>
                <Paper>
                    <PaperTitle></PaperTitle>
                </Paper>
            </DialogContent>
        </BaseModal>
    );
};

export default ViewDetailsPopup;