import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  loadConsentsList,
  loadEmailRequirement,
} from "../../../store/reducers/screenSettings/actions";
import {
  EScreenSettingsType,
  screenSettingsList,
  TOptContent,
} from "../../../store/reducers/screenSettings/types";
import { RootState } from "../../../store/rootReducer";
import { CenterSettingsPlate } from "../CenterSettings/CenterSettingsPlate/CenterSettingsPlate";
import { useSCs } from "../../../hooks/useSCs/useSCs";
import { useSelectedPod } from "../../../hooks/useSelectedPod/useSelectedPod";
import { useModal } from "../../../hooks/useModal/useModal";
import { EditEmailRequirementModal } from "./EditEmailRequirementModal/EditEmailRequirementModal";
import { CustomerConsentsModal } from "./CustomerConsentsModal/CustomerConsentsModal";
import { loadRange } from "../../../store/reducers/slotScoring/actions";
import PriceDisplayModal from "./PriceDisplayModal/PriceDisplayModal";
import { loadRoundPriceSetting } from "../../../store/reducers/pricingSettings/actions";
import { loadWaitListSettings } from "../../../store/reducers/optimizationWindows/actions";
import WaitListSlotSettingsModal from "./WaitListSlotSettingsModal/WaitListSlotSettingsModal";
import { getWaitlistValue } from "./utils";
import { EditCompanyNameModal } from "./EditCompanyNameModal/EditCompanyNameModal";
import { loadGeneralSettings } from "../../../store/reducers/generalSettings/actions";
import { ESettingType } from "../../../store/reducers/generalSettings/types";

export const ScreenSettings = () => {
  const {
    emailRequirement,
    isEmailRequirementLoading,
    consentsList,
    isConsentLoading,
  } = useSelector((state: RootState) => state.screenSettingsBooking);
  const { roundPrice, isRoundPriceLoading } = useSelector(
    (state: RootState) => state.pricingSettings,
  );
  const { waitListSettings, isWaitListLoading } = useSelector(
    (state: RootState) => state.optimizationWindows,
  );
  const { settings, isLoading } = useSelector(
    (state: RootState) => state.generalSettings,
  );
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { selectedPod } = useSelectedPod();
  const {
    onOpen: onEmailEditOpen,
    isOpen: isEmailEditOpen,
    onClose: onEmailEditClose,
  } = useModal();
  const {
    onOpen: onConsentOpen,
    isOpen: isConsentOpen,
    onClose: onConsentClose,
  } = useModal();
  const {
    onOpen: onPricingOpen,
    isOpen: isPricingOpen,
    onClose: onPricingClose,
  } = useModal();
  const {
    onOpen: onCompanyNameOpen,
    isOpen: isCompanyNameOpen,
    onClose: onCompanyNameClose,
  } = useModal();
  const {
    onOpen: onWaitlistOpen,
    isOpen: isWaitlistOpen,
    onClose: onWaitlistClose,
  } = useModal();

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadEmailRequirement(selectedSC.id));
      dispatch(loadRoundPriceSetting(selectedSC.id));
    }
  }, [selectedSC]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadConsentsList(selectedSC.id, selectedPod?.id));
      dispatch(loadRange(selectedSC.id, null, selectedPod?.id));
      dispatch(loadWaitListSettings(selectedSC.id, selectedPod?.id));
      dispatch(loadGeneralSettings(selectedSC.id, [ESettingType.CompanyName]));
    }
  }, [selectedSC, selectedPod]);

  const getEmailRequirementLabel = (): string => {
    let str = "No data";
    if (emailRequirement) {
      const { adminAndEmployeesEnabled, customerSelfServiceEnabled } =
        emailRequirement;
      if (adminAndEmployeesEnabled && customerSelfServiceEnabled) return "On";
      if (!adminAndEmployeesEnabled && !customerSelfServiceEnabled)
        return "Off";
      return "Mixed";
    }
    return str;
  };

  const getCustomerConsentValue = (): string => {
    const allConsentsAreOn =
      consentsList.length && consentsList.every((el) => el.isEnabled);
    const someConsentsAreOn =
      consentsList.length &&
      consentsList.some((el) => el.isEnabled) &&
      consentsList.some((el) => !el.isEnabled);
    return allConsentsAreOn ? "On" : someConsentsAreOn ? "[On / Off]" : "Off";
  };

  const getPriceDisplayValue = (roundPrice: boolean) => {
    return roundPrice ? "Rounded" : "Fractional";
  };

  const getCompanyNameValue = () => {
    const companyNameSetting = settings.find(
      (el) => el.settingType === ESettingType.CompanyName,
    );
    return companyNameSetting?.data?.isOn ? "On" : "Off";
  };

  const getCount = (k: EScreenSettingsType): string | number => {
    switch (k) {
      case EScreenSettingsType.EmailRequirement:
        return getEmailRequirementLabel();
      case EScreenSettingsType.CustomerConsent:
        return getCustomerConsentValue();
      case EScreenSettingsType.PriceDisplay:
        return getPriceDisplayValue(roundPrice);
      case EScreenSettingsType.Waitlist:
        return getWaitlistValue(Boolean(waitListSettings?.isEnabled));
      case EScreenSettingsType.CompanyName:
        return getCompanyNameValue();
      default:
        return "No data";
    }
  };

  const optContent: TOptContent = {
    [EScreenSettingsType.EmailRequirement]: {
      helperText:
        "Data validation configuration for email address on confirmation page",
      label: getEmailRequirementLabel(),
      title: "Email Requirement",
      isLoading: isEmailRequirementLoading,
    },
    [EScreenSettingsType.CustomerConsent]: {
      helperText: "Require customer consent for specific appointment requests",
      label: getCustomerConsentValue(),
      title: "Customer Consent",
      isLoading: isConsentLoading,
    },
    [EScreenSettingsType.PriceDisplay]: {
      helperText: "Display configuration for prices in the booking experience",
      label: getPriceDisplayValue(roundPrice),
      title: "Price Display",
      isLoading: isRoundPriceLoading,
    },
    [EScreenSettingsType.Waitlist]: {
      helperText: "Require customer consent for specific appointment requests",
      label: getWaitlistValue(Boolean(waitListSettings?.isEnabled)),
      title: "Waitlist",
      isLoading: isWaitListLoading,
    },
    [EScreenSettingsType.CompanyName]: {
      helperText: "Display of Company Name field option on confirmation page",
      label: getCompanyNameValue(),
      title: "Company Name",
      isLoading: isLoading,
    },
  };

  const getPlateEdit = (k: EScreenSettingsType): void => {
    switch (k) {
      case EScreenSettingsType.EmailRequirement:
        onEmailEditOpen();
        break;
      case EScreenSettingsType.CustomerConsent:
        onConsentOpen();
        break;
      case EScreenSettingsType.PriceDisplay:
        onPricingOpen();
        break;
      case EScreenSettingsType.CompanyName:
        onCompanyNameOpen();
        break;
      case EScreenSettingsType.Waitlist:
        onWaitlistOpen();
        break;
      default:
        return;
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {screenSettingsList.map((k) => {
          const plate = optContent[k];
          return (
            <CenterSettingsPlate
              key={k}
              onEdit={() => getPlateEdit(k)}
              title={plate.title}
              count={getCount(k)}
              label={""}
              prefix={plate.prefix}
              suffix={plate.suffix}
              helperText={plate.helperText}
              isLoading={plate.isLoading}
            />
          );
        })}
      </Grid>
      <EditEmailRequirementModal
        open={isEmailEditOpen}
        onClose={onEmailEditClose}
      />
      <EditCompanyNameModal
        open={isCompanyNameOpen}
        onClose={onCompanyNameClose}
      />
      <CustomerConsentsModal open={isConsentOpen} onClose={onConsentClose} />
      <PriceDisplayModal open={isPricingOpen} onClose={onPricingClose} />
      <WaitListSlotSettingsModal
        open={isWaitlistOpen}
        onClose={onWaitlistClose}
      />
    </>
  );
};
