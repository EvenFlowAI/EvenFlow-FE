import React from "react";
import { useTranslation } from "react-i18next";
import {
  ESegmentTitle,
  IPackage,
  TUpsellOfOption,
} from "../../../../../../api/types";
import { usePackageMobileStyles } from "../../../../../../hooks/styling/usePackageMobileStyles";
import { HtmlTooltip } from "../../../../../../components/styled/HtmlTooltip";

type TProps = {
  intervalUpsells: TUpsellOfOption[];
  isBmWService: boolean;
  loadedPackages: IPackage[];
};

const PackagesMobileIntervalUpsells: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ intervalUpsells, isBmWService, loadedPackages }) => {
  const { classes } = usePackageMobileStyles();
  const { t } = useTranslation();
  const title = loadedPackages[0]?.segmentTitles?.find(
    (el) => el.type === ESegmentTitle.IntervalUpsell,
  )?.title;

  return intervalUpsells?.length ? (
    <React.Fragment>
      <div
        className={classes.upsellTitle}
        style={isBmWService ? { fontSize: 16 } : {}}
      >
        {title?.trim().length ? title : t("Service Interval Upsell")}
      </div>
      <div className={classes.intervalUpsells}>
        {intervalUpsells
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((item) => {
            return item.detailedDescription?.length ? (
              <HtmlTooltip
                key={item.id}
                placement="top"
                enterTouchDelay={0}
                title={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.detailedDescription,
                    }}
                  />
                }
              >
                <p
                  className={classes.serviceRequestUnderlined}
                  style={isBmWService ? { fontSize: 18 } : {}}
                >
                  {item.name}
                </p>
              </HtmlTooltip>
            ) : (
              <p
                className={classes.serviceRequest}
                key={item.id}
                style={isBmWService ? { fontSize: 18 } : {}}
              >
                {item.name}
              </p>
            );
          })}
      </div>
    </React.Fragment>
  ) : null;
};

export default PackagesMobileIntervalUpsells;
