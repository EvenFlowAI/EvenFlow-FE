import React, {Dispatch, SetStateAction, useMemo} from 'react';
import {Grid} from "@mui/material";
import {TextField} from "../../../../../../components/formControls/TextFieldStyled/TextField";
import {EUserType} from "../../../../../../store/reducers/appointmentFrameReducer/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../store/rootReducer";
import {useStyles} from "../styles";
import {useTranslation} from "react-i18next";
import {TKey, TOrderStyles} from "../types";
import {setRecallsAreShown, updateVehicle} from "../../../../../../store/reducers/appointmentFrameReducer/actions";

type TProps = {
    isRecallsCategorySelected: boolean;
    orderMapStyles: TOrderStyles;
    requiredFields: TKey[];
    errors: TKey[];
    setErrors: Dispatch<SetStateAction<TKey[]>>;
    recallsToggledOn: boolean;
}

const VinCodeInput: React.FC<TProps> = ({
                                            isRecallsCategorySelected,
                                            orderMapStyles,
                                            errors,
                                            setErrors,
                                            requiredFields,
                                            recallsToggledOn
}) => {
    const {selectedVehicle, userType} = useSelector((state: RootState) => state.appointmentFrame);
    const { classes  } = useStyles();
    const {customerLoadedData} = useSelector((state: RootState) => state.appointment);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const isExistingVin = useMemo(() => {
        return Boolean(customerLoadedData?.vehicles.find(v => {
            return (v.vin && selectedVehicle?.vin && v.vin.toUpperCase() === selectedVehicle?.vin.toUpperCase())}));
    }, [selectedVehicle, customerLoadedData])

    const handleVINChange = (name: TKey) => ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setRecallsAreShown(false));
        dispatch(updateVehicle({[name]: value.trim().toUpperCase()}));
        setErrors(e => e.filter(err => err !== name));
    }

    return recallsToggledOn || isRecallsCategorySelected || selectedVehicle?.vin?.length
        ? <Grid item xs={12} sm={6} key="vin" order={orderMapStyles.vin.order} style={{display: 'grid'}}>
            <div key="vin" className={recallsToggledOn && !isRecallsCategorySelected ? classes.vinWrapper : ""}>
                <TextField
                    onChange={handleVINChange("vin")}
                    label={recallsToggledOn && !isRecallsCategorySelected
                        ? t("OPTIONAL: Please enter your VIN to check for open Safety Recalls")
                        : `${t("VIN")}${isRecallsCategorySelected ? "" : `(${ t("Optional")})`}`
                    }
                    name={"vin"}
                    error={errors.includes("vin")}
                    required={requiredFields.includes("vin") || isRecallsCategorySelected}
                    fullWidth
                    disabled={(userType === EUserType.Existing && !!selectedVehicle?.vin?.length && isExistingVin)}
                    value={selectedVehicle ? selectedVehicle.vin : ""}
                    placeholder={errors.includes("vin")
                        ? `${t("VIN")} ${t("required")}`
                        : `${t("Type")} ${t("VIN")} ${isRecallsCategorySelected ? "" : `(${t("Optional")})`}`}
                />
            </div>
        </Grid>
        : null
};

export default VinCodeInput;