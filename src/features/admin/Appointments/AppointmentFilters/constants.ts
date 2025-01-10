import { TOption } from "../../../../types/types";
import { reportingStatuses } from "../../../../api/types";

export const statusOptions: TOption[] = Object.entries(reportingStatuses).map(
  ([number, status]) => ({
    value: number,
    name: status,
  }),
);
