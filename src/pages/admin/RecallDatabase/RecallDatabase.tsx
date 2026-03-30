import React, { useEffect, useState } from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { IOrder, Titles } from '../../../types/types';
import { applicationRoot } from '../../../utils/constants';
import { useStyles } from './styles';
import RecallDatabaseTable from './RecallDatabaseTable';
import { IGlobalRecall } from './types';
import { initialOrder } from './utils';
import { useStatePagination } from '../../../hooks/usePaginations/usePaginations';
import { SaveEditBlock } from '../../../components/buttons/SaveEditBlock/SaveEditBlock';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import {
  loadRecallsDatabase,
  upsertBookingRecallComponent,
} from '../../../store/reducers/recallDatabase/actions';

const RecallDatabase = () => {
  const { classes } = useStyles();
  const { isLoading, recallsDatabase } = useSelector((state: RootState) => state.recallDatabase);
  const [data, setData] = useState<IGlobalRecall[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [order, setOrder] = useState<IOrder<IGlobalRecall>>(initialOrder);
  const { pageData, onChangePage, onChangeRowsPerPage } = useStatePagination();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadRecallsDatabase(pageData, order));
  }, [pageData, order]);

  useEffect(() => {
    setData(recallsDatabase);
  }, [recallsDatabase]);

  const onCancel = () => {
    setIsEdit(false);
  };

  const onSave = () => {
    data.forEach(item => {
      const globalRecall = recallsDatabase.find(recall => recall.id === item.id);
      console.log(globalRecall);
      if (globalRecall) {
        if (
          globalRecall.recallComponentBookingFlow.trim() !== item.recallComponentBookingFlow.trim()
        ) {
          dispatch(
            upsertBookingRecallComponent(globalRecall.id, item.recallComponentBookingFlow.trim())
          );
        }
      }
    });
    setIsEdit(false);
  };

  return (
    <div className={classes.root}>
      <TitleContainer title={Titles.RecallDatabase} parent={applicationRoot} pad />
      <div className={classes.tableWrapper}>
        <SaveEditBlock
          onSave={onSave}
          onEdit={() => setIsEdit(true)}
          onCancel={onCancel}
          isEdit={isEdit}
          isSaving={isLoading}
        />
      </div>
      <RecallDatabaseTable
        data={data}
        setData={setData}
        order={order}
        setOrder={setOrder}
        pageData={pageData}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        isEdit={isEdit}
      />
    </div>
  );
};

export default RecallDatabase;
