import { TOption } from "../ServiceBookModal/types";
import { getOptions } from "../../../utils/utils";
import { EAdvisorAssignMethod } from "../../../store/reducers/employees/types";

export const methodOptions: TOption[] = getOptions(
  Object.keys(EAdvisorAssignMethod).filter((key) => Number.isNaN(+key)),
);
export const secondaryOptions = methodOptions.filter(
  (el) =>
    el.value !== EAdvisorAssignMethod.NoAssignment &&
    el.value !== EAdvisorAssignMethod.LastEmployee,
);
