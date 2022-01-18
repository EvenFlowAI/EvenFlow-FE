import React, {ChangeEvent, useEffect} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../../UI/AutocompleteRender";
import {Grid} from "@material-ui/core";
import {ISR} from "../../../../store/reducers/appointment/types";
import {useDispatch, useSelector} from "react-redux";
import {loadCategoriesByQuery} from "../../../../store/reducers/categories/actions";
import {useSCs} from "../../../../utils/hooks";
import {RootState} from "../../../../store/rootReducer";
import {ICategory} from "../../../../store/reducers/categories/types";
import {IPackageAppointments, IPackageOptions} from "../../../../api/types";

type TServicesSelectionProps = {
    handleSRChange: (e: any, value: ISR[]) => void;
    srLoading: boolean;
    srList: ISR[];
    selectedSR: ISR[];
    selectedCategories: ICategory[];
    selectedPackage: IPackageAppointments | null;
    handleCategoryChange: (e: ChangeEvent<{}>, value: ICategory[]) => void;
    handlePackageChange: (e: ChangeEvent<{}>, value: IPackageAppointments | null) => void;
    handlePackageOptionChange: (e: ChangeEvent<{}>, value: IPackageOptions | null) => void;
    selectedPackageOption: IPackageOptions | null;
    disabled: boolean;
}

const ServicesSelection: React.FC<TServicesSelectionProps> = ({
                                                                  handleSRChange,
                                                                  selectedSR,
                                                                  srLoading,
                                                                  srList,
                                                                  handleCategoryChange,
                                                                  selectedCategories,
                                                                  handlePackageChange,
                                                                  selectedPackage,
                                                                  handlePackageOptionChange,
                                                                  selectedPackageOption,
                                                                  disabled,
}) => {
    const { allCategories, isLoading } = useSelector((state: RootState) => state.categories);
    const { packages } = useSelector((state: RootState) => state.appointments);
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        selectedSC && dispatch(loadCategoriesByQuery(selectedSC.id))
    }, [selectedSC])

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Autocomplete
                    multiple
                    onChange={handleSRChange}
                    value={selectedSR}
                    disabled={disabled}
                    ChipProps={{
                        color: "primary",
                        style: {borderRadius: 4},
                        size: "small"
                    }}
                    loading={srLoading}
                    getOptionSelected={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => `${option.code}: ${option.description}`}
                    renderInput={autocompleteRender({label: "Individual Service Requests", placeholder: "Select Service Requests"})}
                    options={srList}
                />
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    multiple
                    onChange={handleCategoryChange}
                    value={selectedCategories}
                    disabled={disabled}
                    ChipProps={{
                        color: "primary",
                        style: {borderRadius: 4},
                        size: "small"
                    }}
                    loading={isLoading}
                    getOptionSelected={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option?.name}
                    renderInput={autocompleteRender({label: "Service Categories", placeholder: "Select Categories"})}
                    options={allCategories.filter(item => item.type === 0)}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    onChange={handlePackageChange}
                    value={selectedPackage}
                    disabled={disabled}
                    ChipProps={{
                        color: "primary",
                        style: {borderRadius: 4},
                        size: "small"
                    }}
                    loading={isLoading}
                    getOptionSelected={(option, value) => option.maintenancePackageName === value.maintenancePackageName}
                    getOptionLabel={(option) => option?.maintenancePackageName}
                    renderInput={autocompleteRender({label: "Maintenance Package", placeholder: "Select Package"})}
                    options={packages}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    onChange={handlePackageOptionChange}
                    value={selectedPackageOption}
                    ChipProps={{
                        color: "primary",
                        style: {borderRadius: 4},
                        size: "small"
                    }}
                    disabled={!selectedPackage}
                    loading={isLoading}
                    getOptionSelected={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.name}
                    renderInput={autocompleteRender({label: "Package Option", placeholder: "Select Package Option"})}
                    options={selectedPackage ? selectedPackage.options : []}
                />
            </Grid>
    </React.Fragment>

    );
};

export default ServicesSelection;