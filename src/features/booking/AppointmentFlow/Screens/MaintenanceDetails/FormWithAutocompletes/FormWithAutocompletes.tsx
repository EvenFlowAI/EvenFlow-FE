import React from 'react';
import {Autocomplete, Grid, useMediaQuery, useTheme} from "@mui/material";
import {getYearOptions} from "../../../../../../utils/utils";
import {autocompleteRender} from "../../../../../../utils/autocompleteRenders";
import {TFormProps, TKey} from "../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {IEngineType} from "../../../../../../store/reducers/vehicleDetails/types";
import {useTranslation} from "react-i18next";
import {updateVehicle} from "../../../../../../store/reducers/appointmentFrameReducer/actions";

const FormWithAutocompletes: React.FC<TFormProps> = ({
                                                         orderMapStyles,
                                                         isExistingVehicle,
                                                         requiredFields,
                                                         loadedOptions,
                                                         setLoadedOptions,
                                                         selectedEngine,
                                                         setSelectedEngine,
                                                         errors,
                                                         setErrors

                                                     }) => {
    const {
        selectedVehicle,
        makes,
        appointmentByKey
    }= useSelector((state: RootState) => state.appointmentFrame);
    const {scProfile} = useSelector((state: RootState) => state.appointment);
    const {mileage, engineTypes} = useSelector((state: RootState) => state.vehicleDetails);
    const {currentConfig} = useSelector((state: RootState) => state.bookingFlowConfig);

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (name: TKey, skip?: boolean) => (e: React.ChangeEvent<{}>, option: string|null) => {
        if (isXS) e.preventDefault();
        if (option && !skip) {
            if (["year", "model", "make", "mileage"].includes(name)) {
                dispatch(updateVehicle({[name]: option}))
            }
            setErrors(e => e.filter(err => err !== name));
            if (name === 'make') {
                if (option === t('Other')) {
                    setLoadedOptions(prevOptions => ({...prevOptions, model: [t('Other')]}));
                    if (selectedVehicle?.model) dispatch(updateVehicle({model: ''}));
                } else {
                    const currentMake = makes.find(item => item.name === option);
                    if (currentMake) setLoadedOptions(prevOptions => ({...prevOptions, model: currentMake.models }));
                    if (option !== selectedVehicle?.make) dispatch(updateVehicle({model: ''}));
                }
            }
        }
    }

    const handleEngineTypeChange =  (e: React.ChangeEvent<{}>, option: IEngineType|null) => {
        setSelectedEngine(option)
        dispatch(updateVehicle({engineTypeId: option?.id ?? null}));
        setErrors(e => e.filter(err => err !== "engineTypeId"))
    }

    return (
        <>
            <Grid item xs={12} sm={6} key="year" style={orderMapStyles.year}>
                <Autocomplete
                    key="year"
                    options={getYearOptions()}
                    onChange={handleChange('year', false)}
                    fullWidth
                    disablePortal
                    disableClearable
                    getOptionLabel={o => o}
                    getOptionKey={o => o}
                    isOptionEqualToValue={(o, v) => o === v}
                    disabled={isExistingVehicle}
                    renderInput={autocompleteRender({
                        label: t("Year"),
                        placeholder: errors.includes("year") ? `${t("Year")} ${t("required")}` : `${t("Select")} ${t("Year")}`,
                        error: errors.includes("year"),
                        required: requiredFields.includes('year')
                    })}
                    value={selectedVehicle?.year ? selectedVehicle.year.toString() : ''}
                />
            </Grid>

            <Grid item xs={12} sm={6} key="mileage" style={orderMapStyles.mileage}>
                <Autocomplete
                    key="mileage"
                    isOptionEqualToValue={(o, v) => o === v}
                    getOptionLabel={o => o}
                    getOptionKey={o => o}
                    disablePortal
                    options={mileage.map(item => item.value.toString())}
                    onChange={handleChange('mileage', false)}
                    fullWidth
                    disableClearable
                    renderInput={autocompleteRender({
                        label: t("Estimated mileage"),
                        placeholder: errors.includes("mileage") ? `${t("Estimated mileage")} ${t("required")}` : `${t("Select")} ${t("Estimated mileage")}`,
                        error: errors.includes("mileage"),
                        required: requiredFields.includes('mileage')
                    })}
                    value={selectedVehicle?.mileage ? selectedVehicle.mileage.toString() : ''}
                />
            </Grid>

            <Grid item xs={12} sm={6} key="make" style={orderMapStyles.make}>
                <Autocomplete
                    key="make"
                    options={loadedOptions.make ?? []}
                    onChange={handleChange('make', false)}
                    fullWidth
                    getOptionLabel={o => o}
                    getOptionKey={o => o}
                    disablePortal
                    isOptionEqualToValue={(o, v) => o === v}
                    disableClearable
                    disabled={isExistingVehicle}
                    renderInput={autocompleteRender({
                        label: t("Make"),
                        placeholder: errors.includes("make") ? `${t("Make")} ${t("required")}` : `${t("Select")} ${t("Make")}`,
                        error: errors.includes("make"),
                        required: requiredFields.includes('make')
                    })}
                    value={selectedVehicle?.make ? selectedVehicle.make?.toString() : ''}
                />
            </Grid>

            {currentConfig?.engineType
                ?  <Grid item xs={12} sm={6} key="Engine Type" style={orderMapStyles.engineType}>
                    <Autocomplete
                        key="Engine Type"
                        options={engineTypes}
                        onChange={handleEngineTypeChange}
                        fullWidth
                        disablePortal
                        getOptionLabel={o => o.name}
                        getOptionKey={o => o.id}
                        isOptionEqualToValue={o => o.id === selectedEngine?.id}
                        disabled={Boolean(selectedEngine) && Boolean(appointmentByKey?.vehicle?.engineTypeId)}
                        renderInput={autocompleteRender({
                            label: scProfile?.engineTypeFieldName ?? t("Engine Type"),
                            placeholder: errors.includes("engineTypeId")
                                ? `${scProfile?.engineTypeFieldName ?? t("Engine Type")} ${t("required")}`
                                : `${t("Select")} ${scProfile?.engineTypeFieldName ?? t("Engine Type")}`,
                            error: errors.includes("engineTypeId"),
                            required: true,
                        })}
                        value={selectedEngine}
                    /></Grid>
                : null}
            <Grid item xs={12} sm={6} key="model" order={orderMapStyles.model.order}>
                <Autocomplete
                    key="model"
                    options={loadedOptions.model ?? []}
                    onChange={handleChange('model', false)}
                    fullWidth
                    disableClearable
                    disablePortal
                    getOptionLabel={o => o}
                    getOptionKey={o => o}
                    isOptionEqualToValue={(o, v) => o === v}
                    disabled={isExistingVehicle}
                    renderInput={autocompleteRender({
                        label: t("Model"),
                        placeholder: errors.includes("model") ? `${t("Model")} ${t("required")}` : `${t("Select")} ${t("Model")}`,
                        error: errors.includes("model"),
                        required: requiredFields.includes('model')
                    })}
                    value={selectedVehicle?.model ? selectedVehicle.model.toString() : ''}
                />
            </Grid>
        </>
    );
};

export default FormWithAutocompletes;