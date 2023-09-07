import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Divider, styled} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setAppointmentNotes} from "../../../store/reducers/appointmentFrameReducer/actions";
import ClickAwayListener from 'react-click-away-listener';
import {useException} from "../../../utils/hooks";

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
    },
})

const Textarea = styled(TextField)({
    "& textarea": {
        padding: "8px 11px"
    },
});

const maxNoteLength = 250;

const AppointmentNotes = () => {
    const {appointmentNotes} = useSelector((state: RootState) => state.appointmentFrame)
    const [isFocused, setFocused] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const classes = useStyles();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        setText(appointmentNotes)
    }, [appointmentNotes])

    const onNoteChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({target: {value}}) => {
        setHasError(false)
        if (value.length <= maxNoteLength) setText(value)
    }

    const onCancel = () => {
        setHasError(false)
        setText(appointmentNotes)
        setFocused(false)
    }
    const onSave = () => {
        if (text.match(/^[a-zA-Z0-9]/)) {
            setHasError(false)
            dispatch(setAppointmentNotes(text.trim()))
            setFocused(false)
        } else {
            setHasError(true)
            showError('Appointment Notes must not contain characters "&", ">" and "<"')
        }
    }

    const handleClickAway = () => {
        if (appointmentNotes === text) {
            setFocused(false)
        } else {
            setHasError(true)
            showError("Please save or cancel Appointment Notes changes")
        }
    };

    const onFocus = () => {
        if (!isFocused) setFocused(true)
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div onFocus={onFocus} onClick={onFocus} onKeyDown={onFocus}>
                <div className={classes.title}>{t("Appointment Notes")}</div>
                <div className={classes.inputWrapper}
                     style={{
                         borderColor: hasError
                             ? 'red'
                             : isFocused
                                 ? "#2684FF"
                                 : '#DADADA' }}>
                    <Textarea
                        fullWidth
                        multiline
                        style={{marginBottom: 10}}
                        error={hasError}
                        placeholder={t("Enter Notes")}
                        onChange={onNoteChange}
                        value={text}
                        rows={2}
                    />
                    {isFocused
                        ? <React.Fragment>
                            <Divider style={{margin: 0}}/>
                            <div className={classes.bottomWrapper}>
                                <div className={classes.counter}>
                                    {text.length}/{maxNoteLength} {t("characters")}
                                </div>
                                <div className={classes.buttonsWrapper}>
                                    <Button
                                        className={classes.button}
                                        variant="text"
                                        onClick={onCancel}
                                        disabled={appointmentNotes === text}
                                        style={{fontWeight: 400}}>
                                        Cancel
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="text"
                                        onClick={onSave}
                                        disabled={appointmentNotes === text}
                                        style={{color: appointmentNotes === text ? 'grey' : "#142EA1"}}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </React.Fragment>
                        : null}
                </div>
            </div>
        </ClickAwayListener>
    );
};

export default AppointmentNotes;