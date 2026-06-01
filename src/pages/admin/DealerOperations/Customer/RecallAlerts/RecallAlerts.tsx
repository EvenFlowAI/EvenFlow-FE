import React, { useEffect, useState } from 'react';
import RecallCredits from './layouts/RecallCredits';
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
  setIsRecallAlertsTableLoading,
  setSelectedStatus,
  setUpdatedAlerts,
  updateRecallAlertName,
} from '../../../../../store/reducers/recall/actions';
import { useException } from '../../../../../hooks/useException/useException';
import StatsTable from './StatsTable';
import { getAllGlobalRecall } from '../../../../../store/reducers/recallDatabase/actions';
import TextConfigurationRecall from './layouts/TextConfigurationRecall';

const RecallAlerts = () => {
  const [tableMode, setTableMode] = useState<'workflow' | 'stats'>('workflow');
  const [currentItem, setCurrentItem] = useState<IRecallAlert | null>(null);
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { classes } = useStyles();
  const { recallAlerts, selectedStatus, updatedAlerts, isEditName } = useSelector(
    (state: RootState) => state.recalls
  );
  const { isOpen, onClose, onOpen } = useModal();
  const { isOpen: isOpenText, onClose: onCloseText, onOpen: onOpenText } = useModal();
  const showError = useException();

  useEffect(() => {
    // effect on a first page load to store current names
    if (recallAlerts.length) {
      setStartedNames();
    }
  }, [recallAlerts]);

  useEffect(() => {
    if (!selectedSC) return;

    dispatch(setIsRecallAlertsTableLoading(true));
    dispatch(loadAvailableCredits(selectedSC.id, onSuccess));
    dispatch(getAllGlobalRecall());
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
  };

  const onError = (eventName: string) => {
    showError(`Recall alert name "${eventName}" is already used. Please enter a unique name.`);
    dispatch(setIsEditName(true));
    dispatch(setIsRecallAlertsTableLoading(false));
  };

  const handleUpdateRecallAlertName = () => {
    if (selectedSC?.id) {
      let counter = 0;
      recallAlerts.forEach(event => {
        updatedAlerts.forEach(updatedEvent => {
          if (event.id === updatedEvent.id) {
            if (event.name !== updatedEvent.name) {
              dispatch(setIsRecallAlertsTableLoading(true));
              dispatch(
                updateRecallAlertName(
                  {
                    id: updatedEvent.id,
                    name: updatedEvent.name.trim(),
                    serviceCenterId: selectedSC?.id,
                  },
                  tableMode,
                  () => {
                    dispatch(setIsRecallAlertsTableLoading(false));
                    onSuccess();
                  },
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
            onOpenText={onOpenText}
          />
        </div>
      ) : (
        <StatsTable currentItem={currentItem} setCurrentItem={setCurrentItem} />
      )}
      <AddRecallAlertModal open={isOpen} onClose={onClose} tableType={tableMode} />
      <TextConfigurationRecall
        open={isOpenText}
        onClose={onCloseText}
        updatedRecallAlert={currentItem}
        tableType={tableMode}
      />
    </div>
  );
};

export default RecallAlerts;
