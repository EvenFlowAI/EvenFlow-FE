import React, {useEffect, useState} from 'react';
import {Done, Edit} from "@material-ui/icons";
import {IconButton, Input} from "@material-ui/core";
import {useException} from "../../../../../../utils/hooks";
import {useStyles} from "./styles";

type TTitleEditableProps = {
    text?: string;
    onSave: (name: string) => void;
}

const PriceTitleEditable: React.FC<TTitleEditableProps> = ({text, onSave}) => {
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
                ? <IconButton onClick={onSaveClick} className={classes.editIcon}>
                    <Done htmlColor="#FFFFFF"/>
                </IconButton>
                : <IconButton onClick={() => setEdit(true)} className={classes.editIcon}>
                    <Edit htmlColor="#FFFFFF"/>
                </IconButton>}
        </div>
    );
};

export default PriceTitleEditable;