import React, {ChangeEvent, useEffect, useState} from 'react';
import { Autocomplete } from '@mui/material';
import {useStyles} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {TMakeOrder} from "../../../../api/types";
import {RootState} from "../../../../store/rootReducer";
import {updateDefaultMake} from "../../../../store/reducers/serviceCenters/actions";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

export const DefaultMake = () => {
    const { makes, isLoading } = useSelector((state: RootState) => state.vehicleDetails);
    const [selectedMake, setSelectedMake] = useState<TMakeOrder|null>(null);
    const {selectedSC} = useSCs();
    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        if (selectedSC?.defaultVehicleMakeId) {
            const make = makes.find(item => item.id === selectedSC.defaultVehicleMakeId)
            make && setSelectedMake(make)
        }
    }, [selectedSC, makes])

    const onMakeChange = (e: ChangeEvent<{}>, value: TMakeOrder|null) => {
        if (selectedSC) dispatch(updateDefaultMake(selectedSC.id, value?.id ?? null, showError))
    }

    return <>
        <div className={classes.title}>Default Make:</div>
        <Autocomplete
            style={{marginRight: 20, width: 300}}
            loading={isLoading}
            value={selectedMake}
            options={makes}
            clearIcon={null}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            getOptionLabel={o => o.name}
            onChange={onMakeChange}
            renderInput={autocompleteRender({
                label: "",
                placeholder: 'Select make'
            })}
        />
    </>;
};