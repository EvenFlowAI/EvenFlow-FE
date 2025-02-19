import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteMake,
  setCurrentMake,
  setMakeOrder,
  setPageData,
} from '../../../../store/reducers/vehicleDetails/actions';
import { RootState } from '../../../../store/rootReducer';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { IMake } from '../../../../api/types';
import { Table } from '../../../../components/tables/Table/Table';
import { MoreHoriz } from '@mui/icons-material';
import { TableRowDataType, TCallback, IOrder } from '../../../../types/types';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';

import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { truncateMakes } from './utils';

const RowData: TableRowDataType<IMake>[] = [
  {
    val: (el: IMake) => <span style={{ fontWeight: 'bold' }}>{el.name}</span>,
    header: 'Make',
    orderId: 'Name',
  },
  {
    val: (el: IMake) => el.orderIndex.toString(),
    header: 'Order',
    orderId: 'OrderIndex',
  },
  { val: (el: IMake) => el.models.map(model => model.name).join(', '), header: 'Model' },
];

export const MakesModelsTable: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ onOpen: TCallback }>>
> = ({ onOpen }) => {
  const { makes, currentMake, isLoading, order, pageData } = useSelector(
    (state: RootState) => state.vehicleDetails
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tableData, setTableData] = useState<IMake[]>([]);
  const dispatch = useDispatch();
  const showMessage = useMessage();
  const showError = useException();
  const { selectedSC } = useSCs();
  const { askConfirm } = useConfirm();

  useEffect(() => {
    if (makes) setTableData(truncateMakes(makes));
  }, [makes]);

  const openMenu = (el: IMake) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(setCurrentMake(el));
    setAnchorEl(e.currentTarget);
  };

  const tableActions = (el: IMake) => {
    return (
      <IconButton onClick={openMenu(el)} size="large">
        <MoreHoriz />
      </IconButton>
    );
  };

  const handleRemove = async () => {
    if (!currentMake) {
      showError('Make is not chosen');
    } else {
      try {
        if (currentMake.id) dispatch(deleteMake(currentMake.id));
        showMessage('Make removed');
        dispatch(setCurrentMake(null));
      } catch (e) {
        showError(e);
      }
    }
  };

  const askRemove = () => {
    setAnchorEl(null);
    if (!currentMake) {
      showError('Make is not chosen');
    } else {
      if (currentMake.isReadOnly) {
        showError('You cannot remove a read-only make');
        return;
      }
      askConfirm({
        isRemove: true,
        title:
          currentMake.id === selectedSC?.defaultVehicleMakeId
            ? `The Make ${currentMake.name} is selected as a default. Please confirm that you want to remove make ${currentMake.name}`
            : `Please confirm that you want to remove make ${currentMake.name}`,
        onConfirm: handleRemove,
      });
    }
  };

  const openEdit = () => {
    if (currentMake?.isReadOnly) {
      showError('You cannot edit a read-only make');
      return;
    }
    setAnchorEl(null);
    onOpen();
  };

  const onMenuClose = () => {
    setAnchorEl(null);
    dispatch(setCurrentMake(null));
  };

  const handleSort = (d: IOrder<IMake>) => () => {
    dispatch(setMakeOrder(d));
  };

  const onChangePage = useCallback(
    (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number) => {
      console.log('onChangePage', pageIndex);
      dispatch(setPageData({ pageIndex, pageSize: pageData.pageSize }));
    },
    [dispatch, pageData.pageSize]
  );

  const onChangeRowsPerPage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('onChangeRowsPerPage', e.target.value);
      dispatch(setPageData({ pageIndex: 0, pageSize: parseInt(e.target.value) }));
    },
    [dispatch]
  );

  return (
    <div>
      <Table
        order={order.orderBy}
        onSort={handleSort}
        isAscending={order.isAscending}
        data={tableData}
        index="name"
        rowData={RowData}
        actions={tableActions}
        hidePagination={false}
        isLoading={isLoading}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        page={pageData.pageIndex}
        rowsPerPage={pageData.pageSize}
        count={pageData.pageSize}
      />
      <Menu open={Boolean(anchorEl)} onClose={onMenuClose} anchorEl={anchorEl}>
        <MenuItem onClick={openEdit}>Edit</MenuItem>
        <MenuItem onClick={askRemove}>Remove</MenuItem>
      </Menu>
    </div>
  );
};
