import React, {useEffect, useState} from 'react';
import {Button, Divider} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {setAppointmentNotes} from "../../../../../../store/reducers/appointmentFrameReducer/actions";
import ClickAwayListener from 'react-click-away-listener';
import {Textarea, useStyles} from "./styles";
import {useException} from "../../../../../../hooks/useException/useException";

const maxNoteLength = 250;

const AppointmentNotes = () => {
    const {appointmentNotes} = useSelector((state: RootState) => state.appointmentFrame)
    const [isFocused, setFocused] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [text, setText] = useState<string>('');
    const { classes  } = useStyles();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const showError = useException(true);

    useEffect(() => {
        setText(appointmentNotes)
    }, [appointmentNotes])

    const onNoteChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({target: {value}}) => {
        if (!isFocused) setFocused(true)
        if (value.length <= maxNoteLength) {
            if (value.match(/^[A-Za-z0-9\s,.?!-]+$/) || !value.length) {
                setText(value)
                setHasError(false)
            } else {
                setHasError(true)
                showError('Special characters not allowed')
            }
        } else {
            setHasError(true)
            showError('Only 250 characters allowed')
        }
    }

    const onCancel = () => {
        setHasError(false)
        setText(appointmentNotes)
        setFocused(false)
    }
    const onSave = () => {
        if (text.match(/^[A-Za-z0-9\s,.?!-]+$/) || !text.length) {
            dispatch(setAppointmentNotes(text.trim()))
            setHasError(false)
            setFocused(false)
        }
    }

    const handleClickAway = () => {
        if (appointmentNotes === text) {
            setFocused(false)
            setHasError(false)
        } else {
            if (isFocused) {
                setHasError(true)
                showError("Please save or cancel Appointment Notes changes")
            }
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