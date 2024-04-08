import React from 'react';
import {ButtonContainer, TableContainer} from "./styles";
import {Button} from "@mui/material";
import {
    DemandSegmentsDesirability
} from "../DemandSegmentsDesirability/DemandSegmentsDesirability";
import {DemandSegmentsTable} from "../DemandSegmentsTable/DemandSegmentsTable";
import {DemandSegmentsModal} from "../DemandSegmentsModal/DemandSegmentsModal";
import {useModal} from "../../../hooks/useModal/useModal";

const DemandSegments = () => {
    const {isOpen: isDemandOpen, onClose: onDemandClose, onOpen: onDemandOpen} = useModal();

    return (
        <div>
            <ButtonContainer>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onDemandOpen}>
                    Manage Segments
                </Button>
            </ButtonContainer>
            <TableContainer><DemandSegmentsTable/></TableContainer>
            <div style={{padding: 16}} />
            <TableContainer><DemandSegmentsDesirability/></TableContainer>
            <DemandSegmentsModal open={isDemandOpen} onClose={onDemandClose} />
        </div>
    );
};

export default DemandSegments;