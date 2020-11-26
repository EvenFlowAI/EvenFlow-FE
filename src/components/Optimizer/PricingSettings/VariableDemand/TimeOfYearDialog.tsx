import React, {useMemo} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../Modals/BaseModal";
import {DialogProps} from "../../../Modals/types";
import {Button, Grid} from "@material-ui/core";
import moment from "moment";
import {Month} from "../../../UI/Month";


export const TimeOfYearDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const monthData = useMemo(() => {
        return [[], [], [], [], [], [], [], [], [], [], [], []];
    }, []);

    const handleClick = (date: moment.Moment) => {
        console.log(date);
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>
            Calendar settings <br/>
            <small style={{fontWeight: "normal"}}>Select a day and choose its value</small>
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={3} style={{padding: "0 24px"}}>
                {moment.months().map((m, idx) => {
                    return <Grid item md={3} xs={12} key={idx}>
                        <Month month={idx} data={monthData[idx]} onClick={handleClick} />
                    </Grid>
                })}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button color="primary" variant="contained" onClick={props.onClose}>
                Close
            </Button>
        </DialogActions>
    </BaseModal>
};