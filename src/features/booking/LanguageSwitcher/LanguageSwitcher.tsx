import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { switchLanguage } from "../../../store/reducers/appointmentFrameReducer/actions";
import { changeLanguage } from "i18next";
import { TextField } from "../../../components/formControls/TextFieldStyled/TextField";
import { useStyles, Wrapper } from "./styles";
import { TLanguage } from "../../../store/reducers/appointmentFrameReducer/types";

const LanguageSwitcher = () => {
  const { language } = useSelector(
    (state: RootState) => state.appointmentFrame,
  );
  const dispatch = useDispatch();
  const { classes } = useStyles();

  const handleChangeLanguage = (e: SelectChangeEvent<{ value: TLanguage }>) => {
    if (e.target.value === "en" || e.target.value === "es") {
      changeLanguage(e.target.value).then(() =>
        dispatch(switchLanguage(e.target.value as TLanguage)),
      );
    }
  };
  // todo check the switcher
  return (
    <Wrapper>
      <Select
        value={{ value: language }}
        onChange={handleChangeLanguage}
        className={classes.select}
        IconComponent="div"
        input={<TextField label="" inputProps={{ disableUnderline: true }} />}
      >
        <MenuItem
          key="english"
          value={"en" as TLanguage}
          className={classes.menuItem}
        >
          English
        </MenuItem>
        <MenuItem key="spanish" value={"es" as TLanguage}>
          Español
        </MenuItem>
      </Select>
    </Wrapper>
  );
};

export default LanguageSwitcher;
