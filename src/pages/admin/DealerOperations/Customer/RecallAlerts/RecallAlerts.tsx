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
import { setSelectedStatus } from '../../../../../store/reducers/recall/actions';

const RecallAlerts = () => {
  const [loading, setLoading] = useState(false);
  const [tableMode, setTableMode] = useState<'workflow' | 'stats'>('workflow');
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const [currentItem, setCurrentItem] = useState<IRecallAlert | null>(null);
  const { classes } = useStyles();
  const { selectedStatus } = useSelector((state: RootState) => state.recalls);
  const { isOpen, onClose, onOpen } = useModal();

  const onSuccess = () => {
    setLoading(false);
  };
  useEffect(() => {
    if (!selectedSC) return;
    setLoading(true);
    dispatch(loadAvailableCredits(selectedSC.id, onSuccess));
  }, [selectedSC]);

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
          <Button variant="text" onClick={() => {}}>
            Edit Alert Name
          </Button>
          <Button variant="contained" onClick={onOpen} color="primary">
            Add Alert
          </Button>
        </div>
      </div>
      {tableMode === 'workflow' ? (
        <div>
          <WorkflowTable
            selectedStatus={selectedStatus}
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
