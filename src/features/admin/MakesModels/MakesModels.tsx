import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useModal, useSCs} from "../../../utils/hooks";
import {loadMakes} from "../../../store/reducers/vehicleDetails/actions";
import {RootState} from "../../../store/rootReducer";
import {Button} from "@material-ui/core";
import {AddMakeModelModal} from "./AddMakeModelModal/AddMakeModelModal";
import {useStyles} from "./styles";
import {DefaultMake} from "./DefaultMake/DefaultMake";
import {MakesModelsTable} from "./MakesModelsTable/MakesModelsTable";

export const MakesModels = () => {
    const {currentMake} = useSelector((state: RootState) => state.vehicleDetails);
    const {selectedSC} = useSCs();
    const {onOpen, onClose, isOpen} = useModal();
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadMakes(selectedSC.id))
        }
    }, [selectedSC])

    return (
        <div>
            <div className={classes.wrapper}>
                <DefaultMake/>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpen}
                    variant="contained">
                    Add Make And Model
                </Button>
            </div>
            <MakesModelsTable onOpen={onOpen}/>
            <AddMakeModelModal open={isOpen} onClose={onClose} isEditing={Boolean(currentMake)}/>
        </div>
    );
};