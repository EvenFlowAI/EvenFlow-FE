import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Divider, styled} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setAppointmentNotes} from "../../../store/reducers/appointmentFrameReducer/actions";

const useStyles = makeStyles({
    title: {
        fontSize: 14,
        fontWeight: 700,
        color: "#202021",
        marginBottom: 4,
        textTransform: 'uppercase'
    },
    inputWrapper: {
        width: "100%",
        height: 115,
        border: '1px solid #DADADA',
        borderRadius: 2,
       // padding: '10px 12px',
        '& div': {
            border: 'none'
        }
    },
    inputFocused: {
        width: "100%",
        height: 115,
        border: '1px solid #2684FF',
        borderRadius: 2,
       // padding: '10px 12px',
        '& div': {
            border: 'none'
        }
    },
    input: {
        maxHeight: 77,
        overflowY: 'auto'
    },
    bottomWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        //padding: '12px 0',
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px'
    },
    button: {
        textTransform: "uppercase",
    },
    counter: {
        fontWeight: 600,
        fontSize: 10,
        textTransform:"uppercase",
        paddingLeft: 12,
    }
})

const Textarea = styled(TextField)({
    "& textarea": {
        padding: "8px 11px"
    },
});

const maxNoteLength = 250;

const AppointmentNotes = () => {
    const {appointmentNotes, appointmentByKey} = useSelector((state: RootState) => state.appointmentFrame)
    const [isFocused, setFocused] = useState<boolean>(false);
    const classes = useStyles();
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const onNoteChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({target: {value}}) => {
        if (value.length <= maxNoteLength) dispatch(setAppointmentNotes(value))
    }

    const onCancel = () => dispatch(setAppointmentNotes(appointmentByKey?.appointmentNotes ?? ''))
    const onSave = () => {}

    return (
        <div onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
            <div className={classes.title}>{t("Appointment Notes")}</div>
            <div className={isFocused ? classes.inputFocused : classes.inputWrapper}>
                <Textarea
                    fullWidth
                    multiline
                    style={{ marginBottom: 10 }}
                    placeholder={t("Enter Notes")}
                    onChange={onNoteChange}
                    value={appointmentNotes}
                    rows={2}
                />
                {isFocused
                    ? <React.Fragment>
                        <Divider style={{margin: 0}}/>
                        <div className={classes.bottomWrapper}>
                            <div className={classes.counter}>
                                {appointmentNotes.length}/{maxNoteLength} {t("characters")}
                            </div>
                            <div className={classes.buttonsWrapper}>
                                <Button className={classes.button} variant="text" onClick={onCancel} style={{fontWeight: 400}}>Cancel</Button>
                                <Button className={classes.button} variant="text" onClick={onSave} style={{color: "#142EA1"}}>Save</Button>
                            </div>
                        </div>
                </React.Fragment>
                    : null}
            </div>
        </div>
    );
};

export default AppointmentNotes;