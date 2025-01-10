import React, { useState } from "react";
import { TitleContainer } from "../../../components/wrappers/TitleContainer/TitleContainer";
import { TabList } from "../../../components/styled/Tabs";
import { Switch, Tab } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { DayOfWeekTab } from "../../../features/admin/PricingLevels/DayOfWeekTab";
import { Eligibility } from "../../../features/admin/Eligibility/Eligibility";
import { PriceCalculations } from "../../../features/admin/PriceCalculations/PriceCalculations";
import { TimeOfDayPricing } from "../../../features/admin/TimeOfDayPricing/TimeOfDayPricing";
import { changePricingOpt } from "../../../store/reducers/serviceCenters/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { updateMaxPrice } from "../../../store/reducers/pricingSettings/actions";
import { ButtonsWrapper, ControlLabel } from "./styles";
import { pricingRoot } from "../../../utils/constants";
import { LoadingButton } from "../../../components/buttons/LoadingButton/LoadingButton";

import { useMessage } from "../../../hooks/useMessage/useMessage";
import { useException } from "../../../hooks/useException/useException";
import { useSCs } from "../../../hooks/useSCs/useSCs";
import { TimeOfYear } from "../../../features/admin/VariableDemand/TimeOfYear/TimeOfYear";

type Tab = {
  id: string;
  label: string;
  component: JSX.Element;
};

const tabs: Tab[] = [
  { id: "0", label: "Eligibility", component: <Eligibility /> },
  { id: "1", label: "Time Of Day", component: <TimeOfDayPricing /> },
  { id: "2", label: "Day Of Week", component: <DayOfWeekTab /> },
  { id: "3", label: "Time Of Year", component: <TimeOfYear /> },
  { id: "4", label: "Price Calculations", component: <PriceCalculations /> },
];

export const ServicePricingSettings = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedTab, selectTab] = useState<string>("0");
  const { selectedSC } = useSCs();
  const { isLoading } = useSelector(
    (state: RootState) => state.pricingSettings,
  );
  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();

  const handleTabChange = (e: any, value: string) => {
    selectTab(value);
  };
  const handlePricingOptChange = async (e: any, checked: boolean) => {
    if (selectedSC) {
      try {
        setSaving(true);
        await dispatch(changePricingOpt(selectedSC.id, checked));
      } catch (e) {
        showError(e);
      } finally {
        setSaving(false);
      }
    }
  };

  const onSuccessUpdate = () => {
    showMessage("Max Price updated");
  };

  const onErrorUpdate = (err: string) => {
    showError(err);
  };

  const onUpdateMaxPriceClick = () => {
    selectedSC &&
      dispatch(updateMaxPrice(selectedSC.id, onSuccessUpdate, onErrorUpdate));
  };

  const actions = (
    <ButtonsWrapper>
      <ControlLabel
        labelPlacement="start"
        control={
          <Switch
            color="primary"
            disabled={saving}
            checked={selectedSC?.applyPricingOptimization ?? false}
            onChange={handlePricingOptChange}
          />
        }
        label={"Pricing optimization"}
      />
      <LoadingButton loading={isLoading} onClick={onUpdateMaxPriceClick}>
        Update Max Price
      </LoadingButton>
    </ButtonsWrapper>
  );

  return (
    <TabContext value={selectedTab}>
      <TitleContainer
        title="Service Price"
        pad
        parent={pricingRoot}
        actions={actions}
      />
      <TabList
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleTabChange}
        indicatorColor="primary"
      >
        {tabs.map((t) => {
          return <Tab label={t.label} value={t.id} key={t.id} />;
        })}
      </TabList>
      {tabs.map((t) => {
        return (
          <TabPanel
            style={{ width: "100%", padding: "24px 0" }}
            key={t.id}
            value={t.id}
          >
            {t.component}
          </TabPanel>
        );
      })}
    </TabContext>
  );
};
