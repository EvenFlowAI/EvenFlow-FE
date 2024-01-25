import React, {useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {Button, Grid} from "@mui/material";
import {Month} from "../Month/Month";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {ITimeOfYearSetting} from "../../../../store/reducers/pricingSettings/types";
import {DateModal} from "../DateModal/DateModal";
import {loadTimeOfYearPricing} from "../../../../store/reducers/pricingSettings/actions";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import dayjs from "dayjs";
import {TParsableDate} from "../../../../types/types";

export const TimeOfYearModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = ({onAction, payload, ...props}) => {
    const [editedDate, setEditedDate] = useState<TParsableDate>(undefined);
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
            months[dayjs(data.date).month()].push(data);
        }
        return months;
    }, [timeOfYearData]);

    const handleClick = (date: TParsableDate, data?: ITimeOfYearSetting) => {
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
                {dayjs.months().map((m, idx) => {
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
        <DateModal open={isOpen} payload={editedDate} data={toy} onClose={onClose} />
    </BaseModal>
};