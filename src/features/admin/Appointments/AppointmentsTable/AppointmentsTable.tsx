import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Table } from '../../../../components/tables/Table/Table';
import { EReportingStatus, IAppointment } from '../../../../api/types';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { ViewAppointmentsModal } from '../ViewAppointmentsModal/ViewAppointmentsModal';
import { API } from '../../../../api/api';
import { MoreHoriz } from '@mui/icons-material';
import { IOrder, IPageRequest, TCallback } from '../../../../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useModal } from '../../../../hooks/useModal/useModal';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { getAppointmentDate } from './utils';
import dayjs from 'dayjs';

import { AppointmentsColumns } from '../constants';
import NoAppointments from '../NoAppointments/NoAppointments';

type TAppointmentsTable = {
  refresh: TCallback;
  order: IOrder<IAppointment>;
  setOrder: React.Dispatch<React.SetStateAction<IOrder<IAppointment>>>;
  onChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number) => void;
  onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pageData: IPageRequest;
  isLoading: boolean;
  selectedColumns: string[];
  viewItem?: IAppointment | undefined;
  setViewItem?: Dispatch<SetStateAction<IAppointment | undefined>>;
};

export const AppointmentsTable: React.FC<TAppointmentsTable> = ({
  viewItem,
  setViewItem,
  isLoading,
  refresh,
  setOrder,
  order,
  pageData,
  onChangeRowsPerPage,
  onChangePage,
  selectedColumns,
}) => {
  const { appointments, count } = useSelector((state: RootState) => state.appointments);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { isOpen, onClose, onOpen } = useModal();
  const showMessage = useMessage();
  const showError = useException();
  const { askConfirm } = useConfirm();

  const handleOpen = (el: IAppointment) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setViewItem && setViewItem(el);
    setAnchorEl(e.currentTarget);
  };

  const handleView = () => {
    setAnchorEl(null);
    onOpen();
  };

  const openInNewTabForEdit = async () => {
    if (viewItem?.hashKey) {
      const url = window.location.href.replace(
        '/admin/appointments',
        `/appointment-update/${viewItem.hashKey}?fromAdmin=true`
      );
      window.open(url, '_blank', 'noreferrer');
    }
  };

  const openInNewTabForClone = async () => {
    if (viewItem?.hashKey) {
      const url = window.location.href.replace(
        '/admin/appointments',
        `/appointment-clone/${viewItem.hashKey}/by-key`
      );
      window.open(url, '_blank', 'noreferrer');
    }
  };

  const handleEdit = async () => {
    setAnchorEl(null);
    await openInNewTabForEdit();
  };

  const handleClone = async () => {
    setAnchorEl(null);
    await openInNewTabForClone();
  };

  const handleCancel = useCallback(() => {
    setAnchorEl(null);
    if (viewItem?.reportingStatus === EReportingStatus.Cancelled) {
      showError('Appointment is already canceled');
    } else {
      if (viewItem) {
        askConfirm({
          isRemove: true,
          confirmContent: 'Cancel appointment',
          title: 'Cancel appointment',
          content: (
            <span>
              Please confirm you want to cancel appointment on{' '}
              {dayjs.utc(viewItem.dateTime).format('LLL')}?
            </span>
          ),
          onConfirm: _handleCancel,
        });
      }
    }
  }, [viewItem, showError, askConfirm, getAppointmentDate]);

  const _handleCancel = async () => {
    if (viewItem) {
      try {
        await API.appointment.cancel(viewItem.id);
        setViewItem && setViewItem(undefined);
        showMessage('Canceled');
        refresh();
      } catch (e) {
        showError(e);
      }
    }
  };

  const handleEditCallback = () => {
    onClose();
    handleEdit();
  };

  const handleCloneCallback = () => {
    onClose();
    handleClone();
  };

  const handleCancelCallback = () => {
    onClose();
    handleCancel();
  };

  const actions = (el: IAppointment) => {
    return (
      <IconButton size="small" onClick={handleOpen(el)}>
        <MoreHoriz />
      </IconButton>
    );
  };

  const handleSort = (data: IOrder<IAppointment>) => () => {
    setOrder(data);
  };

  return appointments.length ? (
    <>
      <Table<IAppointment>
        data={appointments}
        onSort={handleSort}
        order={order.orderBy}
        isAscending={order.isAscending}
        isLoading={isLoading}
        rowData={AppointmentsColumns.filter(col => selectedColumns.includes(col.header.toString()))}
        hidePagination={count < 11}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        page={pageData.pageIndex}
        rowsPerPage={pageData.pageSize}
        count={count}
        index="id"
        actions={actions}
      />
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleView}>View</MenuItem>
        <MenuItem
          disabled={
            viewItem?.reportingStatus === EReportingStatus.Cancelled || !viewItem?.isEditable
          }
          onClick={handleEdit}
        >
          Edit
        </MenuItem>
        <MenuItem
          disabled={
            viewItem?.reportingStatus === EReportingStatus.Cancelled || !viewItem?.isEditable
          }
          onClick={handleCancel}
        >
          Cancel
        </MenuItem>
      </Menu>
      <ViewAppointmentsModal
        onEditAppointment={handleEditCallback}
        onCloneAppointment={handleCloneCallback}
        onCancelAppointment={handleCancelCallback}
        open={isOpen}
        refresh={refresh}
        payload={viewItem}
        onClose={onClose}
      />
    </>
  ) : (
    <NoAppointments />
  );
};
