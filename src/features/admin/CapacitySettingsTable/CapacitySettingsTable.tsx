import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Table } from '../../../components/tables/Table/Table';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { useModal } from '../../../hooks/useModal/useModal';
import { ICapacitySetting } from '../../../store/reducers/capacityManagement/types';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useDispatch, useSelector } from 'react-redux';
import { loadCapacitySettings } from '../../../store/reducers/capacityManagement/actions';
import { RootState } from '../../../store/rootReducer';
import { RowData } from './constants';
import ServiceBookSettingsModal from '../ServiceBookSettingsModal/ServiceBookSettingsModal';
import { loadWorkingDays } from '../../../store/reducers/serviceCenters/actions';
import { loadHoursOfOperations } from '../../../store/reducers/appointmentFrameReducer/actions';
import { ServiceBookModal } from '../ServiceBookModal/ServiceBookModal';
import { setPodById } from '../../../store/reducers/pods/actions';
import { useException } from '../../../hooks/useException/useException';

const CapacitySettingsTable = () => {
  const { capacitySettings } = useSelector((state: RootState) => state.capacityManagement);
  const [editedItem, setEditedItem] = useState<ICapacitySetting | null>(null);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const {
    isOpen: isConfigureOpen,
    onOpen: onConfigureOpen,
    onClose: onConfigureClose,
  } = useModal();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useModal();
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const showError = useException();

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadCapacitySettings(selectedSC.id, dayjs().format('dddd'), showError));
      dispatch(loadWorkingDays(selectedSC.id));
      dispatch(loadHoursOfOperations(selectedSC.id));
    }
  }, [selectedSC]);

  const openMenu =
    (el: ICapacitySetting) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setEditedItem(el);
      setAnchorEl(e.currentTarget);
    };

  const menuActions = (el: ICapacitySetting) => (
    <IconButton size="small" onClick={openMenu(el)}>
      <MoreHoriz />
    </IconButton>
  );

  const closeMenu = () => {
    setEditedItem(null);
    setAnchorEl(null);
  };

  const handleConfigure = () => {
    onConfigureOpen();
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    onEditOpen();
  };

  const onCloseConfigureModal = () => {
    onConfigureClose();
    dispatch(setPodById(null));
    if (selectedSC)
      dispatch(loadCapacitySettings(selectedSC.id, dayjs().format('dddd'), showError));
  };

  return (
    <div>
      <Table<ICapacitySetting>
        data={capacitySettings}
        index="serviceBookId"
        rowData={RowData}
        noDataTitle={'No Service Books present'}
        actions={menuActions}
        hidePagination
      />
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
        <MenuItem onClick={handleConfigure} disabled={!editedItem?.serviceBookId}>
          Configure
        </MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
      </Menu>
      <ServiceBookSettingsModal open={isEditOpen} onClose={onEditClose} editingItem={editedItem} />
      <ServiceBookModal
        open={isConfigureOpen}
        editingItemId={editedItem?.serviceBookId}
        onClose={onCloseConfigureModal}
        isActive={true}
      />
    </div>
  );
};

export default CapacitySettingsTable;
