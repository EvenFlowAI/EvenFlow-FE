import React, { useEffect, useState } from 'react';
import { Table } from '../../../../components/tables/Table/Table';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { IEngineType } from '../../../../store/reducers/vehicleDetails/types';
import { MoreHoriz } from '@mui/icons-material';
import { removeEngineType } from '../../../../store/reducers/vehicleDetails/actions';
import { IOrder } from '../../../../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';

import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';

export const EngineTypesTable = () => {
  const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentEngineType, setCurrentEngineType] = useState<IEngineType | null>(null);
  const [types, setTypes] = useState<IEngineType[]>([]);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const { selectedSC } = useSCs();
  const showMessage = useMessage();
  const showError = useException();
  const dispatch = useDispatch();
  const { askConfirm } = useConfirm();

  useEffect(() => {
    setTypes(engineTypes);
  }, [engineTypes]);

  const RowData = [
    {
      val: (el: IEngineType) => `${el.name}`,
      header: selectedSC?.engineTypeFieldName ?? 'Engine Type',
      orderId: 'name',
    },
  ];

  const openMenu = (el: IEngineType) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setCurrentEngineType(el);
    setAnchorEl(e.currentTarget);
  };

  const tableActions = (el: IEngineType) => {
    return (
      <IconButton onClick={openMenu(el)} size="large">
        <MoreHoriz />
      </IconButton>
    );
  };

  const onRemoveSuccess = () => {
    setCurrentEngineType(null);
    showMessage('Engine Type removed');
  };

  const handleRemove = async () => {
    if (currentEngineType && selectedSC) {
      dispatch(
        removeEngineType(currentEngineType.id, selectedSC.id, onRemoveSuccess, e => showError(e))
      );
    }
  };

  const askRemove = () => {
    setAnchorEl(null);
    if (currentEngineType) {
      askConfirm({
        isRemove: true,
        title: `Please confirm you want to remove Engine Type ${currentEngineType?.name}?`,
        onConfirm: handleRemove,
      });
    }
  };

  const handleSort = (d: IOrder<IEngineType>) => async () => {
    setIsAscending(d.isAscending);
    setTypes(prev =>
      d.isAscending ? [...prev].sort((a, b) => a.id - b.id) : [...prev].sort((a, b) => b.id - a.id)
    );
  };
  return (
    <>
      <Table
        data={types}
        index="name"
        rowData={RowData}
        actions={tableActions}
        isAscending={isAscending}
        order="value"
        onSort={handleSort}
        hidePagination
      />
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorEl={anchorEl}
      >
        <MenuItem onClick={askRemove}>Remove</MenuItem>
      </Menu>
    </>
  );
};
