import React from "react";
import { TitleContainer } from "../../../components/wrappers/TitleContainer/TitleContainer";
import { capacityManagementRoot } from "../../../utils/constants";
import ServiceBooksTable from "../../../features/admin/ServiceBooks/ServiceBooksTable/ServiceBooksTable";

const ServiceBooks = () => {
  return (
    <div style={{ width: "100%" }}>
      <TitleContainer
        title="Service Books"
        pad
        parent={capacityManagementRoot}
      />
      <ServiceBooksTable />
    </div>
  );
};

export default ServiceBooks;
