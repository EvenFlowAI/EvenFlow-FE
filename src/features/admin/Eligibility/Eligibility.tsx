import React from "react";
import { DemandWindows } from "./DemandWindows/DemandWindows";
import { Box } from "@mui/material";
import EligibilityStatuses from "./EligibilityStatuses/EligibilityStatuses";

export const Eligibility = () => {
  return (
    <div>
      <DemandWindows />
      <Box p={2} />
      <EligibilityStatuses />
    </div>
  );
};
