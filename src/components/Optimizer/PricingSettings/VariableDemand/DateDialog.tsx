import React, {useEffect, useState} from 'react';
import {DialogProps} from "../../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../Modals/BaseModal";
import {Box, Button, FormControlLabel, Radio, RadioGroup, styled} from "@material-ui/core";
import moment from "moment";
import {demandCategories, EDemandCategory, ITimeOfYearSetting} from "../../../../store/reducers/pricingSettings/types";
import {TextField} from "../../../UI/TextField";
import {useException, useMessage, useSCs} from "../../../../utils/hooks";
import {LoadingButton} from "../../../UI/Button";
import {useDispatch} from "react-redux";
import {SC_UNDEFINED} from "../../../../config/constants";
import {setTimeOfYearPricing} from "../../../../store/reducers/pricingSettings/actions";
import {makeStyles} from "@material-ui/core/styles";

const Date = styled("h4")(({theme}) => ({
    fontSize: 19,
    fontWeight: "normal",
    margin: 0,
    color: theme.palette.text.disabled
}));


const useStyles = makeStyles(theme => ({
    low: {
        color: "#00ADB8",
        "&.Mui-checked": {
            color: "#00ADB8"
        }
    },
    average: {
        color: theme.palette.primary.main,
        "&.Mui-checked": {
            color: theme.palette.primary.main
        }
    },
    high: {
        color: theme.palette.secondary.main,
        ".Mui-checked": {
            color: theme.palette.secondary.main
        }
    }
}));

type TProps = DialogProps<moment.Moment> & {data?: ITimeOfYearSetting};
export const DateDialog: React.FC<TProps> = ({payload, onAction, data, ...props}) => {
    const [saving, setSaving] = useState<boolean>(false);
    const [demand, setDemand] = useState<EDemandCategory>(EDemandCategory.Average);
    const [comment, setComment] = useState<string>("");
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {
            setDemand(data.demandCategory);
            setComment(data.comment || "")
        }
    }, [data]);

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
                    date: data?.date || payload?.toISOString() || moment().toISOString(),
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

    const classes = useStyles();
    return <BaseModal {...props} width={300}>
        <DialogTitle onClose={props.onClose}>Set the day value</DialogTitle>
        <DialogContent>
            <Date>{payload?.format("MMM D, YYYY ddd") || "-"}</Date>
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