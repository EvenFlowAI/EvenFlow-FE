import React, { useEffect } from 'react';
import { Button, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { loadEndOfWarranty } from '../../../store/reducers/valueSettings/actions';
import { EndOfWarrantyModal } from './EndOfWarrantyModal/EndOfWarrantyModal';
import { StyledTable } from '../../../components/styled/StyledTable';
import { useModal } from '../../../hooks/useModal/useModal';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useSelectedPod } from '../../../hooks/useSelectedPod/useSelectedPod';

export const EndOfWarranty = () => {
  const { onOpen, onClose, isOpen } = useModal();
  const dispatch = useDispatch();
  const endOfWarranty = useSelector((state: RootState) => state.valueSettings.endOfWarranty);
  const { selectedSC } = useSCs();
  const { selectedPod } = useSelectedPod();

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadEndOfWarranty(selectedSC.id, selectedPod?.id));
    }
  }, [dispatch, selectedPod, selectedSC]);

  return (
    <div>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Customer type</TableCell>
            <TableCell colSpan={2}>Time period</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>End of Warranty</TableCell>
            <TableCell>Considered near the End of Warranty within</TableCell>
            <TableCell width={180}>
              {endOfWarranty
                ? `${endOfWarranty.periodInMonth} month${endOfWarranty.periodInMonth > 1 ? 's' : ''}`
                : '-'}
            </TableCell>
            <TableCell align="right">
              <Button color="primary" onClick={onOpen}>
                Edit
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </StyledTable>
      <EndOfWarrantyModal open={isOpen} onClose={onClose} payload={endOfWarranty} />
    </div>
  );
};
