import React, {useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../Modals/BaseModal";
import {DialogProps} from "../../../Modals/types";
import {Button, Grid} from "@material-ui/core";
import moment from "moment";
import {Month} from "../../../UI/Month";
import {useModal, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {ITimeOfYearSetting} from "../../../../store/reducers/pricingSettings/types";
import {DateDialog} from "./DateDialog";
import {loadTimeOfYearPricing} from "../../../../store/reducers/pricingSettings/actions";


export const TimeOfYearDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const [editedDate, setEditedDate] = useState<moment.Moment|undefined>(undefined);
    const [toy, setToy] = useState<ITimeOfYearSetting|undefined>(undefined);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const {onOpen, isOpen, onClose} = useModal();

    useEffect(() => {
        if (props.open && selectedSC) {
            dispatch(loadTimeOfYearPricing(selectedSC.id));
        }
    }, [selectedSC, props.open, dispatch]);

    const timeOfYearData = useSelector((state: RootState) => state.pricingSettings.tYearPricing);

    const monthData = useMemo(() => {
        const months: ITimeOfYearSetting[][] = [[], [], [], [], [], [], [], [], [], [], [], []];
        for (let data of timeOfYearData) {
            months[moment(data.date).month()].push(data);
        }
        return months;
    }, [timeOfYearData]);

    const handleClick = (date: moment.Moment, data?: ITimeOfYearSetting) => {
        setEditedDate(date);
        setToy(data);
        onOpen();
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>
            Calendar Settings <br/>
            <small style={{fontWeight: "normal"}}>Select a day and choose its value</small>
        </DialogTitle>
        <DialogContent>
            <Grid container spacing={3} style={{padding: "0 24px"}}>
                {moment.months().map((m, idx) => {
                    return <Grid item md={3} xs={12} key={m}>
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
        <DateDialog open={isOpen} payload={editedDate} data={toy} onClose={onClose} />
    </BaseModal>
};