import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {MenuItem, Select} from "@material-ui/core";
import {switchLanguage} from "../../../store/reducers/appointmentFrameReducer/actions";
import {changeLanguage} from "i18next";
import {TextField} from "../../../components/formControls/TextFieldStyled/TextField";
import {useStyles, Wrapper} from "./styles";

const LanguageSwitcher = () => {
    const {language} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleChangeLanguage = ({target: {value}}: React.ChangeEvent<{value: unknown}>) => {
        if (value === "en" || value === "es") {
            changeLanguage(value)
                .then(() => dispatch(switchLanguage(value)));
        }
    }

    return (
        <Wrapper>
            <Select
                value={language}
                onChange={handleChangeLanguage}
                className={classes.select}
                IconComponent="div"
                input={
                    <TextField label='' inputProps={{ disableUnderline: true }}/>
                }
            >
                <MenuItem key="english" value="en" className={classes.menuItem}>English</MenuItem>
                <MenuItem key="spanish" value="es">Español</MenuItem>
            </Select>
        </Wrapper>
    );
};

export default LanguageSwitcher;