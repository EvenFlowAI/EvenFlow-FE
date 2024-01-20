import React, {useEffect, useState} from 'react';
import {Done, Edit} from "@mui/icons-material";
import {IconButton, Input} from "@mui/material";
import {useStyles} from "./styles";
import {useException} from "../../../../../../hooks/useException/useException";

type TTitleEditableProps = {
    text?: string;
    onSave: (name: string) => void;
}

const PriceTitleEditable: React.FC<React.PropsWithChildren<TTitleEditableProps>> = ({text, onSave}) => {
    const [isEdit, setEdit] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const classes = useStyles();
    const showError = useException();

    useEffect(() => {
        if (text?.length) setNewName(text);
    }, [text])

    const onSaveClick = () => {
        if (newName.length) {
            onSave(newName)
            setEdit(false);
        } else {
            showError('The "Price Text" must not be empty')
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value)
    }


    return (
        <div className={classes.wrapper}>
            {isEdit
                ? <Input onChange={onChange} className={classes.textInput} value={newName} placeholder="Enter Price Text"/>
                : <div className={classes.text}>{newName?.length ? newName : "Enter Price Text"}</div>}
            {isEdit
                ? <IconButton onClick={onSaveClick} className={classes.editIcon} size="large">
                    <Done htmlColor="#FFFFFF"/>
                </IconButton>
                : <IconButton onClick={() => setEdit(true)} className={classes.editIcon} size="large">
                    <Edit htmlColor="#FFFFFF"/>
                </IconButton>}
        </div>
    );
};

export default PriceTitleEditable;