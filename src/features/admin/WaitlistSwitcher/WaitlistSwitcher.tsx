import React from 'react';
import {Button, Switch} from "@material-ui/core";
import {
    toggleWaitListFunctionality
} from "../../../store/reducers/optimizationWindows/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useModal, useSCs, useSelectedPod} from "../../../utils/hooks";
import WaitListSlotSettingsModal from "./WaitListSlotSettingsModal/WaitListSlotSettingsModal";
import {SwitcherLabel, Wrapper} from "./styles";

const WaitlistSwitcher = () => {
    const {waitListSettings} = useSelector((state: RootState) => state.optimizationWindows);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch()
    const {onOpen, onClose, isOpen} = useModal();

    const handleSwitch = (e: any, value: boolean) => {
        if (selectedSC) dispatch(toggleWaitListFunctionality(selectedSC.id, value, selectedPod?.id ?? undefined))
    }

    const onEditClick = () => {
        onOpen();
    }

    return (
        <Wrapper>
            <SwitcherLabel
                control={<Switch
                    onChange={handleSwitch}
                    checked={!!waitListSettings?.isEnabled}
                    color="primary"
                />}
                label="WaitList Functionality"
                labelPlacement="start"/>
            <Button variant="text" onClick={onEditClick} color="primary">EDIT</Button>
            <WaitListSlotSettingsModal open={isOpen} onClose={onClose}/>
        </Wrapper>
    );
};

export default WaitlistSwitcher;