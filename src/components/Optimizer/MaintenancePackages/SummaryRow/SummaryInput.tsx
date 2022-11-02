import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Edit} from "@material-ui/icons";
import {TSummaryCell} from "../PackageAccordion/PackageAccordion";
import {makeStyles} from "@material-ui/core/styles";

type TSummaryProps = {
    item: TSummaryCell;
    onChange: (value: string, item: TSummaryCell)=> void;
    isComplimentary?: boolean;
    isEdit?: boolean;
    packageHasComplimentary?: boolean;
    setIsEdit?: Dispatch<SetStateAction<boolean>>;
}

const cellStyles = {
    width: 56,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 26px',
    border: '1px solid #E0E2E8',
}

const useStyles = makeStyles(() => ({
    cell: {
        ...cellStyles,
        '& input': {
            color: '#9FA2B4',
        }
    },
    editableCell: {
        ...cellStyles,
        position: "relative",
    },
    editIcon: {
        position: 'absolute',
        top: '10%',
        right: '-42%',
    },
    input: {
        width: 56,
        textAlign: 'center',
        background: 'transparent',
        border: 'none',
        outline: 'none',
    },
    errorCell: {
        ...cellStyles,
        position: "relative",
        border: '1px solid red',
        color: 'red',
    },
    value: {
        width: 56,
        textAlign: 'center',
        color: '#9FA2B4',
    }
}))

const SummaryInput: React.FC<TSummaryProps> = ({ isComplimentary, packageHasComplimentary, item,isEdit, setIsEdit, onChange}) => {
    const classes = useStyles();
    const [value, setValue] = useState<string>('')

    useEffect(() => {
        setValue(item.numberValue)
    }, [item])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>): void => {
        setValue(e.target?.value)
    }

    const onBlur = (item: TSummaryCell): void => {
        onChange(value, item)
    }

    const getValue = (item: TSummaryCell) => {
        if (item.fieldName.toLowerCase().includes('price')) {
            let value = Number.isInteger(+item.numberValue) ? item.numberValue : Number(item.numberValue).toFixed(2)
            return `$${value}`
        }
        if (item.fieldName.toLowerCase().includes('hours')) {
            let value = Number.isInteger(+item.numberValue) ? item.numberValue : Number(item.numberValue).toFixed(1)
            return `${value}h`
        }
        return item.numberValue.toString();
    }
    const getClassName = (item: TSummaryCell) => {
        if (isComplimentary && !packageHasComplimentary) {
            return classes.cell;
        }
        if (item.isEditable) {
            if (item.fieldName.toLowerCase().includes('hours') && +item.numberValue > 100) {
                return classes.errorCell;
            }
            if (+item.numberValue <= 0) {
                return classes.errorCell;
            }
            return classes.editableCell
        }
        return classes.cell;
    }
    return (
        <div
            className={getClassName(item)}>
            {
                item.isEditable && isEdit ? <input
                    type="number"
                    className={classes.input}
                    value={value}
                    disabled={!isEdit}
                    onBlur={() => onBlur(item)}
                    onChange={onInputChange}
                /> : <div
                    className={classes.value}
                    onClick={() => item.isEditable && setIsEdit && setIsEdit(true)}>
                    {getValue(item)}
                </div>
            }
            {item.isEditable && <Edit
              htmlColor="rgba(0, 0, 0, 0.54)"
              fontSize="small"
              className={classes.editIcon}/>}
        </div>
    );
};

export default SummaryInput;