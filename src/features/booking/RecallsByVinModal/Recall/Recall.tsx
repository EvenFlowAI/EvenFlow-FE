import React from "react";
import { useStyles } from "../styles";
import dayjs from "dayjs";
import { Divider, useMediaQuery, useTheme } from "@mui/material";
import { IRecallByVin, TArgCallback } from "../../../../types/types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import AddDeclineSwitcher from "../AddDeclineSwitcher/AddDeclineSwitcher";

type TProps = {
  item: IRecallByVin;
  recalls: IRecallByVin[];
  onAddService: TArgCallback<IRecallByVin>;
  index: number;
};

const Recall: React.FC<TProps> = ({ item, recalls, onAddService, index }) => {
  const { recallsByVin } = useSelector((state: RootState) => state.recalls);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <React.Fragment key={item.campaignNumber ?? item.oemProgram}>
      <div>
        <div className={classes.recallTitleWrapper}>
          <div>
            <div className={classes.title}>
              {index + 1} {t("Recall")}
            </div>
            <div className={classes.recallComponent}>
              {item.shortDescription}
            </div>
          </div>
          <AddDeclineSwitcher
            item={item}
            onAddService={onAddService}
            recalls={recalls}
          />
        </div>
        <div className={classes.recallDetailsWrapper}>
          {item.recallOpenDate ? (
            <div style={isSm ? { order: -1 } : {}}>
              <div className={classes.label}>{t("Recall Open Date")}</div>
              <div className={classes.data}>
                {dayjs(item.recallOpenDate).format("MMM DD, YYYY")}
              </div>
            </div>
          ) : null}
          <div style={isSm ? { order: 2 } : {}}>
            <div className={classes.label}>
              {item.campaignNumber
                ? t("Campaign Number")
                : t("Manufacturer Program")}
            </div>
            <div className={classes.data}>
              {item.campaignNumber ?? item.oemProgram ?? ""}
            </div>
          </div>
          <div style={isSm ? { order: 1 } : {}}>
            <div className={classes.label}>{t("Recall Component")}</div>
            <div className={classes.data}>{item.recallComponent}</div>
          </div>
          <div style={isSm ? { order: 3 } : {}}>
            <div className={classes.label}>{t("Recall Status")}</div>
            <div className={classes.data} style={{ color: "red" }}>
              {item.recallStatus}
            </div>
          </div>
        </div>
        {item.summary ? (
          <div className={classes.textBox}>
            <div className={classes.label}>{t("Summary")}</div>
            <div>{item.summary}</div>
          </div>
        ) : null}
        {item.safetyRisk ? (
          <div className={classes.textBox}>
            <div className={classes.label}>{t("Safety Risk")}</div>
            <div>{item.safetyRisk}</div>
          </div>
        ) : null}
      </div>
      {recallsByVin.length > 1 && index < recallsByVin.length - 1 ? (
        <Divider style={{ marginBottom: 20 }} />
      ) : null}
    </React.Fragment>
  );
};

export default Recall;
