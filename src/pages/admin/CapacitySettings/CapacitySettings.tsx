import React from "react";
import { TitleContainer } from "../../../components/wrappers/TitleContainer/TitleContainer";
import { capacityManagementRoot } from "../../../utils/constants";
import CapacitySettingsTable from "../../../features/admin/CapacitySettingsTable/CapacitySettingsTable";

export const CapacitySettings = () => {
  return (
    <div style={{ width: "100%" }}>
      <TitleContainer
        title="Capacity Settings"
        pad
        parent={capacityManagementRoot}
      />
      <CapacitySettingsTable />
    </div>
  );
};
