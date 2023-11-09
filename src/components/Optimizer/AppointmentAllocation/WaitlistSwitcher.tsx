import React from 'react';
import {Button, FormControlLabel, styled, Switch, withStyles} from "@material-ui/core";
import {updateManualOverride, updateShowSuggestedPrice} from "../../../store/reducers/packages/actions";
import {loadWaitListSettings, toggleWaitListFunctionality} from "../../../store/reducers/optimizationWindows/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {useSCs, useSelectedPod} from "../../../utils/hooks";

const Label = withStyles({
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
    const dispatch = useDispatch()
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();

    const handleSwitch = (e: any, value: boolean) => {
        if (selectedSC) dispatch(toggleWaitListFunctionality(selectedSC.id, value, selectedPod?.id ?? undefined))
    }

    const onEditClick = () => {

    }

    return (
        <Wrapper>
            <Label
                control={<Switch
                    onChange={handleSwitch}
                    checked={waitListSettings?.isEnabled}
                    color="primary"
                />}
                label="WaitList Functionality"
                labelPlacement="start"/>
            <Button variant="text" onClick={onEditClick} color="primary">EDIT</Button>
        </Wrapper>
    );
};

export default WaitlistSwitcher;