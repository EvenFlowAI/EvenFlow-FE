import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Box, Button, FormControlLabel, Radio, RadioGroup} from "@mui/material";
import {demandCategories, EDemandCategory, ITimeOfYearSetting} from "../../../../store/reducers/pricingSettings/types";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {useDispatch} from "react-redux";
import {SC_UNDEFINED} from "../../../../utils/constants";
import {setTimeOfYearPricing} from "../../../../store/reducers/pricingSettings/actions";
import {Date, useStyles} from "./styles";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";

import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {TParsableDate} from "../../../../types/types";
import dayjs from "dayjs";

type TProps = DialogProps<TParsableDate> & {data?: ITimeOfYearSetting};

export const DateModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({payload, onAction, data, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [demand, setDemand] = useState<EDemandCategory>(EDemandCategory.Average);
    const [comment, setComment] = useState<string>("");
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (props.open) {
            if (data) {
            setDemand(data.demandCategory);
            setComment(data.comment || "")
            } else {
                setDemand(EDemandCategory.Average);
                setComment("");
            }
        }
    }, [data, props.open]);

    const handleChange = (e: any, d: string) => {
        setDemand(Number(d) as EDemandCategory);
    }
    const handleCommentChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setComment(value);
    }
    const handleSave = async () => {
        if (!selectedSC) {
            showError(SC_UNDEFINED);
        } else {
            try {
                setSaving(true);
                await dispatch(setTimeOfYearPricing({
                    serviceCenterId: selectedSC.id,
                    demandCategory: demand,
                    date: data?.date || dayjs(payload)?.toISOString() || dayjs().toISOString(),
                    id: data?.id,
                    comment
                }));
                setSaving(false);
                showMessage("Saved");
                props.onClose();
            } catch (e) {
                setSaving(false);
                showError(e);
            }
        }
    }

    return <BaseModal {...props} width={300}>
        <DialogTitle onClose={props.onClose}>Set the day value</DialogTitle>
        <DialogContent>
            <Date>{payload ? dayjs(payload).format("MMM D, YYYY ddd") : "-"}</Date>
            <Box my={1} display="flex" justifyContent="center">
                <RadioGroup row name="demand" value={demand} onChange={handleChange}>
                    {demandCategories.map(dc => {
                        return <FormControlLabel
                            labelPlacement="bottom"
                            key={dc.id}
                            value={dc.id}
                            label={dc.label}
                            control={
                                <Radio className={
                                    dc.id === EDemandCategory.Low
                                        ? classes.low
                                        : dc.id === EDemandCategory.Average
                                            ? classes.average
                                            : classes.high
                                } />
                            }
                        />
                    })}
                </RadioGroup>
            </Box>
            <TextField
                label="Comment"
                value={comment}
                fullWidth
                onChange={handleCommentChange}
                multiline
                inputProps={{style: {padding: 8}}}
                id="comment"
                name="comment"
                placeholder="Type here"
                rows={3}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Close
            </Button>
            <LoadingButton
                loading={saving}
                onClick={handleSave}
                variant="contained"
                color="primary"
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};