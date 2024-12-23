import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {useStyles} from "../styles";
import {IServiceConsultant} from "../../../../api/types";

type TProps = {
    disabled?: boolean;
    isVisible: boolean;
    loading?: boolean;
    consultant: IServiceConsultant|null;
    setConsultant: Dispatch<SetStateAction<IServiceConsultant|null>>;
}

const Consultant: React.FC<TProps> = ({disabled, isVisible, loading, consultant, setConsultant}) => {
    const { advisor, consultants } = useSelector((state: RootState) => state.appointmentFrame);
    const { currentConfig } = useSelector((state: RootState) => state.bookingFlowConfig);
    const {t} = useTranslation();
    const { classes  } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));

    useEffect(() => {
        setConsultant(advisor)
    }, [advisor])

    const handleConsultantChange = (e: SelectChangeEvent<unknown>) => {
        const selected = consultants.find(item => item.id === e.target?.value);
        setConsultant(selected ?? null)
        // dispatch(setAdvisor(consultant ? consultant : null))
        // dispatch(setAnyAdvisorSelected(!Boolean(e.target.value)))
    }

    return isVisible
        ? <div style={isSm ? {marginBottom: 4} : {}}>
            <div>
                <div className={classes.label}>{t("Service Advisor")}</div>
                {loading ? <Loading/>
                    : <Select
                        value={consultant?.id ?? "Any"}
                        className={classes.select}
                        variant="standard"
                        disableUnderline
                        fullWidth={isSm}
                        disabled={disabled || (!!currentConfig && !consultants.length)}
                        onChange={handleConsultantChange}>`
                        {consultants
                            .map(consultant => <MenuItem value={consultant.id}
                                                         key={consultant.name}>{consultant.name}</MenuItem>)
                            .concat([<MenuItem value="Any" key="any">{t("Any Available")}</MenuItem>])}
                    </Select>}
            </div>
        </div>
        : null
};

export default Consultant;