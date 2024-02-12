import React from 'react';
import {Button} from "@mui/material";
import {AddMileageModal} from "./AddMileageModal/AddMileageModal";
import {MileageTable} from "./MileageTable/MileageTable";
import {Wrapper} from "./styles";
import {useModal} from "../../../hooks/useModal/useModal";

export const Mileage = () => {
    const {onOpen, onClose, isOpen} = useModal();

    return (
        <div>
            <Wrapper>
                <Button
                    style={{marginLeft: 16}}
                    color="primary"
                    onClick={onOpen}
                    variant="contained">
                    Add Mileage
                </Button>
            </Wrapper>
            <MileageTable/>
            <AddMileageModal open={isOpen} onClose={onClose}/>
        </div>
    );
};