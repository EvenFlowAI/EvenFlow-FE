import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {TSummaryCell} from "../PackageAccordion/PackageAccordion";
import SummaryInput from "./SummaryInput";
import {FormControlLabel, styled, Switch, Theme, withStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {updateManualOverride, updateShowSuggestedPrice} from "../../../../store/reducers/packages/actions";
import {RootState} from "../../../../store/rootReducer";

type TSummaryProps = {
    summaryText: string;
    valuesArray?: TSummaryCell[];
    onInputChange?: (value: string, fieldName: string, optionType: string | number) => void;
    isEdit?: boolean;
    setIsEdit?: Dispatch<SetStateAction<boolean>>
    isComplimentary?: boolean;
    packageHasComplimentary?: boolean;
    toggleField?: string;
    toggleLabel?: string;
    checked?: boolean;
}

const useStyles = makeStyles({
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
})

const RowWrapper = styled('div')<Theme, {toggle: number}>(({theme, toggle}) => ({
    width: '100%',
    display: 'grid',
    gridTemplateColumns: toggle ? '3fr 2fr 2fr' : '5fr 2fr',
    gridGap: 16,
}));

const Label = withStyles({
    root: {
        justifyContent: "flex-end",
        marginLeft: 0,
        marginRight: 0,
        justifySelf: 'flex-end'
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase",
        color: "#3855F3",
    }
})(FormControlLabel);

const SummaryRow: React.FC<TSummaryProps> = ({
                                                 isComplimentary,
                                                 packageHasComplimentary,
                                                 summaryText,
                                                 valuesArray,
                                                 onInputChange,
                                                 isEdit,
                                                 setIsEdit,
                                                 toggleField,
                                                 toggleLabel,
                                                 checked
}) => {
    const { isPackageLoading, currentPackage } = useSelector((state: RootState) => state.packages);
    const [values, setValues] = useState<TSummaryCell[]|undefined>([]);
    const classes = useStyles(Boolean(toggleField));
    const dispatch = useDispatch();

    // todo logic for checked value

    useEffect(() => {
        if (valuesArray) {
            setValues(valuesArray.sort((a, b) => a.optionType - b.optionType))
        } else setValues(valuesArray)
    }, [valuesArray])

    const onChange = (value: string, item: TSummaryCell): void => {
        if (item.fieldName &&  onInputChange) onInputChange(value, item.fieldName, item.optionType);
    }

    const handleSwitch = (e: any, value: boolean) => {
        if (currentPackage) {
            if (toggleField === 'showSuggestedPrice') {
                dispatch(updateShowSuggestedPrice(currentPackage.id, value))
            } else {
                dispatch(updateManualOverride(currentPackage.id, value))
            }
        }
    }

    return (
        <RowWrapper toggle={Boolean(toggleField) ? 1 : 0}>
            <div className={classes.summaryText}>{summaryText}</div>
            {toggleField ? <Label
                control={<Switch
                    onChange={handleSwitch}
                    disabled={isPackageLoading}
                    checked={checked}
                    color="primary"
                />}
                label={toggleLabel}
                labelPlacement="start"
            /> : null}
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
        </RowWrapper>
    );
};

export default SummaryRow;