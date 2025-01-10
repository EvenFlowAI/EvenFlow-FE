import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { autocompleteRender } from "../../../../../../utils/autocompleteRenders";
import { Autocomplete } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store/rootReducer";
import Checkbox from "../../../../../../components/formControls/Checkbox/Checkbox";
import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import { IMake } from "../../../../../../api/types";
import { removeDuplicates, upperCase } from "./utils";
import { useAutocompleteStyles } from "../../../../../../hooks/styling/useAutocompleteStyles";
import { ApplyToAll } from "../constants";

type MakeAndModelProps = {
  setSelectedMakes: Dispatch<SetStateAction<string[]>>;
  setSelectedModels: Dispatch<SetStateAction<string[]>>;
  selectedModels: string[];
  selectedMakes: string[];
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
};

const MakeAndModel: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<MakeAndModelProps>>
> = ({
  disabled,
  setSelectedMakes,
  selectedModels,
  selectedMakes,
  setSelectedModels,
  setFormIsChecked,
}) => {
  const { makes: makesFromDB } = useSelector(
    (state: RootState) => state.packages,
  );
  const [models, setModels] = useState<string[]>([]);
  const { classes } = useAutocompleteStyles();

  const filteredMakes = useMemo(
    () =>
      makesFromDB.filter((item) =>
        upperCase(selectedMakes).includes(item.name.toUpperCase()),
      ),
    [makesFromDB, selectedMakes],
  );

  useEffect(() => {
    const sorted = getSortedModelsOptions(filteredMakes);
    setModels(removeDuplicates(sorted));
  }, [filteredMakes]);

  const sortMakes = (a: string, b: string) => {
    return upperCase(selectedMakes).includes(a.toUpperCase())
      ? upperCase(selectedMakes).includes(b.toUpperCase())
        ? 0
        : -1
      : 1;
  };

  const sortModels = (a: string, b: string) => {
    return upperCase(selectedModels).includes(a.toUpperCase())
      ? upperCase(selectedModels).includes(b.toUpperCase())
        ? 0
        : -1
      : 1;
  };

  const getSortedMakesOptions = useCallback(
    (makesFromDB: IMake[]): string[] => {
      const data: string[] = makesFromDB
        .map((make) => make.name)
        .sort(sortMakes);
      if (data.length) data.unshift(ApplyToAll);
      return data;
    },
    [selectedMakes],
  );

  const getSortedModelsOptions = useCallback(
    (makesFromDB: IMake[]): string[] => {
      const data: string[] = makesFromDB
        .map((make) => make.models)
        .flat(1)
        .sort(sortModels);
      if (data.length) data.unshift(ApplyToAll);
      return removeDuplicates(data);
    },
    [selectedModels],
  );

  const renderMakeOption = useCallback(
    (props: any, option: any) => {
      const currentOptionSelected = upperCase(selectedMakes).includes(
        option.toUpperCase(),
      );
      const allSelected = Boolean(
        !makesFromDB.find(
          (make) => !upperCase(selectedMakes).includes(make.name.toUpperCase()),
        ),
      );
      const checked = currentOptionSelected || allSelected;
      return (
        <li
          style={{ display: "flex", alignItems: "center" }}
          {...props}
          key={option}
        >
          <Checkbox
            color="primary"
            icon={
              checked ? (
                <CheckBoxOutlined htmlColor="#3855FE" />
              ) : (
                <CheckBoxOutlineBlank htmlColor="#DADADA" />
              )
            }
            checked={checked}
          />
          {option}
        </li>
      );
    },
    [makesFromDB, selectedMakes],
  );

  const getFilteredModels = (): string[] => {
    const data = models.filter((el) => el !== ApplyToAll).sort(sortModels);
    if (data.length) data.unshift(ApplyToAll);
    return data;
  };

  const setInitialModels = () => {
    const sorted = getSortedModelsOptions(makesFromDB);
    setModels(removeDuplicates(sorted));
  };

  const renderModelOption = useCallback(
    (props: any, option: any) => {
      const filteredMakes = makesFromDB.filter((item) =>
        upperCase(selectedMakes).includes(item.name.toUpperCase()),
      );
      const allModelsSelected = filteredMakes.length
        ? Boolean(
            !filteredMakes
              .map((item) => item.models)
              .flat(1)
              .find(
                (model) =>
                  !upperCase(selectedModels).includes(model.toUpperCase()),
              ),
          )
        : false;

      const checked =
        upperCase(selectedModels).includes(option.toUpperCase()) ||
        allModelsSelected;
      return (
        <li
          style={{ display: "flex", alignItems: "center" }}
          {...props}
          key={option + Math.random()}
        >
          <Checkbox
            color="primary"
            icon={
              checked ? (
                <CheckBoxOutlined htmlColor="#3855FE" />
              ) : (
                <CheckBoxOutlineBlank htmlColor="#DADADA" />
              )
            }
            checked={checked}
          />
          {option}
        </li>
      );
    },
    [selectedModels, selectedMakes],
  );

  const onMakeChange = (e: React.SyntheticEvent, value: string[]) => {
    setFormIsChecked(false);
    if (value.includes(ApplyToAll)) {
      if (makesFromDB.length && value.length === makesFromDB.length + 1) {
        setSelectedModels([]);
        setSelectedMakes([]);
      } else {
        setSelectedMakes(() => makesFromDB.map((item) => item.name));
        setInitialModels();
      }
    } else {
      setSelectedMakes(value);
    }
  };

  const onModelChange = (e: React.SyntheticEvent, value: string[]) => {
    setFormIsChecked(false);
    const filteredModels = filteredMakes.map((item) => item.models).flat(1);
    const modelsSet = removeDuplicates(filteredModels);
    if (value.includes(ApplyToAll)) {
      if (modelsSet.length && value.length === modelsSet.length + 1) {
        setSelectedModels([]);
      } else {
        setSelectedModels(modelsSet);
      }
    } else {
      setSelectedModels(value);
    }
  };

  return (
    <div>
      <Autocomplete
        multiple
        style={{ marginBottom: 10 }}
        classes={classes}
        disabled={disabled}
        options={getSortedMakesOptions(makesFromDB)}
        disableCloseOnSelect
        onChange={onMakeChange}
        getOptionLabel={(o) => o ?? null}
        isOptionEqualToValue={(o, v) => o.toLowerCase() === v.toLowerCase()}
        renderOption={renderMakeOption}
        value={selectedMakes}
        renderInput={autocompleteRender({
          label: "Make",
          placeholder: "Select Make",
        })}
      />
      <Autocomplete
        multiple
        style={{ marginBottom: 10 }}
        classes={classes}
        disabled={disabled}
        disablePortal
        options={getFilteredModels()}
        disableCloseOnSelect
        onChange={onModelChange}
        renderOption={renderModelOption}
        getOptionLabel={(o) => o ?? null}
        isOptionEqualToValue={(o, v) => o.toLowerCase() === v.toLowerCase()}
        value={selectedModels}
        renderInput={autocompleteRender({
          label: "Model",
          placeholder: "Select Model",
        })}
      />
    </div>
  );
};

export default MakeAndModel;
