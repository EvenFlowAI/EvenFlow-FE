import React, { useMemo } from "react";
import { CustomSwitch, Label, useStyles } from "../styles";
import { useMediaQuery, useTheme } from "@mui/material";
import { IRecallByVin, TArgCallback } from "../../../../types/types";
import { useTranslation } from "react-i18next";
import { Icon } from "../InfoIcon/InfoIcon";

type TProps = {
  item: IRecallByVin;
  recalls: IRecallByVin[];
  onAddService: TArgCallback<IRecallByVin>;
};

const AddDeclineSwitcher: React.FC<TProps> = ({
  item,
  recalls,
  onAddService,
}) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { classes } = useStyles();
  const { t } = useTranslation();

  const checked =
    item.isRemedyAvailable &&
    Boolean(
      recalls.find((el) => {
        return item.campaignNumber
          ? el.campaignNumber === item.campaignNumber
          : el.oemProgram === item.oemProgram;
      }),
    );

  const label = useMemo(
    () =>
      !item.isRemedyAvailable ? (
        <>
          {t("Remedy Not Available")}
          {item.rolloverMessage?.length ? <Icon item={item} /> : null}
        </>
      ) : recalls.find((el) =>
          item.campaignNumber
            ? el.campaignNumber === item.campaignNumber
            : el.oemProgram === item.oemProgram,
        ) ? (
        <>
          {t("Service Added")}
          {item.rolloverMessage?.length ? <Icon item={item} /> : null}
        </>
      ) : (
        <>
          {t("Service Declined")}
          {item.rolloverMessage?.length ? <Icon item={item} /> : null}
        </>
      ),
    [item, recalls, t],
  );

  return isSm ? (
    <div className={classes.serviceAddedMobile}>
      <div
        style={!item.isRemedyAvailable ? { color: "#FF0000" } : {}}
        className={classes.mobileLabel}
      >
        {label}
      </div>
      <div>
        <CustomSwitch
          color="primary"
          checked={checked}
          onChange={() => item.isRemedyAvailable && onAddService(item)}
        />
      </div>
    </div>
  ) : (
    <div className={classes.serviceAddedBtn}>
      <Label
        style={!item.isRemedyAvailable ? { color: "#FF0000" } : {}}
        checked={checked}
        onChange={() => item.isRemedyAvailable && onAddService(item)}
        label={label}
        labelPlacement="start"
        control={<CustomSwitch color="primary" />}
      />
    </div>
  );
};

export default AddDeclineSwitcher;
