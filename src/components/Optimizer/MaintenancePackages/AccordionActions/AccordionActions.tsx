import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";

type TAccordionProps = {
    isEdit: boolean;
    onCancel: () => void;
    onSave: () => void;
    onAddOpsCode: () => void;
}


const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 16,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    addButton: {
        marginRight: 20,
        background: 'transparent',
        color: '#7898FF',
        border: '1px solid #7898FF',
        outline: 'none',
        '&.Mui-disabled': {
            border: '1px solid #9FA2B4',
        }
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    }
}))

const AccordionActions: React.FC<TAccordionProps> = ({ isEdit, onAddOpsCode, onCancel, onSave }) => {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <div className={classes.buttonsWrapper}>
                <Button
                    onClick={onCancel}
                    className={classes.cancelButton}
                    disabled={!isEdit}>
                    Cancel
                </Button>
                <Button
                    onClick={onAddOpsCode}
                    className={classes.addButton}
                    disabled={!isEdit}>
                    Assign ops code to option
                </Button>
                <Button
                    onClick={onSave}
                    disabled={!isEdit}
                    className={classes.saveButton}>
                    save changes
                </Button>
            </div>
        </div>
    );
};

export default AccordionActions;