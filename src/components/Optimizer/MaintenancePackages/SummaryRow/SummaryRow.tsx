import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {TSummaryCell} from "../PackageAccordion/PackageAccordion";
import SummaryInput from "./SummaryInput";

type TSummaryProps = {
    summaryText: string;
    valuesArray?: TSummaryCell[];
    onInputChange?: (value: string, fieldName: string, optionType: string | number) => void;
    isEdit?: boolean;
    setIsEdit?: Dispatch<SetStateAction<boolean>>
    isComplimentary?: boolean;
    packageHasComplimentary?: boolean;
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
}));

const SummaryRow: React.FC<TSummaryProps> = ({ isComplimentary, packageHasComplimentary, summaryText, valuesArray, onInputChange, isEdit, setIsEdit
}) => {
    const [values, setValues] = useState<TSummaryCell[]|undefined>([]);
    const classes = useStyles();

    useEffect(() => {
        if (valuesArray) {
            setValues(valuesArray.sort((a, b) => a.optionType - b.optionType))
        } else setValues(valuesArray)
    }, [valuesArray])

    const onChange = (value: string, item: TSummaryCell): void => {
        if (item.fieldName &&  onInputChange) onInputChange(value, item.fieldName, item.optionType);
    }

    return (
        <div className={classes.rowWrapper}>
            <div className={classes.summaryText}>{summaryText}</div>
            <div className={classes.cellsWrapper}>
                {values && values
                    .map((item, index) => <SummaryInput
                        key={index}
                        item={item}
                        isComplimentary={isComplimentary}
                        packageHasComplimentary={packageHasComplimentary}
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                        onChange={onChange}
                    />)}
            </div>
        </div>
    );
};

export default SummaryRow;