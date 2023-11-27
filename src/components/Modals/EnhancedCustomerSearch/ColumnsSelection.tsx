import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {customerDataColumns} from "./CustomerSearchResults";
import {makeStyles} from "@material-ui/core/styles";
import {ReactComponent as CheckboxChecked} from "../../../assets/img/checkbox_checcked.svg";
import {ReactComponent as CheckboxUnchecked} from "../../../assets/img/checkbox_empty.svg";
import {ReactComponent as CheckboxDisabled} from "../../../assets/img/checkbox_checked_disabled.svg";
import {Button, FormControlLabel} from "@material-ui/core";
import {TSearchColumnName} from "./types";
import {useTranslation} from "react-i18next";

type TProps = {
    selectedColumns: TSearchColumnName[];
    setSelectedColumns: Dispatch<SetStateAction<TSearchColumnName[]>>;
}

const useStyles = makeStyles({
    wrapper: {
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        padding: '0px 8px',
    },
    label: {
        maxWidth: '50%',
        marginBottom: 12
    },
    checkbox: {
        marginRight: 12
    },
})

const requiredColumnsNames: TSearchColumnName[] = ["Last Name", "First Name", "Cell", "Email", "Year", "Make", "Model"]

const ColumnsSelection: React.FC<DialogProps&TProps> = ({onClose, open, selectedColumns, setSelectedColumns}) => {
    const [checkedColumns, setCheckedColumns] = useState<TSearchColumnName[]>([]);
    const classes = useStyles();
    const {t} = useTranslation();

    useEffect(() => {
        setCheckedColumns(selectedColumns)
    }, [])

    const onCheck = (name: TSearchColumnName) => () => {
        if (!requiredColumnsNames.includes(name)) {
            setCheckedColumns(prev => {
                return prev.find(el => el === name) ? prev.filter(el => el !== name) : [...prev, name]
            })
        }
    }

    const onCheckAll = () => {
        const selectedAll = customerDataColumns.length === checkedColumns.length;
        if (selectedAll) {
            setCheckedColumns(customerDataColumns
                .filter(el => requiredColumnsNames.find(name => name === el.name))
                .map(el => el.name))
        } else {
            setCheckedColumns(customerDataColumns.map(el => el.name))
        }
    }

    const onSave = () => {
        setSelectedColumns(checkedColumns)
        localStorage.setItem('columns', JSON.stringify(checkedColumns))
        onClose()
    }

    const onCancel = () => {
        setCheckedColumns(selectedColumns)
        onClose()
    }

    return (
        <BaseModal onClose={onCancel} open={open} width={550}>
            <DialogTitle style={{textAlign: 'left'}} onClose={onCancel}>Select columns to display:</DialogTitle>
            <DialogContent>
                <div className={classes.wrapper}>
                    <FormControlLabel
                        label="All"
                        key="All"
                        onClick={onCheckAll}
                        className={classes.label}
                        control={checkedColumns.length === customerDataColumns.length ?
                            <CheckboxChecked className={classes.checkbox}/>
                            : <CheckboxUnchecked className={classes.checkbox}/>}
                        />
                {customerDataColumns.map(column => {
                    const isRequired = requiredColumnsNames.includes(column.name)
                    const checked = !!checkedColumns.find(el => el === column.name)
                    return <FormControlLabel
                        key={column.name}
                        className={classes.label}
                        label={column.name}
                        onClick={onCheck(column.name)}
                        control={isRequired
                            ? <CheckboxDisabled className={classes.checkbox}/>
                            : checked
                                ? <CheckboxChecked className={classes.checkbox}/>
                                : <CheckboxUnchecked className={classes.checkbox}/>}
                    />
                })}
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onCancel}
                    color="primary"
                    variant="outlined">
                    {t("Cancel")}
                </Button>
                <Button
                    onClick={onSave}
                    variant="contained"
                    color="primary">
                    {t("Save")}
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default ColumnsSelection;