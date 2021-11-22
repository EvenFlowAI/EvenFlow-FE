import React, {Dispatch, SetStateAction} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Edit} from "@material-ui/icons";
import {TSummaryCell} from "../PackageAccordion/PackageAccordion";

type TSummaryProps = {
    summaryText: string;
    valuesArray?: TSummaryCell[];
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, optionType: string | number) => void;
    isEdit?: boolean;
    setIsEdit?: Dispatch<SetStateAction<boolean>>
    isComplimentary?: boolean;
    packageHasComplimentary?: boolean;
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
  rowWrapper: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '5fr 2fr',
      gridGap: 16,
  },
  summaryText: {
      display: 'flex',
      alignItems: 'center',
      padding: 16,
      fontWeight: 'bold',
      fontSize: 16,
  },
    cellsWrapper: {
      display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
    },
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
}));

const SummaryRow: React.FC<TSummaryProps> = ({ isComplimentary, packageHasComplimentary, summaryText, valuesArray, onInputChange, isEdit, setIsEdit
}) => {
    const classes = useStyles();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, item: TSummaryCell): void => {
        if (item.fieldName &&  onInputChange) onInputChange(e, item.fieldName, item.optionType);
    }

    const getValue = (item: TSummaryCell) => {
        if (isEdit) return item.numberValue;
        if (item.fieldName.toLowerCase().includes('price')) {
            let value = Number.isInteger(item.numberValue) ? item.numberValue : item.numberValue.toFixed(2)
            return `$${value}`
        }
        if (item.fieldName.toLowerCase().includes('hours')) {
            let value = Number.isInteger(item.numberValue) ? item.numberValue : item.numberValue.toFixed(1)
            return `${value}h`
        }
         return item.numberValue;
    }

    const getClassName = (item: TSummaryCell) => {
        if (isComplimentary && !packageHasComplimentary) {
            return classes.cell;
        }
        if (item.isEditable) {
            if (item.fieldName.toLowerCase().includes('hours') && item.numberValue > 100) {
                return classes.errorCell;
            }
            if (item.numberValue <= 0) {
                return classes.errorCell;
            }
            return classes.editableCell
        }
        return classes.cell;
    }

    return (
        <div className={classes.rowWrapper}>
            <div className={classes.summaryText}>{summaryText}</div>
            <div className={classes.cellsWrapper}>
                {valuesArray && valuesArray
                    .sort((a, b) => a.optionType - b.optionType)
                    .map((item, index) => <div
                    key={index}
                    className={getClassName(item)}>
                        {
                            item.isEditable && isEdit ? <input
                                type="number"
                                min={item.fieldName.toLowerCase().includes('hours') ? "0.1" : "0.01"}
                                step={item.fieldName.toLowerCase().includes('hours') ? "0.1" : "0.01"}
                                max={item.fieldName.toLowerCase().includes('hours') ? '100' : undefined}
                                maxLength={3}
                                className={classes.input}
                                value={getValue(item)}
                                disabled={!isEdit}
                                onChange={e => onChange(e, item)}
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
                </div>)}
            </div>
        </div>
    );
};

export default SummaryRow;