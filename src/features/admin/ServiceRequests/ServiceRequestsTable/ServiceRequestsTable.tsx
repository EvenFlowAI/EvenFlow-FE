import React, { Dispatch, SetStateAction, useState } from 'react';
import { Table } from '../../../../components/tables/Table/Table';
import { IAssignedServiceRequest } from '../../../../store/reducers/serviceRequests/types';
import { IconButton, Menu, MenuItem } from '@mui/material';
import {
  loadAssignedServiceRequests,
  setAssignedOrdering,
} from '../../../../store/reducers/serviceRequests/actions';
import { SC_UNDEFINED } from '../../../../utils/constants';
import { IOrder, TCallback } from '../../../../types/types';
import { MoreHoriz } from '@mui/icons-material';
import { RootState } from '../../../../store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';

import { useMessage } from '../../../../hooks/useMessage/useMessage';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { Api } from '../../../../api/ApiEndpoints/ApiEndpoints';
import { RowData } from './constants';

type TProps = {
  setEditedItem: Dispatch<SetStateAction<IAssignedServiceRequest | undefined>>;
  onOOpen: TCallback;
  editedItem: IAssignedServiceRequest | undefined;
  pageSize: number;
  pageIndex: number;
  changePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageNumber: number) => void;
  changeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ServiceRequestsTable: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({
  setEditedItem,
  onOOpen,
  editedItem,
  pageSize,
  pageIndex,
  changePage,
  changeRowsPerPage,
}) => {
  const {
    assignedList,
    assignedLoading,
    assignedPaging: { numberOfRecords },
    assignedOrdering,
  } = useSelector(({ serviceRequests }: RootState) => serviceRequests);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { selectedSC } = useSCs();

  const dispatch = useDispatch();
  const showError = useException();
  const showMessage = useMessage();
  const { askConfirm } = useConfirm();

  const handleOpenMenu =
    (el: IAssignedServiceRequest) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setEditedItem(el);
      setAnchorEl(e.currentTarget);
    };

  const actions = (el: IAssignedServiceRequest) => {
    return (
      <IconButton onClick={handleOpenMenu(el)} size="large">
        <MoreHoriz />
      </IconButton>
    );
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setEditedItem(undefined);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    onOOpen();
  };

  const handleSort = (o: IOrder<IAssignedServiceRequest>) => () => {
    dispatch(setAssignedOrdering(o));
  };

  const handleRemove = async () => {
    if (selectedSC && editedItem) {
      try {
        await Api.call(Api.endpoints.ServiceRequests.RemoveOverride, {
          urlParams: { id: editedItem.id },
        }).then(res => {
          if (res) showMessage('Service Request removed.');
        });
        setEditedItem(undefined);
        dispatch(loadAssignedServiceRequests(selectedSC.id));
      } catch (e) {
        showError(e);
      }
    } else {
      showError(SC_UNDEFINED);
    }
  };

  const askRemove = () => {
    setAnchorEl(null);
    askConfirm({
      isRemove: true,
      title: `Please confirm you want to remove Op Code ${editedItem?.serviceRequest.code}`,
      onConfirm: handleRemove,
    });
  };

  return (
    <>
      <Table<IAssignedServiceRequest>
        data={assignedList}
        order={assignedOrdering.orderBy}
        isAscending={assignedOrdering.isAscending}
        onSort={handleSort}
        index="id"
        rowData={RowData}
        rowsPerPage={pageSize}
        page={pageIndex}
        onChangePage={changePage}
        onChangeRowsPerPage={changeRowsPerPage}
        count={numberOfRecords}
        hidePagination={numberOfRecords < 11}
        actions={actions}
        isLoading={assignedLoading}
      />
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={askRemove}>Remove</MenuItem>
      </Menu>
    </>
  );
};
