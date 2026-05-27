import React, { useEffect, useState } from 'react';
import RecallCredits from './layouts/RecallCredits';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import { loadAvailableCredits } from '../../../../../store/reducers/dealerOperations/actions';
import { useDispatch } from 'react-redux';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import TableModeSwitcher from './layouts/TableModeSwitcher';
import WorkflowTable from './WorkflowTable';
import { IRecallAlert } from '../../../../../store/reducers/recall/types';

const RecallAlerts = () => {
  const [loading, setLoading] = useState(false);
  const [tableMode, setTableMode] = useState<'workflow' | 'stats'>('workflow');
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const [currentItem, setCurrentItem] = useState<IRecallAlert | null>(null);

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
      <div style={{ width: '100%', display: 'flex', marginBottom: '24px' }}>
        <div>
          <TableModeSwitcher setTableMode={setTableMode} tableMode={tableMode} />
        </div>
        <div></div>
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
    </div>
  );
};

export default RecallAlerts;
