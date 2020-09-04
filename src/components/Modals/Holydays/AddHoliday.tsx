import React, {useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, FormControlLabel, Grid, Switch} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {useException, useMessage, useSCs} from "../../../utils/hooks";

const useStyles = makeStyles(theme => ({
    label: {
        "& .MuiFormControlLabel-label": {
            fontWeight: "bold",
            textTransform: "uppercase"
        }
    },
    spacer: {
        padding: 12
    },
    preview: {
        border: `1px solid ${theme.palette.text.primary}`,
        textAlign: "center",
        padding: 10,
        fontSize: 16,
        fontWeight: "bold"
    }
}));

const HForm: React.FC<{}> = props => {
    const classes = useStyles();
    return <div>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    label="Start Date"
                    fullWidth
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="End Date"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    className={classes.label}
                    control={<Switch defaultChecked color="primary" />} label="All day" />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    className={classes.label}
                    control={<Switch defaultChecked color="primary" />} label="Recurring" />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Description title"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} className={classes.spacer} />
            <Grid item xs={12}>
                <div className={classes.preview}>From Dec 8, 2020 8:00 am to Dec 8, 2020 6:00 pm</div>
            </Grid>
        </Grid>
    </div>
}
type TForm = {

};
const initialForm: TForm = {

}
export const AddHoliday: React.FC<DialogProps> = ({onAction, ...props}) => {
    const [form, setForm] = useState<TForm>(initialForm);
    const {selectedSC} = useSCs();
    const showError = useException();
    const showMessage = useMessage();
    const handleSave = () => {
        if (!selectedSC) {
            showError("Service center is not selected");
        } else {
            if (onAction) {
                onAction();
            }
        }
    }
    return <BaseModal {...props} width={600}>
        <DialogTitle onClose={props.onClose}>Add New Holiday</DialogTitle>
        <DialogContent>
            <HForm />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
    </BaseModal>
}