import React, { useEffect, useState } from 'react';
import RecallCredits from './layouts/RecallCredits';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import { loadAvailableCredits } from '../../../../../store/reducers/dealerOperations/actions';
import { useDispatch } from 'react-redux';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import TableModeSwitcher from './layouts/TableModeSwitcher';
import WorkflowTable from './WorkflowTable';
import { IRecallAlert } from '../../../../../store/reducers/recall/types';
import { Autocomplete } from '@mui/material';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { TOption } from '../../../../../types/types';
import { RECALL_ALERTS_STATUSES } from '../../helper';
import { useStyles } from '../styles';

const RecallAlerts = () => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TOption>(RECALL_ALERTS_STATUSES[0]);
  const [tableMode, setTableMode] = useState<'workflow' | 'stats'>('workflow');
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const [currentItem, setCurrentItem] = useState<IRecallAlert | null>(null);
  const { classes } = useStyles();

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
                setSelectedStatus(newStatus);
              }}
              renderInput={autocompleteRender({
                label: '',
                fullWidth: true,
                placeholder: 'Not selected',
              })}
            />
          </div>
        </div>
        <div></div>
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
    </div>
  );
};

export default RecallAlerts;
