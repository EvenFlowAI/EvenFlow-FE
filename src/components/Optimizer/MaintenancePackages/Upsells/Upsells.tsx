import React, {Dispatch, SetStateAction} from 'react';
import {Input} from "@material-ui/core";
import {IntervalUpsellAndOptions} from "../IntervalUpsellAndOptions/IntervalUpsellAndOptions";
import {
    defaultUpsellTitle,
    TCellData,
    TRequestRow,
    usePackageAccordionStyles
} from "../PackageAccordion/PackageAccordion";
import {ESegmentTitle, IPackageById} from "../../../../api/types";
import {useException} from "../../../../utils/hooks";

type TUpsellTitleProps = {
    isUpsellNameEdit: boolean;
    packageData: IPackageById|null;
    setUpsellNameEdit: Dispatch<SetStateAction<boolean>>;
    upsellData: TRequestRow[];
    onUpsellClick: (item: TCellData, requestId: number) => void;
    setPackageData: Dispatch<SetStateAction<IPackageById|null>>;
}

const Upsells: React.FC<TUpsellTitleProps> = ({
                                                  isUpsellNameEdit,
                                                  packageData,
                                                  setUpsellNameEdit,
                                                  upsellData,
                                                  onUpsellClick,
                                                  setPackageData,
                                              }) => {
    const classes = usePackageAccordionStyles();
    const showError = useException();
    const upsellTitle = packageData?.segmentTitles?.find(el => el.type === ESegmentTitle.IntervalUpsell)

    const onIntervalUpsellNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value && !e.target.value.match(/^[A-Za-z0-9 \s\-_]*[A-Za-z0-9][A-Za-z0-9 \s\-_]*$/)) {
            showError('Please use only letters, digits, and whitespaces')
        } else {
            setPackageData(prev => {
                if (prev) {
                    const updated = {type: ESegmentTitle.IntervalUpsell, title: e.target.value}
                    const filtered = prev.segmentTitles.filter(el => el.type !== ESegmentTitle.IntervalUpsell);
                    return {...prev, segmentTitles: [...filtered, updated]}
                } else return prev
            })
        }
    }

    const onUpsellKeyUp = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13) setUpsellNameEdit(false)
    }

    const onClick = () => setUpsellNameEdit(true)


    return <React.Fragment>
        {isUpsellNameEdit
        ? <Input
                onKeyUp={onUpsellKeyUp}
                value={upsellTitle?.title ?? defaultUpsellTitle}
                onBlur={() => setUpsellNameEdit(false)}
                onChange={onIntervalUpsellNameChange}
                className={classes.greyInput}/>
        : <div className={classes.complimentaryRow} onClick={onClick}>
                {upsellTitle?.title ?? defaultUpsellTitle}
            </div>
}
        <div className={classes.tablesWrapper}>
            {packageData && <IntervalUpsellAndOptions
                packageData={packageData}
                data={upsellData}
                onCheckboxClick={onUpsellClick}/>}
        </div>
    </React.Fragment>
};

export default Upsells;