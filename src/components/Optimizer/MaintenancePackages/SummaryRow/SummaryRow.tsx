import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Edit} from "@material-ui/icons";
import {TSummaryCell} from "../PackageAccordion/PackageAccordion";

type TSummaryProps = {
    summaryText: string;
    valuesArray?: TSummaryCell[];
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
    isEdit?: boolean;
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
    }
}));

const SummaryRow: React.FC<TSummaryProps> = ({ summaryText, valuesArray, onInputChange, isEdit }) => {
    const classes = useStyles();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, item: TSummaryCell): void => {
        if (item.fieldName &&  onInputChange) onInputChange(e, item.fieldName);
    }

    const getValue = (item: TSummaryCell) => {
        if (isEdit) return item.numberValue;
        if (item.fieldName.toLowerCase().includes('price')) {
            return `$${item.numberValue}`
        }
        if (item.fieldName.toLowerCase().includes('hours')) {
            return `${item.numberValue}h`
        }
         return item.numberValue;
    }

    return (
        <div className={classes.rowWrapper}>
            <div className={classes.summaryText}>{summaryText}</div>
            <div className={classes.cellsWrapper}>
                {valuesArray && valuesArray.map((item, index) => <div
                    key={index}
                    className={item.isEditable ? classes.editableCell : classes.cell}>
                    <input
                        type="text"
                        className={classes.input}
                        value={getValue(item)}
                        disabled={!isEdit}
                        onChange={e => onChange(e, item)}
                    />
                    {item.isEditable && isEdit && <Edit
                        htmlColor="rgba(0, 0, 0, 0.54)"
                        fontSize="small"
                        className={classes.editIcon}/>}
                </div>)}
            </div>
        </div>
    );
};

export default SummaryRow;