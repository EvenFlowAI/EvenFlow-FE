import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {loadMakes} from "../../../store/reducers/vehicleDetails/actions";
import {RootState} from "../../../store/rootReducer";
import {Button} from "@mui/material";
import {useStyles} from "./styles";
import {MakesModelsTable} from "./MakesModelsTable/MakesModelsTable";
import {useModal} from "../../../hooks/useModal/useModal";
import {useSCs} from "../../../hooks/useSCs/useSCs";
import {loadGlobalMakes} from "../../../store/reducers/globalVehicles/actions";

export const MakesModels = () => {
    const {makes} = useSelector((state: RootState) => state.vehicleDetails);
    const {selectedSC} = useSCs();
    const {onOpen, onClose, isOpen} = useModal();
    const dispatch = useDispatch();
    const { classes  } = useStyles();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadMakes(selectedSC.id))
            dispatch(loadGlobalMakes({pageIndex: 0, pageSize: 0}, {isAscending: false, orderBy: "VinName"}, null, []))
        }
    }, [selectedSC])

    return (
        <div>
            <div className={classes.wrapper}>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpen}
                    variant="contained">
                    {makes.length ? 'Edit Makes' : 'Add Makes'}
                </Button>
            </div>
            <MakesModelsTable onOpen={onOpen}/>
        </div>
    );
};