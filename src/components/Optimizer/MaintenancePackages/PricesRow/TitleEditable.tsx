import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Done, Edit} from "@material-ui/icons";
import {IconButton, Input} from "@material-ui/core";
import {useException} from "../../../../utils/hooks";

type TTitleEditableProps = {
    text: string;
    onSave: (name: string) => void;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'space-between',
        background: "#252525",
        color: "#FFFFFF",
        fontWeight: 16,
        padding: "21px 16px",
    },
    textInput: {
        background: "black",
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        overflow: 'hidden',
        textOverflow: 'ellipsis',

        '& > input': {
            padding: 8,
            fontSize: 16,
        }
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    editIcon: {
       padding: 0
    },
}));

const TitleEditable: React.FC<TTitleEditableProps> = ({text, onSave}) => {
    const [isEdit, setEdit] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const classes = useStyles();
    const showError = useException();

    useEffect(() => {
        if (text.length) setNewName(text);
    }, [text])

    const onSaveClick = () => {
        onSave(newName);
        // todo logic for showing error
        setEdit(false);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value)
    }


    return (
        <div className={classes.wrapper}>
            {isEdit
                ? <Input onChange={onChange} className={classes.textInput} value={newName}/>
                : <div className={classes.text}>{newName}</div>}
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

export default TitleEditable;