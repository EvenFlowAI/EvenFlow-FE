import React from 'react';
import {Button, FormControlLabel, styled, Switch, withStyles} from "@material-ui/core";
import {
    toggleWaitListFunctionality
} from "../../../store/reducers/optimizationWindows/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useModal, useSCs, useSelectedPod} from "../../../utils/hooks";
import WaitListSlotSettings from "../../Modals/WaitListSlotSettings/WaitListSlotSettings";

export const SwitcherLabel = withStyles({
    root: {
        justifyContent: "flex-end",
        marginLeft: 0,
        marginRight: 0,
        justifySelf: 'flex-end'
    },
    label: {
        fontWeight: "bold",
        fontSize: 14,
        textTransform: "uppercase",
    }
})(FormControlLabel);

const Wrapper = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: "center",
    "& > button": {
        marginLeft: 24,
        marginRight: 17,
    }
})

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
            <WaitListSlotSettings open={isOpen} onClose={onClose}/>
        </Wrapper>
    );
};

export default WaitlistSwitcher;