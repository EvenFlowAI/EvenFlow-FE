import React from 'react';
import { UpperLineContainer, TableContainer, TableTitle } from './styles';
import { Button } from '@mui/material';
import { DemandSegmentsDesirability } from '../DemandSegmentsDesirability/DemandSegmentsDesirability';
import { DemandSegmentsTable } from '../DemandSegmentsTable/DemandSegmentsTable';
import { DemandSegmentsModal } from '../DemandSegmentsModal/DemandSegmentsModal';
import { useModal } from '../../../hooks/useModal/useModal';

const DemandSegments = () => {
  const { isOpen: isDemandOpen, onClose: onDemandClose, onOpen: onDemandOpen } = useModal();

  return (
    <div>
      <UpperLineContainer>
        <TableTitle>Capacity Allocation to Demand Segment</TableTitle>
        <Button variant="contained" color="primary" onClick={onDemandOpen}>
          Manage Segments
        </Button>
      </UpperLineContainer>
      <TableContainer>
        <DemandSegmentsTable />
      </TableContainer>
      <div style={{ padding: 18 }} />
      <TableTitle>Time of Day Desirability Scoring by Demand Segment</TableTitle>
      <div style={{ padding: 6 }} />
      <TableContainer>
        <DemandSegmentsDesirability />
      </TableContainer>
      <DemandSegmentsModal open={isDemandOpen} onClose={onDemandClose} />
    </div>
  );
};

export default DemandSegments;
