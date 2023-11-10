import React, {useEffect} from 'react';
import {Button, FormControlLabel, styled, Switch, withStyles} from "@material-ui/core";
import {
    loadWaitListSettings,
    toggleWaitListFunctionality
} from "../../../store/reducers/optimizationWindows/actions";
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
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedSC) dispatch(loadWaitListSettings(selectedSC.id, selectedPod?.id))
    }, [selectedSC, selectedPod])

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