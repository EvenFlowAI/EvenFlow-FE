import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IRecall } from '../../../../store/reducers/recall/types';
import { Table } from '../../../../components/tables/Table/Table';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import {
  loadRecalls,
  setRecallOrder,
  setRecallPageData,
} from '../../../../store/reducers/recall/actions';
import { IOrder, TableRowDataType } from '../../../../types/types';
import { usePagination } from '../../../../hooks/usePaginations/usePaginations';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { formatYears } from '../../../../components/modals/admin/ViewGlobalRecall/helper';
import { getRecallDmsVehicles, getRecallMakes, getRecallModelsWithYears } from '../utils';

const RECALL_COMPONENT_MAX_LENGTH = 20;
const MODEL_MAX_LENGTH = 12;

const renderTruncated = (value: string | undefined | null, maxLength: number) => {
  const text = value ?? '';
  return text.length > maxLength ? (
    <Tooltip placement="top" title={text}>
      <p style={{ cursor: 'pointer', userSelect: 'none', margin: 0 }}>
        {text.slice(0, maxLength) + '...'}
      </p>
    </Tooltip>
  ) : (
    text
  );
};

const renderList = (values: string[], maxLength?: number): JSX.Element | string => {
  if (!values.length) return '-';
  return (
    <>
      {values.map((value, index) => (
        <div key={`${value}-${index}`}>{maxLength ? renderTruncated(value, maxLength) : value}</div>
      ))}
    </>
  );
};

type TRecallTableProps = {
  onOpenModal: () => void;
  onOpenGrouping: () => void;
  currentItem: IRecall | null;
  setCurrentItem: Dispatch<SetStateAction<IRecall | null>>;
};

const RecallTable: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TRecallTableProps>>
> = ({ onOpenModal, onOpenGrouping, setCurrentItem }) => {
  const { recalls, recallsCount, order, searchTerm } = useSelector(
    (state: RootState) => state.recalls
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { changeRowsPerPage, changePage, pageIndex, pageSize } = usePagination(
    (s: RootState) => s.recalls.recallPageData,
    setRecallPageData
  );

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadRecalls(selectedSC.id));
    }
  }, [selectedSC, pageIndex, pageSize, order, searchTerm]);

  const rowData: TableRowDataType<IRecall>[] = [
    {
      header: 'NHTSA Campaign',
      width: 116,
      val: el => el.recallCampaignNumber,
      orderId: 'CampaignNumber',
    },
    {
      header: 'OEM Program',
      width: 104,
      val: el => el.oemProgram,
      orderId: 'OemProgram',
    },
    {
      header: 'Make',
      width: 112,
      val: el => renderList(getRecallMakes(el)),
      orderId: 'Make',
    },
    {
      header: 'Model',
      width: 126,
      val: el =>
        renderList(
          getRecallModelsWithYears(el).map(model => model.name),
          MODEL_MAX_LENGTH
        ),
    },
    {
      header: 'Years',
      width: 300,
      val: el =>
        renderList(
          getRecallModelsWithYears(el).map(model =>
            model.years.length ? formatYears(model.years) : '-'
          )
        ),
    },
    {
      header: 'DMS Vehicles',
      width: 103,
      val: el => getRecallDmsVehicles(el)?.toLocaleString() ?? '-',
    },
    {
      header: 'Recall Component',
      width: 276,
      val: el => renderTruncated(el.recallComponent, RECALL_COMPONENT_MAX_LENGTH),
      orderId: 'RecallComponent',
    },
    {
      header: 'Op Code',
      width: 130,
      val: el => el.serviceRequest?.name ?? '',
      orderId: 'OpCode',
    },
  ];

  const openMenu = (el: IRecall) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setCurrentItem(el);
    setAnchorEl(e.currentTarget);
  };

  const tableActions = (el: IRecall) => {
    return (
      <IconButton onClick={openMenu(el)} size="large">
        <MoreHoriz />
      </IconButton>
    );
  };

  const openEdit = () => {
    setAnchorEl(null);
    onOpenModal();
  };

  const openGrouping = () => {
    setAnchorEl(null);
    onOpenGrouping();
  };

  const onSort = (o: IOrder<IRecall>) => () => {
    dispatch(setRecallOrder(o));
  };

  const onMenuClose = () => {
    setAnchorEl(null);
    setCurrentItem(null);
  };

  return (
    <div>
      <Table<IRecall>
        data={recalls}
        index={'id'}
        isAscending={order.isAscending}
        order={order?.orderBy}
        onSort={onSort}
        rowData={rowData}
        actions={tableActions}
        rowsPerPage={pageSize}
        page={pageIndex}
        onChangePage={changePage}
        onChangeRowsPerPage={changeRowsPerPage}
        count={recallsCount}
        hidePagination={recallsCount < 11}
      />
      <Menu open={Boolean(anchorEl)} onClose={onMenuClose} anchorEl={anchorEl}>
        <MenuItem onClick={openEdit}>Edit</MenuItem>
        <MenuItem onClick={openGrouping}>Group</MenuItem>
      </Menu>
    </div>
  );
};

export default RecallTable;
