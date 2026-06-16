import React, { useEffect, useState } from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { IOrder, Titles } from '../../../types/types';
import { applicationRoot } from '../../../utils/constants';
import {
  getServiceCenterCredits,
  updateAvailableRecallCredit,
} from '../../../store/reducers/recallDatabase/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from './styles';
import { ServiceCenterCredit } from '../RecallDatabase/types';
import { initialOrder } from '../RecallDatabase/utils';
import RecallCreditsTable from './RecallCreditsTable';
import { SaveEditBlock } from '../../../components/buttons/SaveEditBlock/SaveEditBlock';
import { RootState } from '../../../store/rootReducer';
import RecallCreditsFilters from './RecallCreditsFilters';
import { loadAll } from '../../../store/reducers/dealershipGroups/actions';
import { useException } from '../../../hooks/useException/useException';
import { useMessage } from '../../../hooks/useMessage/useMessage';

const RecallCredits = () => {
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [data, setData] = useState<ServiceCenterCredit[]>([]);
  const { recallCredits } = useSelector((state: RootState) => state.recallDatabase);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [order, setOrder] = useState<IOrder<ServiceCenterCredit>>(initialOrder);
  const [pageData, setPageData] = useState({ pageIndex: 0, pageSize: 15 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const showError = useException();
  const showMessage = useMessage();

  const onChangePage = (e: React.MouseEvent<Element, MouseEvent> | null, pageNumber: number) => {
    setPageData(prev => ({ ...prev, pageIndex: pageNumber }));
  };

  const onChangeRowsPerPage: React.ChangeEventHandler<HTMLInputElement> = e => {
    setPageData({ pageSize: +e.target.value, pageIndex: 0 });
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getServiceCenterCredits(() => {
        setIsLoading(false);
        dispatch(loadAll());
      })
    );
  }, []);

  useEffect(() => {
    setData(recallCredits);
  }, [recallCredits]);

  const onSave = () => {
    const hasInvalidCredits = data.some(
      item =>
        !Number.isFinite(item.availableCredits) ||
        item.availableCredits < 0 ||
        item.availableCredits > 99999
    );

    if (hasInvalidCredits) {
      showError('Recall Credits must be within the range of 0-99999');
      return;
    }

    const items = data
      .filter(item => {
        const originalCredit = recallCredits.find(
          credit => credit.serviceCenterId === item.serviceCenterId
        );

        return !!originalCredit && originalCredit.availableCredits !== item.availableCredits;
      })
      .map(item => ({
        serviceCenterId: item.serviceCenterId,
        recallCredits: item.availableCredits,
      }));

    if (items.length) {
      dispatch(
        updateAvailableRecallCredit(items, () => {
          showMessage('Recall Credits successfully updated');
          setIsEdit(false);
        })
      );
    }
  };

  const onCancel = () => {
    setIsEdit(false);
    setData(recallCredits);
  };

  return (
    <div className={classes.root}>
      <TitleContainer title={Titles.RecallCredits} parent={applicationRoot} pad />
      <RecallCreditsFilters setData={setData} setPageData={setPageData} />
      <div className={classes.tableWrapper}>
        <SaveEditBlock
          onSave={onSave}
          onEdit={() => setIsEdit(true)}
          onCancel={onCancel}
          isEdit={isEdit}
          isSaving={isLoading}
        />
      </div>
      <RecallCreditsTable
        data={data}
        setData={setData}
        order={order}
        setOrder={setOrder}
        pageData={pageData}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        isEdit={isEdit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RecallCredits;
