import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useModal, useSCs} from "../../../utils/hooks";
import {loadEngineType} from "../../../store/reducers/vehicleDetails/actions";
import {Button} from "@material-ui/core";
import {AddEngineTypeModal} from "./AddEngineTypeModal/AddEngineTypeModal";
import {EditFieldNameModal} from "./EditFieldNameModal/EditFieldNameModal";
import {Wrapper} from "./styles";
import {EngineTypesTable} from "./EngineTypesTable/EngineTypesTable";

export const EngineTypes = () => {
    const { selectedSC } = useSCs();
    const dispatch = useDispatch();
    const {onOpen, onClose, isOpen} = useModal();
    const {onOpen: onFieldNameOpen, onClose: onFieldNameClose, isOpen: isFieldNameOpen} = useModal();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadEngineType(selectedSC.id));
        }
    }, [selectedSC])

    return (
        <div>
            <Wrapper>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onFieldNameOpen}
                    variant="contained">
                    Edit Field Name
                </Button>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpen}
                    variant="contained">
                    Add Engine Type
                </Button>
            </Wrapper>
            <EngineTypesTable/>
            <AddEngineTypeModal open={isOpen} onClose={onClose}/>
            <EditFieldNameModal open={isFieldNameOpen} onClose={onFieldNameClose}/>
        </div>
    );
};