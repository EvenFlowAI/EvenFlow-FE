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
  getManufacturers,
  loadRecallsDatabase,
  upsertBookingRecallComponent,
} from '../../../store/reducers/recallDatabase/actions';
import RecallDatabaseFilters from './RecallDatabaseFilters';
import { useDebounce } from '../../../hooks/useDebounce/useDebounce';

const RecallDatabase = () => {
  const { classes } = useStyles();
  const { isLoading, recallsDatabase } = useSelector((state: RootState) => state.recallDatabase);
  const [data, setData] = useState<IGlobalRecall[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [order, setOrder] = useState<IOrder<IGlobalRecall>>(initialOrder);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [manufacturer, setManufacturer] = useState<string>('');
  const { pageData, onChangePage, onChangeRowsPerPage } = useStatePagination();
  const dispatch = useDispatch();
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 300);

  useEffect(() => {
    dispatch(getManufacturers());
  }, []);

  useEffect(() => {
    dispatch(loadRecallsDatabase(pageData, order, debouncedSearchTerm, manufacturer));
  }, [pageData, order, debouncedSearchTerm, manufacturer]);

  useEffect(() => {
    setData(recallsDatabase);
  }, [recallsDatabase]);

  const onCancel = () => {
    setIsEdit(false);
    setData(recallsDatabase);
  };

  const onSave = () => {
    data.forEach(item => {
      const globalRecall = recallsDatabase.find(recall => recall.id === item.id);
      if (globalRecall) {
        if (
          globalRecall.recallComponentBookingFlow?.trim() !==
          item.recallComponentBookingFlow?.trim()
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
      <RecallDatabaseFilters
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        manufacturer={manufacturer}
        setManufacturer={setManufacturer}
      />
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
