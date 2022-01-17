import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Grid, MenuItem, Select} from "@material-ui/core";
import {Api} from "../../../../config/requests";
import {ITransportation} from "../../../../api/types";
import {useSCs} from "../../../../utils/hooks";
import {TForm} from "../AppointmentDialog";
import {ISR} from "../../../../store/reducers/appointment/types";

type TTransportationProps = {
    form: TForm;
    setForm: Dispatch<SetStateAction<TForm>>;
    selectedSR: ISR[];
}

const Transportation: React.FC<TTransportationProps> = ({ form , setForm, selectedSR }) => {
    const [transportations, setTransportations] = useState<ITransportation[]>([]);
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC) {
            Api.call<ITransportation[]>(
                Api.endpoints.TransportationOptions.GetActive,
                {
                    data: {
                        serviceCenterId: selectedSC.id,
                        serviceRequestIds: selectedSR,
                        maintenancePackageOptionId: null
                    }
                }
            ).then(({data}) => {
                setTransportations(data);
            })
        }
    }, [selectedSC])

    const handleChangeTransportationNeeds = ({target: {value}}: React.ChangeEvent<{value: unknown}>) => {
        const option = transportations.find(el => el.name === value)
        setForm({
            ...form,
            transportationOption: option ?? null
        });
    }

    return (
        <Grid item xs={12}>
            <Select
                label="Transportation Description"
                id="transportationDescription"
                placeholder="Transportation needs"
                name="transportationDescription"
                value={form.transportationOption}
                onChange={handleChangeTransportationNeeds}
                fullWidth
            >
                {transportations.map(option =>
                    <MenuItem key={option.name} value={option.name}>{option.description}</MenuItem>
                )}
            </Select>
        </Grid>
    );
};

export default Transportation;