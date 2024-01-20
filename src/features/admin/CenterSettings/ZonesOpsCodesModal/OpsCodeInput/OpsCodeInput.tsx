import React, {Dispatch, SetStateAction, useMemo} from 'react';
import {InputWrapper} from "../styles";
import { Autocomplete } from '@mui/material';
import {autocompleteRender} from "../../../../../utils/autocompleteRenders";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {IAssignedServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
import {TZone} from "../../../../../store/reducers/mobileService/types";
import {ISVZoneDefaultOpsCode, TDefaultOpsCode} from "../../../../../store/reducers/capacityServiceValet/types";

type TProps = {
    zone: TZone;
    zonesOpsCodes: ISVZoneDefaultOpsCode[];
    setZonesOpsCodes: Dispatch<SetStateAction<ISVZoneDefaultOpsCode[]>>;
    setFormChecked: Dispatch<SetStateAction<boolean>>;
    formChecked: boolean;
}

const OpsCodeInput: React.FC<React.PropsWithChildren<TProps>> = ({zone, zonesOpsCodes, setZonesOpsCodes, formChecked, setFormChecked}) => {
    const {allAssignedList} = useSelector((state: RootState) => state.serviceRequests);

    const zoneOpsCode = useMemo(() => {
        return zonesOpsCodes.find(item => item.zone.id === zone.id)?.serviceRequest
    }, [zonesOpsCodes, zone]);
    const selectedCode = useMemo(() => {
       return allAssignedList.find(el => el.id === zoneOpsCode?.id)
    }, [allAssignedList, zoneOpsCode])

    const onOpsCodeChange = (e: React.ChangeEvent<{}>, option: IAssignedServiceRequest)  => {
        setFormChecked(false);
        const serviceRequest: TDefaultOpsCode = {
            id: option.id,
            code: option.serviceRequest.code,
        }
        setZonesOpsCodes(prev => {
            const currentZone = prev.find(el => el.zone.id === zone.id)
            if (currentZone) {
                return prev
                    .filter(el => el.zone.id !== currentZone.zone.id)
                    .concat({...currentZone, serviceRequest: serviceRequest})
            } else {
                return [...prev, {zone: {id: zone.id, name: zone.name}, serviceRequest: serviceRequest}]
            }
        })
    }

    return <InputWrapper>
        <div style={{maxWidth: '50%'}}>{zone.name.toUpperCase()}</div>
        <Autocomplete
            style={{width: '50%'}}
            disableClearable
            value={selectedCode}
            onChange={onOpsCodeChange}
            getOptionLabel={o => o.serviceRequest.code}
            renderInput={autocompleteRender({
                label: '',
                placeholder: 'Unassigned',
                error: formChecked && !selectedCode
            })}
            options={allAssignedList}
        />
    </InputWrapper>
};

export default OpsCodeInput;