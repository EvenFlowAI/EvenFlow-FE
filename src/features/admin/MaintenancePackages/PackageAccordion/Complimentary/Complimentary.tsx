import React, {Dispatch, SetStateAction} from 'react';
import {Input} from "@mui/material";
import {ComplimentaryAndOptions} from "../ComplimentaryAndOptions/ComplimentaryAndOptions";
import {ESegmentTitle, IPackageById} from "../../../../../api/types";
import {Edit} from "@mui/icons-material";
import {TRequestRow, TCellData} from "../../types";
import {usePackageAccordionStyles} from "../../styles";
import {defaultComplimentaryTitle} from "../../constants";
import {useException} from "../../../../../hooks/useException/useException";

type TComplimentaryProps = {
    isComplimentaryNameEdit: boolean;
    packageData: IPackageById|null;
    setComplimentaryNameEdit: Dispatch<SetStateAction<boolean>>;
    setPackageData: Dispatch<SetStateAction<IPackageById|null>>;
    complimentaryData: TRequestRow[];
    onComplimentaryClick: (item: TCellData, requestId: number) => void;
}

const Complimentary: React.FC<React.PropsWithChildren<TComplimentaryProps>> = ({
                                                          isComplimentaryNameEdit,
                                                          packageData,
                                                          setComplimentaryNameEdit,
                                                          complimentaryData,
                                                          onComplimentaryClick,
                                                          setPackageData,
                                                      }) => {
    const classes = usePackageAccordionStyles();
    const showError = useException();
    const complimentaryTitle = packageData?.segmentTitles?.find(el => el.type === ESegmentTitle.Complimentary)

    const onComplimentaryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value && !e.target.value.match(/^[A-Za-z0-9 \s\-_]*[A-Za-z0-9][A-Za-z0-9 \s\-_]*$/)) {
            showError('Please use only letters, digits, and whitespaces')
        } else {
            setPackageData(prev => {
                if (prev) {
                    const updated = {type: ESegmentTitle.Complimentary, title: e.target?.value}
                    const filtered = prev.segmentTitles.filter(el => el.type !== ESegmentTitle.Complimentary);
                    return {...prev, segmentTitles: [...filtered, updated]}
                } else return prev
            })
        }
    }

    const onComplimentaryKeyUp = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13) setComplimentaryNameEdit(false)
    }

    const onClick = () => setComplimentaryNameEdit(true)

    return (
        <React.Fragment>
            {isComplimentaryNameEdit
                ? <Input
                    value={complimentaryTitle?.title ?? defaultComplimentaryTitle}
                    onBlur={() => setComplimentaryNameEdit(false)}
                    onChange={onComplimentaryNameChange}
                    onKeyUp={onComplimentaryKeyUp}
                    className={classes.greyInput}/>
                :  <div className={classes.complimentaryRow} onClick={onClick}>
                        <div>{complimentaryTitle?.title?.length ? complimentaryTitle?.title : defaultComplimentaryTitle}</div>
                        <Edit htmlColor="#FFFFFF" style={{cursor: "pointer", width: 20, height: 20}}/>
                </div>
            }
            <div className={classes.tablesWrapper}>
                {packageData && <ComplimentaryAndOptions
                    packageData={packageData}
                    data={complimentaryData}
                    onCheckboxClick={onComplimentaryClick}/>}
            </div>
        </React.Fragment>
    );
};

export default Complimentary;