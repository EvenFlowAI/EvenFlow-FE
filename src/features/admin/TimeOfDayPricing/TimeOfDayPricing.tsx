import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { TimeOfDayPricingRules } from "./TimeOfDayPricingRules/TimeOfDayPricingRules";
import { useDispatch } from "react-redux";
import { loadPricingDemand } from "../../../store/reducers/pricingSettings/actions";
import { useSCs } from "../../../hooks/useSCs/useSCs";
import { ConfigurationSettings } from "./ConfigurationSettings/ConfigurationSettings";
import PricingLevelsBy from "../PricingLevels/PricingLevelsBy/PricingLevelsBy";

export const TimeOfDayPricing = () => {
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  useEffect(() => {
    if (selectedSC) {
      dispatch(loadPricingDemand(selectedSC.id));
    }
  }, [dispatch, selectedSC]);

  return (
    <div>
      <TimeOfDayPricingRules />
      <Box p={1.5} />
      <ConfigurationSettings />
      <Box p={1.5} />
      <PricingLevelsBy />
    </div>
  );
};
