import React, { useEffect, useState } from 'react';
import RecallCredits from './RecallCredits';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import { loadAvailableCredits } from '../../../../../store/reducers/dealerOperations/actions';
import { useDispatch } from 'react-redux';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import TableModeSwitcher from './TableModeSwitcher';

const RecallAlerts = () => {
  const [loading, setLoading] = useState(false);
  const [tableMode, setTableMode] = useState<'workflow' | 'stats'>('workflow');
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();

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
      <div style={{ width: '100%', display: 'flex' }}>
        <div>
          <TableModeSwitcher setTableMode={setTableMode} tableMode={tableMode} />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default RecallAlerts;
