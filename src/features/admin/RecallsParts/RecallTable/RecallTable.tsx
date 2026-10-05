import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IRecall, TIdName } from '../../../../store/reducers/recall/types';
import { Table } from '../../../../components/tables/Table/Table';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import {
  deleteRecall,
  loadRecalls,
  setRecallOrder,
  setRecallPageData,
} from '../../../../store/reducers/recall/actions';
import { IOrder, TableRowDataType } from '../../../../types/types';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import { usePagination } from '../../../../hooks/usePaginations/usePaginations';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import {
  formatYearRange,
  getRecallDmsVehicles,
  getRecallVehicleLines,
  TRecallVehicleLine,
} from '../utils';

const renderLines = (
  lines: TRecallVehicleLine[],
  getValue: (line: TRecallVehicleLine) => string
): JSX.Element | string => {
  const values = Array.from(new Set(lines.map(getValue)));
  if (!values.length) return '-';
  return (
    <>
      {values.map(value => (
        <div key={value}>{value}</div>
      ))}
    </>
  );
};

type TRecallTableProps = {
  onOpenModal: () => void;
  currentItem: IRecall | null;
  setCurrentItem: Dispatch<SetStateAction<IRecall | null>>;
  selectedMakes: TIdName[];
};

const RecallTable: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TRecallTableProps>>
> = ({ onOpenModal, currentItem, setCurrentItem, selectedMakes }) => {
  const { recalls, recallsCount, order, searchTerm } = useSelector(
    (state: RootState) => state.recalls
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const dispatch = useDispatch();
  const showError = useException();
  const { askConfirm } = useConfirm();
  const { selectedSC } = useSCs();
  const { changeRowsPerPage, changePage, pageIndex, pageSize } = usePagination(
    (s: RootState) => s.recalls.recallPageData,
    setRecallPageData
  );

  useEffect(() => {
    if (selectedSC) {
      dispatch(
        loadRecalls(
          selectedSC.id,
          selectedMakes.length ? selectedMakes.map(make => make.id) : undefined
        )
      );
    }
  }, [selectedSC, pageIndex, pageSize, order, searchTerm, selectedMakes]);

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
      val: el => renderLines(getRecallVehicleLines(el), line => line.make?.name ?? '-'),
      orderId: 'Make',
    },
    {
      header: 'Model',
      width: 126,
      val: el => renderLines(getRecallVehicleLines(el), line => line.model?.name ?? '-'),
    },
    {
      header: 'Years',
      width: 128,
      val: el =>
        renderLines(getRecallVehicleLines(el), line => formatYearRange(line.yearFrom, line.yearTo)),
    },
    {
      header: 'DMS Vehicles',
      width: 103,
      val: el => getRecallDmsVehicles(el)?.toLocaleString() ?? '-',
    },
    {
      header: 'Recall Component',
      width: 276,
      val: el => el.recallComponent,
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

  const handleRemove = async () => {
    if (!currentItem) {
      showError('Make is not chosen');
    } else {
      if (selectedSC) {
        try {
          dispatch(deleteRecall(currentItem.id, selectedSC.id, showError));
          setCurrentItem(null);
        } catch (e) {
          showError(e);
        }
      }
    }
  };

  const askRemove = () => {
    setAnchorEl(null);
    if (!currentItem) {
      showError('Recall is not chosen');
    } else {
      let itemName = '';
      if (currentItem.recallCampaignNumber) {
        itemName =
          currentItem.recallCampaignNumber?.length < 25
            ? currentItem.recallCampaignNumber
            : currentItem.recallCampaignNumber.slice(0, 24).concat('...');
      } else if (currentItem.oemProgram) {
        itemName =
          currentItem.oemProgram?.length < 25
            ? currentItem.oemProgram
            : currentItem.oemProgram.slice(0, 24).concat('...');
      }
      askConfirm({
        isRemove: true,
        title: `Please confirm you want to remove Recall ${itemName}?`,
        onConfirm: handleRemove,
      });
    }
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
        <MenuItem onClick={askRemove}>Remove</MenuItem>
      </Menu>
    </div>
  );
};

export default RecallTable;
