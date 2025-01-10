import React, { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { Autocomplete } from "@mui/material";
import { autocompleteRender } from "../../../../utils/autocompleteRenders";
import { ScheduleEmployeeFiltersWrapper } from "../../../../components/styled/ScheduleTableElements";
import { TRole } from "../../../../store/reducers/users/types";
import { TServiceBook } from "../../../../store/reducers/appointments/types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { rolesList } from "../constants";
import { SearchDB } from "../../../../components/formControls/SearchDebounced/SearchDB";
import { CustomInputLabel } from "../../../../components/styled/CustomInputLabel";

type TProps = {
  isLoading: boolean;
  serviceBook: TServiceBook | null;
  role: TRole | null;
  setServiceBook: Dispatch<SetStateAction<TServiceBook | null>>;
  setRole: Dispatch<SetStateAction<TRole | null>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
};

const BaseScheduleFilters: React.FC<TProps> = ({
  isLoading,
  setRole,
  setServiceBook,
  serviceBook,
  role,
  setName,
  name,
}) => {
  const { serviceBookList } = useSelector(
    (state: RootState) => state.appointments,
  );

  const handleSelectRole = (
    event: SyntheticEvent<Element, Event>,
    value: TRole | null,
  ) => {
    setRole(value);
  };

  const onSelectServiceBook = (
    event: SyntheticEvent<Element, Event>,
    value: TServiceBook | null,
  ) => {
    setServiceBook(value);
  };

  const handleSearch = (searchTerm: string) => {
    setName(searchTerm);
  };

  return (
    <ScheduleEmployeeFiltersWrapper>
      <Autocomplete
        renderInput={autocompleteRender({
          label: "Service Book",
          placeholder: "Not Selected",
          fullWidth: true,
        })}
        options={serviceBookList}
        disabled={isLoading}
        style={{ color: serviceBook ? "inherit" : "#858585" }}
        value={serviceBook}
        getOptionLabel={(o) => o.name}
        isOptionEqualToValue={(o, v) => o.name === v.name}
        onChange={onSelectServiceBook}
      />
      <Autocomplete
        renderInput={autocompleteRender({
          label: "Role",
          placeholder: "Not Selected",
          fullWidth: true,
        })}
        options={rolesList}
        disabled={isLoading}
        style={{ color: role ? "inherit" : "#858585" }}
        value={role}
        getOptionLabel={(o) => o}
        isOptionEqualToValue={(o, v) => o === v}
        onChange={handleSelectRole}
      />
      <div>
        <CustomInputLabel shrink htmlFor={"name"} visible>
          NAME
        </CustomInputLabel>
        <SearchDB onSearch={handleSearch} search={name} />
      </div>
    </ScheduleEmployeeFiltersWrapper>
  );
};

export default BaseScheduleFilters;
