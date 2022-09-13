import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {MenuItem, Select} from "@material-ui/core";
import {switchLanguage} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {changeLanguage} from "i18next";

const LanguageSwitcher = () => {
    const {language} = useSelector((state: RootState) => state.appointmentFrame);
    const dispatch = useDispatch();
    const handleChangeLanguage = ({target: {value}}: React.ChangeEvent<{value: unknown}>) => {
        if (value === "en" || value === "es") {
            changeLanguage(value)
                .then(() => dispatch(switchLanguage(value)));
        }
    }
    return (
        <div>
            <Select
                value={language}
                onChange={handleChangeLanguage}
            >
                <MenuItem key="en" value="en">EN</MenuItem>
                <MenuItem key="en" value="es">ES</MenuItem>
            </Select>
        </div>
    );
};

export default LanguageSwitcher;