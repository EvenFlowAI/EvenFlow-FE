import React, {useEffect, useState} from 'react';
import {DialogTitle, BaseModal, DialogContent} from "../../Modals/BaseModal";
import {Button, styled} from "@material-ui/core";
import {ButtonsWrapper, TopWrapper} from "./ShowDropOffTimeDialog";
import {DialogProps} from "../../Modals/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {useException, useSCs} from "../../../utils/hooks";
import {updateServiceValetServiceRequest} from "../../../store/reducers/capacityServiceValet/actions";
import {TServiceValetRequestId} from "../../../store/reducers/capacityServiceValet/types";
import {loadAllAssignedServiceRequests} from "../../../store/reducers/serviceRequests/actions";

const OpsCode = styled('div')({
    height: 60,
    fontSize: 40,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 30,
})

const InputWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 30
})

const ServiceValetOpsCodeDialog: React.FC<DialogProps> = ({onClose, open}) => {
    const {centerSettings} = useSelector((state: RootState) => state.capacityServiceValet);
    const {allAssignedList} = useSelector((state: RootState) => state.serviceRequests);
    const [opsCode, setOpsCode] = useState<IAssignedServiceRequest|null>(null);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        selectedSC && dispatch(loadAllAssignedServiceRequests(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        if (centerSettings?.serviceRequest && open) {
            const opsCodeSelected = allAssignedList.find(item => item.id === centerSettings.serviceRequest?.id)
            opsCodeSelected && setOpsCode(opsCodeSelected);
        }
    }, [allAssignedList, centerSettings, open])


    const onCancel = () => {
        setOpsCode(null);
        onClose();
    }

    const onSave = () => {
        if (selectedSC && opsCode) {
            const data: TServiceValetRequestId = {serviceRequestId: opsCode.id};
            dispatch(updateServiceValetServiceRequest(selectedSC.id, data, onCancel, showError))
        }
    }

    const onOpsCodeChange = (e: React.ChangeEvent<{}>, option: IAssignedServiceRequest|null)  => {
        setOpsCode(option)
    }

    return <BaseModal onClose={onCancel} open={open} width={425}>
        <DialogTitle>
            <TopWrapper>
                Service Valet Ops Code
                <ButtonsWrapper>
                    <Button variant="text" onClick={onCancel} color="secondary" style={{textTransform: 'none'}}>Cancel</Button>
                    <Button variant="text" onClick={onSave} color="primary" style={{textTransform: 'none'}}>Save</Button>
                </ButtonsWrapper>
            </TopWrapper>
        </DialogTitle>
        <DialogContent>
            <OpsCode>{opsCode?.serviceRequest?.code ?? 'Not Selected'}</OpsCode>
            <InputWrapper>
                <div>DEFAULT OPS CODE"</div>
                <Autocomplete
                    style={{width: '50%'}}
                    value={opsCode}
                    onChange={onOpsCodeChange}
                    getOptionLabel={o => o.serviceRequest.code}
                    renderInput={autocompleteRender({
                        label: '',
                        placeholder: 'Select Ops Code',
                    })}
                    options={allAssignedList}
                />
            </InputWrapper>
        </DialogContent>
    </BaseModal>
};

export default ServiceValetOpsCodeDialog;