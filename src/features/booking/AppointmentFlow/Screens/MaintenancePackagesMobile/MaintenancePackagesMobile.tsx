import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Tab } from "@mui/material";
import { TabContext } from "@mui/lab";
import { useSelector } from "react-redux";
import {
  EMaintenanceOptionType,
  IPackage,
  IPackageOptions,
} from "../../../../../api/types";
import { RootState } from "../../../../../store/rootReducer";
import { useTranslation } from "react-i18next";
import PackagesMobileTotalPrice from "./PackagesMobileTotalPrice/PackagesMobileTotalPrice";
import { EPackagePricingType } from "../../../../../store/reducers/appointmentFrameReducer/types";
import PackagesMobileServiceRequests from "./PackagesMobileServiceRequests/PackagesMobileServiceRequests";
import PackagesMobileTotalMaintenance from "./PackagesMobileTotalMaintenance/PackagesMobileTotalMaintenance";
import PackagesMobileIntervalUpsells from "./PackagesMobileIntervalUpsells/PackagesMobileIntervalUpsells";
import PackagesMobileComplimentary from "./PackagesMobileComplimentary/PackagesMobileComplimentary";
import PackagesMobileTotalComplimentary from "./PackagesMobileTotalComplimentary/PackagesMobileTotalComplimentary";
import { TPackage } from "../MaintenancePackages/types";
import { Info } from "../MaintenancePackages/styles";
import { usePackageMobileStyles } from "../../../../../hooks/styling/usePackageMobileStyles";
import { TabLabel } from "./TabLabel/TabLabel";
import { getTitleStyle } from "./utils";
import { TabPanel, Tabs } from "./styles";

type TPackageSelectionMobileProps = {
  data: TPackage[];
  isBmWService: boolean;
  getTitle: (type: EPackagePricingType) => string;
  withUpsells: boolean;
  selectedPackage: IPackageOptions | null;
  setLocalPackage: Dispatch<SetStateAction<IPackageOptions | null>>;
  setLocalPricingType: Dispatch<SetStateAction<EPackagePricingType | null>>;
  localSelectedPricingType: EPackagePricingType | null;
  loadedPackages: IPackage[];
};

const MaintenancePackagesMobile: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TPackageSelectionMobileProps>>
> = ({
  getTitle,
  data,
  isBmWService,
  withUpsells,
  selectedPackage,
  setLocalPackage,
  setLocalPricingType,
  localSelectedPricingType,
  loadedPackages,
}) => {
  const [value, setValue] = useState<string>("1");
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { classes } = usePackageMobileStyles();
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedPackage) {
      setValue(selectedPackage.type.toString());
    } else {
      const currentPackage = data[+value];
      if (currentPackage) {
        setLocalPackage(currentPackage);
      } else {
        if (data.length) {
          setLocalPackage(data[0]);
          setValue("0");
        }
      }
    }
  }, [selectedPackage, data]);

  const handleChange = (e: ChangeEvent<{}>, newValue: any): void => {
    setValue(newValue);
    const currentPackage = data[newValue];
    currentPackage && setLocalPackage(currentPackage);
    setLocalPricingType(EPackagePricingType.BasePrice);
  };

  const handleClick = (
    type: EMaintenanceOptionType,
    pricing?: EPackagePricingType,
  ) => {
    const p = data.find((item) => item.type === type);
    if (p) setLocalPackage(p);
    setLocalPricingType(pricing ?? EPackagePricingType.BasePrice);
  };

  return (
    <div className={classes.wrapper}>
      {data?.length && (
        <TabContext value={value}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="icon tabs example"
          >
            {data.map((item, index) => (
              <Tab
                style={isBmWService ? { fontSize: 16 } : {}}
                key={item.id}
                className={
                  index === +value ? classes.selectedTab : classes.tabWrapper
                }
                value={`${index}`}
                label={<TabLabel text={item.name} />}
              />
            ))}
          </Tabs>

          {data.map((item, index) => (
            <TabPanel value={`${index}`} key={item.name}>
              <div className={classes.wrapperWithBorder}>
                <div
                  className={classes.packageName}
                  style={getTitleStyle(index, isBmWService)}
                >
                  {item.name}
                </div>

                <PackagesMobileServiceRequests
                  isBmWService={isBmWService}
                  serviceRequests={item.serviceRequests}
                />

                <PackagesMobileTotalMaintenance item={item} />

                <PackagesMobileIntervalUpsells
                  intervalUpsells={item.intervalUpsells}
                  isBmWService={isBmWService}
                  loadedPackages={loadedPackages}
                />

                <PackagesMobileComplimentary
                  isBmWService={isBmWService}
                  complimentaryServices={item.complimentaryServices}
                  loadedPackages={loadedPackages}
                />

                <PackagesMobileTotalComplimentary item={item} />
              </div>
            </TabPanel>
          ))}
        </TabContext>
      )}
      {withUpsells &&
      Boolean(getTitle(EPackagePricingType.BasePrice).length) ? (
        <div style={{ fontWeight: "bold" }}>
          {t("Total")}
          <span className={classes.info}>
            {" "}
            ({t("Excluding taxes & fees")}):
          </span>
        </div>
      ) : null}
      {selectedPackage ? (
        <React.Fragment>
          <PackagesMobileTotalPrice
            withUpsells={withUpsells}
            selectedPackage={selectedPackage}
            isUpsellPrice={false}
            handleClick={handleClick}
            packagePricingType={localSelectedPricingType}
            type={selectedPackage.type}
            text={getTitle(EPackagePricingType.BasePrice)}
            price={selectedPackage.price}
            totalMaintenanceValue={selectedPackage.totalMaintenanceValue}
            complimentaryPrice={
              selectedPackage.marketPriceComplimentaryServices
            }
          />
          {withUpsells ? (
            <PackagesMobileTotalPrice
              isUpsellPrice
              withUpsells={withUpsells}
              selectedPackage={selectedPackage}
              handleClick={handleClick}
              packagePricingType={localSelectedPricingType}
              type={selectedPackage.type}
              text={getTitle(EPackagePricingType.PriceWithFee)}
              price={selectedPackage.price}
              totalMaintenanceValue={selectedPackage.totalMaintenanceValue}
              complimentaryPrice={
                selectedPackage.marketPriceComplimentaryServices
              }
              upsellPrice={selectedPackage.marketPriceIntervalUpsells}
            />
          ) : null}
        </React.Fragment>
      ) : null}
      <Info style={{ paddingTop: 8 }}>
        {scProfile?.maintenancePackageDisclaimer
          ? scProfile.maintenancePackageDisclaimer
              .split("\n")
              .map((line) => <div key={line}>{line}</div>)
          : isBmWService
            ? t("Please ask your service advisor")
            : t("The maintenance packages may not be available")}
      </Info>
    </div>
  );
};

export default MaintenancePackagesMobile;
