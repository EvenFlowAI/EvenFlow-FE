import React, {useEffect, useState} from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid, Switch} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";
import {useSCs} from "../../../utils/hooks";
import {Api} from "../../../config/requests";
import {IHOOData} from "../../../store/reducers/serviceCenters/types";


const useStyles = makeStyles({
    row: {
        marginBottom: 16
    },
    toWrapper: {
        padding: "12px 0",
        textAlign: "center",
        display: "block"
    },
    switchRow: {
        textAlign: "right"
    }
})

const HOOForm: React.FC<{
    form: THOOForm[];
    onChange: () => void;
    onCheck: (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}> = props => {
    const classes = useStyles();
    return <>{moment.weekdays().map((day, idx) => {
        const data: THOOForm = props.form.filter(f => f.dayOfWeek === idx)[0] || {...blankRow, dayOfWeek: idx};
        return <Grid container spacing={1} alignItems="flex-end" key={day} className={classes.row}>
            <Grid item xs={2} className={classes.switchRow}><Switch onChange={props.onCheck(idx)} checked={data.checked} color="primary"/></Grid>
            <Grid item xs={3}>
                <TextField
                    disabled={!data.checked}
                    fullWidth
                    label={day}
                    id={`from-${day}`}
                />
            </Grid>
            <Grid item xs={1}>
                <span className={classes.toWrapper}>to</span>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    fullWidth
                    disabled={!data.checked}
                    id={`to-${day}`}
                />
            </Grid>
            <Grid item xs={3}>
                {!idx ? <Button>
                    Apply to all
                </Button> : null}
            </Grid>
        </Grid>;
    })}
    </>
}
type THOOForm = {
    dayOfWeek: number;
    from: string;
    to: string;
    checked: boolean
};
const blankRow: THOOForm = {
    dayOfWeek: 0, from: "", to: "", checked: false
}
const initialForm: THOOForm[] = moment.weekdays().map((w, idx) => {
    return {...blankRow, dayOfWeek: idx};
});

export const HourOfOperations: React.FC<DialogProps> = props => {
    const {selectedSC} = useSCs();
    const [form, setForm] = useState<THOOForm[]>(initialForm);
    useEffect(() => {
        if (selectedSC) {
            Api.call<IHOOData[]>(Api.endpoints.ServiceCenters.GetHOO, {urlParams: {id: selectedSC.id}}).then(r => {
                console.log(r.data);
                // TODO: Set initial form
            });
        }
    }, [selectedSC, setForm]);

    const handleChange = () => {

    }
    const handleCheck = (day: number) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const idx = form.findIndex(v => v.dayOfWeek === day);
        form[idx].checked = checked;
        setForm([...form]);
    }

    return <BaseModal {...props} maxWidth="sm">
        <DialogTitle onClose={props.onClose}>Edit Hours of Operations</DialogTitle>
        <DialogContent>
            <HOOForm onCheck={handleCheck} form={form} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={props.onClose}>Save</Button>
        </DialogActions>
    </BaseModal>
}