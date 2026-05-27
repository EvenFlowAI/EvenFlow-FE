import React, { useEffect, useState } from 'react';
import RecallCredits from './layouts/RecallCredits';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import { loadAvailableCredits } from '../../../../../store/reducers/dealerOperations/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import TableModeSwitcher from './layouts/TableModeSwitcher';
import WorkflowTable from './WorkflowTable';
import { IRecallAlert } from '../../../../../store/reducers/recall/types';
import { Autocomplete, Button } from '@mui/material';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { RECALL_ALERTS_STATUSES } from '../../helper';
import { useStyles } from '../styles';
import { useModal } from '../../../../../hooks/useModal/useModal';
import AddRecallAlertModal from './layouts/AddRecallAlertModal';
import { RootState } from '../../../../../store/rootReducer';
import {
  setIsEditName,
  setSelectedStatus,
  setUpdatedAlerts,
  updateRecallAlertName,
} from '../../../../../store/reducers/recall/actions';
import { useException } from '../../../../../hooks/useException/useException';

const RecallAlerts = () => {
  const [loading, setLoading] = useState(false);
  const [tableMode, setTableMode] = useState<'workflow' | 'stats'>('workflow');
  const [currentItem, setCurrentItem] = useState<IRecallAlert | null>(null);
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { classes } = useStyles();
  const { recallAlerts, selectedStatus, updatedAlerts, isEditName } = useSelector(
    (state: RootState) => state.recalls
  );
  const { isOpen, onClose, onOpen } = useModal();
  const showError = useException();

  useEffect(() => {
    // effect on a first page load to store current names
    if (recallAlerts.length) {
      setStartedNames();
    }
  }, [recallAlerts]);

  useEffect(() => {
    if (!selectedSC) return;

    setLoading(true);
    dispatch(loadAvailableCredits(selectedSC.id, onSuccess));
  }, [selectedSC]);

  const setStartedNames = () => {
    dispatch(
      setUpdatedAlerts(
        recallAlerts.map(item => {
          return {
            id: item.id,
            name: item.name,
          };
        })
      )
    );
  };

  const onSuccess = () => {
    dispatch(setIsEditName(false));
    setLoading(false);
  };

  const onError = (eventName: string) => {
    showError(`Recall alert name "${eventName}" is already used. Please enter a unique name.`);
    dispatch(setIsEditName(true));
    setLoading(false);
  };

  const handleUpdateRecallAlertName = () => {
    if (selectedSC?.id) {
      let counter = 0;
      recallAlerts.forEach(event => {
        updatedAlerts.forEach(updatedEvent => {
          if (event.id === updatedEvent.id) {
            if (event.name !== updatedEvent.name) {
              setLoading(true);
              dispatch(
                updateRecallAlertName(
                  {
                    id: updatedEvent.id,
                    name: updatedEvent.name.trim(),
                    serviceCenterId: selectedSC?.id,
                  },
                  onSuccess,

                  onError
                )
              );
              counter += 1;
            }
          }
        });
      });

      if (counter === 0) {
        dispatch(setIsEditName(false));
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <RecallCredits />
      <div className={classes.recallAlertHeader}>
        <div className={classes.filtersWrapper}>
          <TableModeSwitcher setTableMode={setTableMode} tableMode={tableMode} />
          <div style={{ width: 180 }}>
            <Autocomplete
              disableClearable
              options={RECALL_ALERTS_STATUSES}
              getOptionLabel={option => option.name}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              value={selectedStatus}
              onChange={(event, newStatus) => {
                dispatch(setSelectedStatus(newStatus));
              }}
              renderInput={autocompleteRender({
                label: '',
                fullWidth: true,
                placeholder: 'Not selected',
              })}
            />
          </div>
        </div>
        <div className={classes.buttonsWrapper}>
          {isEditName ? (
            <>
              <Button
                variant="text"
                onClick={() => {
                  setStartedNames();
                  dispatch(setIsEditName(false));
                }}
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                variant="text"
                disabled={!!updatedAlerts.find(event => event.name.trim().length < 3)}
                onClick={handleUpdateRecallAlertName}
              >
                Save
              </Button>
            </>
          ) : (
            <Button variant="text" onClick={() => dispatch(setIsEditName(true))}>
              Edit Alert Name
            </Button>
          )}
          <Button variant="contained" onClick={onOpen} color="primary">
            Add Alert
          </Button>
        </div>
      </div>
      {tableMode === 'workflow' ? (
        <div>
          <WorkflowTable
            currentItem={currentItem}
            setCurrentItem={setCurrentItem}
            onOpenModal={() => {}}
          />
        </div>
      ) : null}
      <AddRecallAlertModal open={isOpen} onClose={onClose} />
    </div>
  );
};

export default RecallAlerts;
