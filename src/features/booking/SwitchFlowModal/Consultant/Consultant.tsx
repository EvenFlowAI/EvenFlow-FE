import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {useStyles} from "../styles";
import {IServiceConsultant} from "../../../../api/types";
import {IFirstScreenOption} from "../../../../store/reducers/serviceTypes/types";
import useGetConsultantsData from "../../../../hooks/useGetConsultantsData/useGetConsultantsData";
import {Api} from "../../../../api/ApiEndpoints/ApiEndpoints";
import {PaginatedAPIResponse} from "../../../../types/types";

type TProps = {
    disabled?: boolean;
    isVisible: boolean;
    consultant: IServiceConsultant|null;
    setConsultant: Dispatch<SetStateAction<IServiceConsultant|null>>;
    newOption: IFirstScreenOption|null;
    address?: any;
    zipCode?: string|null;
    open: boolean;
}

const Consultant: React.FC<TProps> = ({
                                          disabled,
                                          isVisible,
                                          consultant,
                                          setConsultant,
                                          newOption,
                                          address,
                                          zipCode,
                                          open
                                      }) => {
    const { advisor } = useSelector((state: RootState) => state.appointmentFrame);
    const {t} = useTranslation();
    const { classes  } = useStyles();
    const [advisors, setAdvisors] = useState<IServiceConsultant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('mdl'));
    const data = useGetConsultantsData(newOption, address, zipCode ?? "")

    useEffect(() => {
        if (data) {
            setLoading(true)
            Api.call<PaginatedAPIResponse<IServiceConsultant>>(
                Api.endpoints.ServiceConsultants.GetByQuery, {data})
                .then(({data: {result}}) => {
                    if (result.length) {
                        setAdvisors(result)
                    }
                    const currentAdvisor = result.find(el => el.id === advisor?.id);
                    setConsultant(currentAdvisor ?? null)
                })
                .catch(err => console.log(err))
                .finally(() => setLoading(false))
        } else {
            setConsultant(null)
        }
    }, [data, advisor, open])

    const handleConsultantChange = (e: SelectChangeEvent<unknown>) => {
        const selected = advisors.find(item => item.id === e.target?.value);
        setConsultant(selected ?? null)
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
                        displayEmpty
                        fullWidth={isSm}
                        disabled={disabled || !advisors.length}
                        onChange={handleConsultantChange}>
                        <MenuItem value="Any" key="any">{t("Any Available")}</MenuItem>
                        {advisors.map(consultant => <MenuItem
                            value={consultant.id}
                            key={consultant.name}>
                            {consultant.name}
                        </MenuItem>)}
                    </Select>}
            </div>
        </div>
        : null
};

export default Consultant;