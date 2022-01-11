import React from 'react';
import {DialogContent, DialogTitle} from "../BaseModal";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {DialogProps} from "../types";
import {getServicesDescription} from "../../AppointmentFlow/AppointmentFrame/uiUtils";
import {Dialog, styled} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ErrorOutline} from "@material-ui/icons";

type TDetailedFeesProps = DialogProps & {

}

const List = styled('ul')({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: "12px",
    margin: "12px 0 0",
    padding: 0,
    listStyle: "none",
    background: 'white',
    "& .service-item": {
        textTransform: "capitalize"
    }
});

const Info = styled('div')({
    display: 'flex',
    alignItems: 'center',
    margin: '12px 0 24px 0',
    padding: 0,
    "& > .text": {
        marginLeft: 10,
    }
});

const useStyles = makeStyles(() => ({
    item: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 24px',

        "&:not(last-child)": {
            borderBottom: '1px solid rgba(0, 0, 0, 0.15)'
        }
    },
}))

const useDialogStyles = makeStyles({
    root: {
        "& hr": {
            margin: "28px 0",
        },
        "& input": {
            padding: 11,
            fontSize: 14
        },
    },
    dialogTitle: {
        textAlign: "left",
        "&> h2": {
            fontSize: 19,
            fontWeight: "bold"
        }
    },
    dialogContent: {
        padding: "10px 25px"
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0
    },
    dialogPaper: {
        backgroundColor: '#E5E5E5',
        maxWidth: 525,
    }
});

const DetailedFees: React.FC<TDetailedFeesProps> = ({ open, onClose, }) => {
    const [
        selectedSr,
        srList,
        sc,
        ssc,
        appointment
    ] = useSelector((state: RootState) => [
        state.appointment.selectedSR,
        state.appointment.serviceRequests,
        state.appointmentFrame.service,
        state.appointmentFrame.subService,
        state.appointment.appointment,
    ]);
    const classes = useStyles();
    const dialogClasses = useDialogStyles();

    const services = getServicesDescription(srList, selectedSr, sc, ssc);

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                Selected Price:   ${appointment?.price.value ?? ''}
            </DialogTitle>
            <DialogContent>
                <List>
                    {services.map(item => <li className={classes.item}><span>{item}</span><ErrorOutline/></li>)}
                </List>
                <Info><ErrorOutline/><span className="text">Service item will be quoted at dealership</span></Info>
            </DialogContent>
        </Dialog>
    );
};

export default DetailedFees;