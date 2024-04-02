import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../BaseModal/BaseModal";
import {DialogProps} from "../../../BaseModal/types";
import {ReactComponent as CheckboxChecked} from "../../../../../assets/img/checkbox_checcked.svg";
import {ReactComponent as CheckboxUnchecked} from "../../../../../assets/img/checkbox_empty.svg";
import {ReactComponent as CheckboxDisabled} from "../../../../../assets/img/checkbox_checked_disabled.svg";
import {Button, FormControlLabel} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useStyles} from "./styles";
import {CheckBox, CheckBoxOutlineBlankOutlined} from "@mui/icons-material";

type TProps = {
    selectedColumns: string[];
    setSelectedColumns: Dispatch<SetStateAction<string[]>>;
    requiredColumnsNames: string[];
    columns: string[];
    storageItemName: string;
    titleAlign: "center"|"left";
    defaultCheckboxes?: boolean;
}

const ColumnsSelectionModal: React.FC<DialogProps&TProps> = ({
                                                                 onClose,
                                                                 open,
                                                                 selectedColumns,
                                                                 setSelectedColumns,
                                                                 requiredColumnsNames,
                                                                 columns,
                                                                 defaultCheckboxes,
                                                                 titleAlign
                                                             }) => {
    const [checkedColumns, setCheckedColumns] = useState<string[]>([]);
    const { classes  } = useStyles();
    const {t} = useTranslation();

    useEffect(() => {
        setCheckedColumns(selectedColumns)
    }, [])

    const onCheck = (name: string) => () => {
        if (!requiredColumnsNames.includes(name)) {
            setCheckedColumns(prev => {
                return prev.find(el => el === name) ? prev.filter(el => el !== name) : [...prev, name]
            })
        }
    }

    const onCheckAll = () => {
        const selectedAll = columns.length === checkedColumns.length;
        if (selectedAll) {
            setCheckedColumns(columns
                .filter(el => requiredColumnsNames.find(name => name === el)))
        } else {
            setCheckedColumns(columns)
        }
    }

    const onSave = () => {
        setSelectedColumns(checkedColumns)
        localStorage.setItem('storageItemName', JSON.stringify(checkedColumns))
        onClose()
    }

    const onCancel = () => {
        setCheckedColumns(selectedColumns)
        onClose()
    }

    return (
        <BaseModal onClose={onCancel} open={open} width={550}>
            <DialogTitle style={{textAlign: titleAlign}} onClose={onCancel}>Select Columns To Display:</DialogTitle>
            <DialogContent>
                <div className={classes.wrapper}>
                    <FormControlLabel
                        label="All"
                        key="All"
                        onClick={onCheckAll}
                        className={classes.label}
                        control={checkedColumns.length === columns.length
                            ? defaultCheckboxes
                                ? <CheckBox className={classes.checkbox} color="primary" />
                                : <CheckboxChecked className={classes.checkbox}/>
                            : defaultCheckboxes
                                ? <CheckBoxOutlineBlankOutlined className={classes.checkbox} color="primary"/>
                                : <CheckboxUnchecked className={classes.checkbox}/>}
                        />
                {columns.map(column => {
                    const isRequired = requiredColumnsNames.includes(column)
                    const checked = !!checkedColumns.find(el => el === column)
                    return <FormControlLabel
                        key={column}
                        className={classes.label}
                        label={column}
                        onClick={onCheck(column)}
                        style={{cursor: isRequired ? 'default' : "pointer"}}
                        control={defaultCheckboxes
                            ? isRequired
                                ? <CheckBox className={classes.checkbox} color="primary" style={{cursor: 'default'}}/>
                                : checked
                                    ? <CheckBox className={classes.checkbox} color="primary"/>
                                    : <CheckBoxOutlineBlankOutlined className={classes.checkbox} color="primary"/>
                            : isRequired
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

export default ColumnsSelectionModal;