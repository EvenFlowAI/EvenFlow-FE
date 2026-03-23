import React, { useEffect, useState } from 'react';
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
import { usePagination } from '../../../../hooks/usePaginations/usePaginations';
const RowData: TableRowDataType<IMake>[] = [
  {
    val: (el: IMake) => <span style={{ fontWeight: 'bold' }}>{el.name}</span>,
    header: 'Make',
    orderId: 'Name',
    width: '30%',
  },
  {
    val: (el: IMake) => el.orderIndex.toString(),
    header: 'Order',
    orderId: 'OrderIndex',
    width: '5%',
  },
  {
    val: (el: IMake) => {
      return el.models
        .map(model => {
          if (el.name === 'OTHER' && model.name === 'OTHER') {
            return model.name;
          }

          if (model.name === 'OTHER') {
            return `OTHER ${el.name}`;
          }
          return model.name;
        })
        .join(', ');
    },
    header: 'Model',
    width: '50%',
  },
];

export const MakesModelsTable: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ onOpen: TCallback }>>
> = ({ onOpen }) => {
  const {
    makes,
    currentMake,
    isLoading,
    order,
    paging: { numberOfRecords },
  } = useSelector((state: RootState) => state.vehicleDetails);
  const { changeRowsPerPage, changePage, pageIndex, pageSize } = usePagination(
    (s: RootState) => s.vehicleDetails.pageData,
    setPageData
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
        content: (
          <span>
            After removing, please check configuration settings for Packages, Service Books, Consent
            Messages, and Recalls which may have been impacted.
          </span>
        ),
        onConfirm: handleRemove,
      });
    }
  };

  const openEdit = () => {
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
        hidePagination={numberOfRecords <= pageSize}
        onChangePage={changePage}
        onChangeRowsPerPage={changeRowsPerPage}
        isLoading={isLoading}
        page={pageIndex}
        rowsPerPage={pageSize}
        count={numberOfRecords}
      />
      <Menu open={Boolean(anchorEl)} onClose={onMenuClose} anchorEl={anchorEl}>
        <MenuItem onClick={openEdit}>Edit Models</MenuItem>
        {currentMake?.isReadOnly ? null : <MenuItem onClick={askRemove}>Remove</MenuItem>}
      </Menu>
    </div>
  );
};
