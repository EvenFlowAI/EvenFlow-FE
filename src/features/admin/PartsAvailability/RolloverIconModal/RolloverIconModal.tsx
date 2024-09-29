import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {IRecall} from "../../../../store/reducers/recall/types";
import {Button} from "@mui/material";
import {useStyles} from "../styles";

type TProps = DialogProps & {
    editingItem: IRecall|null;
    setData: Dispatch<SetStateAction<IRecall[]>>;
}

const RolloverIconModal: React.FC<TProps> = ({open, onClose, editingItem, setData}) => {
    const [text, setText] = useState<string>('');
    const {classes} = useStyles();

    useEffect(() => {
        setText(editingItem?.rolloverMessage ?? '');
    }, [editingItem])

    const handleChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        setText(value);
    }

    const onCancel = () => {
        setText(editingItem?.rolloverMessage ?? '');
        onClose()
    }

    const onSave = () => {
        setData(prev => {
            if (editingItem) {
                const item = prev.find(el => el.id === editingItem.id)
                if (item) {
                    const updated = {...item, rolloverMessage: text.trim()};
                    const filtered = prev.filter(el => el.id !== editingItem.id)
                    return [...filtered, updated].sort((a, b) => a.localIndex - b.localIndex)
                }
            }
            return prev
        })
        onCancel()
    }

    return (
        <BaseModal open={open} onClose={onCancel} width={600}>
            <DialogTitle onClose={onCancel}>Rollover Icon</DialogTitle>
            <DialogContent style={{padding: '8px 32px 14px 32px'}}>
                <TextField
                    fullWidth
                    className={classes.input}
                    label="Rollover description text"
                    placeholder="Rollover description text"
                    rows={2}
                    multiline
                    value={text}
                    onChange={handleChange}/>
            </DialogContent>
            <DialogActions>
                <Button color="info" variant="text" onClick={onCancel}>Close</Button>
                <Button color="primary" variant="contained" onClick={onSave}>Save</Button>
            </DialogActions>
        </BaseModal>
    );
};

export default RolloverIconModal;