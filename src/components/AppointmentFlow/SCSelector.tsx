import React, {useEffect, useState} from 'react';
import {MenuItem, Select} from "@material-ui/core";
import {Api} from "../../config/requests";
import {PaginatedAPIResponse} from "../../types/types";
import {IServiceCenter} from "../../store/reducers/serviceCenters/types";
import { useHistory, useParams, useLocation } from 'react-router-dom';
import {Routes} from "../../config/routes";
import {SelectInput} from "./UI";
import {KeyboardArrowDown} from "@material-ui/icons";

export const ScSelector = () => {
    const [scs, setSCs] = useState<IServiceCenter[]>([]);
    const [selected, setSelected] = useState<string>("");
    const history = useHistory();
    const {pathname} = useLocation()
    const {id} = useParams();

    useEffect(() => {
        Api.call<PaginatedAPIResponse<IServiceCenter>>(
            Api.endpoints.ServiceCenters.GetSelection,
            {data: {}}
        ).then(r => {
            setSCs(r.data.result);
        })
    }, []);
    useEffect(() => {
        if (id && scs.length) {
            setSelected(String(id));
        }
    }, [id, scs]);

    const handleSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
        history.push(
            (pathname.includes("welcome")
                ? Routes.EndUser.Welcome
                : Routes.EndUser.AppointmentBase) + `/${e.target.value as string}`)
    }

    return <Select
        value={selected}
        input={<SelectInput />}
        IconComponent={KeyboardArrowDown}
        onChange={handleSelect}
    >
        {scs.map(i => {
            return <MenuItem key={i.id} value={String(i.id)}>{i.name}</MenuItem>
        })}
    </Select>
};