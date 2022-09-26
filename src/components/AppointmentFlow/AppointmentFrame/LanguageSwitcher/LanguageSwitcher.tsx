import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {MenuItem, Select, styled} from "@material-ui/core";
import {switchLanguage} from "../../../../store/reducers/appointmentFrameReducer/actions";
import {changeLanguage} from "i18next";
import {makeStyles} from "@material-ui/core/styles";
import {TextField} from "../../../UI/TextField";

const Wrapper = styled('div')({
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
})

const useStyles = makeStyles(() => ({
    select: {
        borderRadius: 0,
        border: 'none',
        fontWeight: 'bold',
        textDecoration: 'underline',
        '&:before': {
            display: 'none',
        },
        '& > div': {
            '&:focus': {
                backgroundColor: 'transparent'
            }
        },
    },
    menuItem: {
    }
}))

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