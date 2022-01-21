import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Grid, MenuItem, Select} from "@material-ui/core";
import {Api} from "../../../../config/requests";
import {ITransportation} from "../../../../api/types";
import {useSCs} from "../../../../utils/hooks";
import {TForm} from "../AppointmentDialog";
import {IAppointmentSlot, ISR} from "../../../../store/reducers/appointment/types";
import {TextField} from "../../../UI/TextField";

type TTransportationProps = {
    form: TForm;
    setForm: Dispatch<SetStateAction<TForm>>;
    selectedSR: ISR[];
    maintenancePackageOptionId: number | undefined;
    slot: IAppointmentSlot | null;
    serviceCategoryIds: number[];
}

const Transportation: React.FC<TTransportationProps> = ({ form , setForm, selectedSR, maintenancePackageOptionId, slot, serviceCategoryIds }) => {
    const [transportations, setTransportations] = useState<ITransportation[]>([]);
    const {selectedSC} = useSCs();

    useEffect(() => {
        if (selectedSC && (selectedSR.length || serviceCategoryIds.length || maintenancePackageOptionId) && slot) {
            Api.call<ITransportation[]>(
                Api.endpoints.TransportationOptions.GetActive,
                {
                    data: {
                        serviceCenterId: selectedSC.id,
                        serviceRequestIds: selectedSR.map(item => item.id),
                        maintenancePackageOptionId,
                        slot: `${String(slot.date).split("T")[0]}T${slot.time}Z`,
                        serviceCategoryIds,
                    }
                }
            ).then(({data}) => {
                setTransportations(data);
            })
        }
    }, [selectedSC, selectedSR, serviceCategoryIds, maintenancePackageOptionId, slot])

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
                input={<TextField label="Transportation Description" placeholder="Transportation needs"/>}
                id="transportationDescription"
                placeholder="Transportation needs"
                name="transportationDescription"
                value={form.transportationOption || "Yes, I will be waiting"}
                onChange={handleChangeTransportationNeeds}
                fullWidth
            >
                <MenuItem key="default" value={"Yes, I will be waiting"}>Yes, I will be waiting</MenuItem>
                {transportations.map(option =>
                    <MenuItem key={option.name} value={option.name}>{option.description}</MenuItem>
                )}
            </Select>
        </Grid>
    );
};

export default Transportation;