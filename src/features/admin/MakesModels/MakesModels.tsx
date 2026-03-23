import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadMakes,
  loadGlobalMakes,
  loadMakesAll,
  loadMakeCodes,
} from '../../../store/reducers/vehicleDetails/actions';
import { RootState } from '../../../store/rootReducer';
import { Button } from '@mui/material';
import { AddMakeModelModal } from './AddMakeModelModal/AddMakeModelModal';
import { useStyles } from './styles';
import { MakesModelsTable } from './MakesModelsTable/MakesModelsTable';
import { useModal } from '../../../hooks/useModal/useModal';
import { useSCs } from '../../../hooks/useSCs/useSCs';

export const MakesModels = () => {
  const { currentMake, makes, order, pageData } = useSelector(
    (state: RootState) => state.vehicleDetails
  );
  const { selectedSC } = useSCs();
  const { onOpen, onClose, isOpen } = useModal();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  useEffect(() => {
    if (selectedSC) {
      dispatch(loadMakes(selectedSC.id));
      dispatch(loadMakesAll(selectedSC.id));
    }
  }, [selectedSC, order, pageData, isOpen, dispatch]);

  useEffect(() => {
    dispatch(loadGlobalMakes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadMakeCodes(selectedSC.id));
    }
  }, [selectedSC, dispatch]);

  const existedMakes = makes.length > 0;
  return (
    <div>
      <div className={classes.wrapper}>
        {/* <DefaultMake /> */}
        <Button style={{ marginLeft: 16 }} color="primary" onClick={onOpen} variant="contained">
          {existedMakes ? 'Edit Makes' : 'Add Makes'}
        </Button>
      </div>
      <MakesModelsTable onOpen={onOpen} />
      <AddMakeModelModal open={isOpen} onClose={onClose} isEditing={Boolean(currentMake)} />
    </div>
  );
};
