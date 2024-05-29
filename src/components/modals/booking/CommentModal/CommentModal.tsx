import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {DialogProps} from "../../BaseModal/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {useTranslation} from "react-i18next";
import {TextFieldWhite} from "../../../styled/EndUserInputs";
import {ActionButtons} from "../../../../features/booking/ActionButtons/ActionButtons";
import {setFrameDescription} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {Button} from "@mui/material";
import {useException} from "../../../../hooks/useException/useException";

const CommentModal: React.FC<DialogProps> = ({open, onClose}) => {
    const {appointmentByKey, description, subService, service} = useSelector((state: RootState) => state.appointmentFrame)
    const [text, setText] = useState<string>("");
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        setText(description)
    }, [description])

    const onCancel = () => {
        setText(description)
        onClose();
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {value}}) => {
        setText(value);
    }

    const onSave = () => {
        const isCommentRequired = subService ? subService?.isCommentRequired : service?.isCommentRequired;
        if (!text.length && isCommentRequired) {
            showError(t("Appointment Comment must not be empty"))
        } else {
            dispatch(setFrameDescription(text))
            onClose();
        }
    }

    return (
        <BaseModal open={open} onClose={onCancel} width={700}>
            <DialogTitle onClose={onCancel} style={{fontSize: 24}}>Appointment Comments</DialogTitle>
            <DialogContent>
                {description?.length
                    ? <TextFieldWhite
                        fullWidth
                        multiline
                        onChange={handleChange}
                        value={text}
                        rows={7}
                        variant="standard"
                        InputProps={{disableUnderline: true}}
                        placeholder={t("Describe what`s going on")}
                    />
                    : appointmentByKey?.comment?.length
                        ? appointmentByKey.comment
                        : <div style={{textAlign: 'center', color: "#828282", fontWeight: 600, marginBottom: 12, marginTop: 10}}>{t("No appointment comments provided")}</div>}
            </DialogContent>
            <DialogActions>
                {description?.length
                    ? <ActionButtons onBack={onCancel} onNext={onSave} nextLabel={t("Save")} prevLabel={t("Cancel")}/>
                    : <Button onClick={onClose} variant="outlined" style={{width: 150}}>{t("Close")}</Button>}
            </DialogActions>
        </BaseModal>
    );
};

export default CommentModal;