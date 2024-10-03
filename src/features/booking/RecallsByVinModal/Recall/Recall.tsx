import React, {useMemo} from 'react';
import {CustomSwitch, Label, useStyles} from "../styles";
import dayjs from "dayjs";
import {Divider} from "@mui/material";
import {Icon} from "../InfoIcon/InfoIcon";
import {IRecallByVin, TArgCallback} from "../../../../types/types";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";

type TProps = {
    item: IRecallByVin;
    recalls: IRecallByVin[];
    onAddService: TArgCallback<IRecallByVin>;
    index: number;
}

const Recall: React.FC<TProps> = ({item, recalls, onAddService, index}) => {
    const {recallsByVin} = useSelector((state: RootState) => state.recalls);

    const {t} = useTranslation();
    const { classes  } = useStyles();

    const label =  useMemo(() => !item.isRemedyAvailable
        ? <>{t("Remedy Not Available")}
            {item.rolloverMessage?.length ? <Icon item={item}/> : null}
        </>
        : recalls.find(el => el.campaignNumber === item.campaignNumber)
            ? t("Service Added")
            : t("Service Declined"), [item, recalls, t])

    const checked = item.isRemedyAvailable && Boolean(recalls.find(el => {
        return item.campaignNumber ? el.campaignNumber === item.campaignNumber : el.oemProgram === item.oemProgram
    }))

    return (
        <React.Fragment key={item.campaignNumber ?? item.oemProgram}>
            <div>
                <div className={classes.recallTitleWrapper}>
                    <div>
                        <div className={classes.title}>{index + 1} {t("Recall")}</div>
                        <div className={classes.recallComponent}>{item.shortDescription}</div>
                    </div>
                    <div className={classes.serviceAddedBtn}>
                        <Label
                            style={!item.isRemedyAvailable ? {color: '#FF0000'} : {}}
                            checked={checked}
                            onChange={() => item.isRemedyAvailable && onAddService(item)}
                            label={label}
                            labelPlacement="start"
                            control={<CustomSwitch color="primary"/>}
                        />
                    </div>
                </div>
                <div className={classes.recallDetailsWrapper}>
                    {item.recallOpenDate
                        ? <div>
                            <div className={classes.label}>{t("Recall Open Date")}</div>
                            <div className={classes.data}>
                                {dayjs(item.recallOpenDate).format("MMM DD, YYYY")}
                            </div>
                        </div>
                        : null}
                    <div>
                        <div className={classes.label}>{item.campaignNumber ? t("Campaign Number") : t("Manufacturer Program")}</div>
                        <div className={classes.data}>{item.campaignNumber ?? item.oemProgram ?? ''}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t("Recall Component")}</div>
                        <div className={classes.data}>{item.recallComponent}</div>
                    </div>
                    <div>
                        <div className={classes.label}>{t("Recall Status")}</div>
                        <div className={classes.data}
                             style={{color: 'red'}}>{item.recallStatus}</div>
                    </div>
                </div>
                {item.summary
                    ? <div className={classes.textBox}>
                        <div className={classes.label}>{t("Summary")}</div>
                        <div>{item.summary}</div>
                    </div>
                    : null}
                {item.safetyRisk
                    ? <div className={classes.textBox}>
                        <div className={classes.label}>{t("Safety Risk")}</div>
                        <div>{item.safetyRisk}</div>
                    </div>
                    : null}
            </div>
            {recallsByVin.length > 1 && index < recallsByVin.length - 1 ?
                <Divider style={{marginBottom: 20}}/> : null}
        </React.Fragment>)
};

export default Recall;