import React from 'react';
import {DialogContent, DialogTitle} from "../BaseModal";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {DialogProps} from "../types";
import {Dialog, styled} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {ErrorOutline} from "@material-ui/icons";

const List = styled('ul')({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    marginBottom: 20,
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
    marginBottom: 24,
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
    price: {
        width: '20%',
        fontWeight: 600,
        fontSize: 16,
        textAlign: 'end',
    }
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
        paddingBottom: 24,
    }
});

const DetailedFees: React.FC<DialogProps> = ({ open, onClose, }) => {
    const {appointment} = useSelector((state: RootState) => state.appointment);
    const dialogClasses = useDialogStyles();
    const classes = useStyles();

    return (
        <Dialog open={open} fullWidth onClose={onClose} classes={{root: dialogClasses.root, paper: dialogClasses.dialogPaper}}>
            <DialogTitle onClose={onClose} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                Selected Price:   ${appointment?.price.value ?? ''}
            </DialogTitle>
            <DialogContent>
                <List>
                    {appointment?.serviceRequestPrices?.map(item => <li className={classes.item}>
                        <span>{item.requestName}</span>
                        {Object(item).hasOwnProperty('priceValue')
                            ? <span className={classes.price}>$ {item.priceValue}</span>
                            : <ErrorOutline/>}
                    </li>)}
                </List>
                {appointment?.serviceRequestPrices?.find(item => typeof item.priceValue === 'undefined') && <Info>
                  <ErrorOutline/>
                  <span className="text">Service item will be quoted at dealership</span>
                </Info>}

            </DialogContent>
        </Dialog>
    );
};

export default DetailedFees;