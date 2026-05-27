import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  getRecallEvents,
  setRecallAlertsOrder,
  setRecallAlertsPageData,
} from '../../../../../store/reducers/recall/actions';
import { IRecallAlert } from '../../../../../store/reducers/recall/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useException } from '../../../../../hooks/useException/useException';
import { useConfirm } from '../../../../../hooks/useConfirm/useConfirm';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { usePagination } from '../../../../../hooks/usePaginations/usePaginations';
import { IOrder, TableRowDataType, TOption } from '../../../../../types/types';
import { IconButton, Menu, MenuItem, Switch, Tooltip } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { Table } from '../../../../../components/tables/Table/Table';
import Status from './layouts/Status';
import ConfirmationBadge from './layouts/ConfirmationBadge';
import { RecallEventStatus } from '../types';

type TRecallTableProps = {
  onOpenModal: () => void;
  currentItem: IRecallAlert | null;
  setCurrentItem: Dispatch<SetStateAction<IRecallAlert | null>>;
  selectedStatus: TOption;
};

const WorkflowTable: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TRecallTableProps>>
> = ({ onOpenModal, currentItem, setCurrentItem, selectedStatus }) => {
  const { recallAlerts, recallAlertsCount, recallAlertsOrder } = useSelector(
    (state: RootState) => state.recalls
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch();
  const showError = useException();
  const { askConfirm } = useConfirm();
  const { selectedSC } = useSCs();
  const { changeRowsPerPage, changePage, pageIndex, pageSize } = usePagination(
    (s: RootState) => s.recalls.recallAlertsPageData,
    setRecallAlertsPageData
  );

  useEffect(() => {
    if (selectedSC) {
      dispatch(
        getRecallEvents(
          selectedSC.id,
          () => {},
          () => {}
        )
      );
    }
  }, [selectedSC, pageIndex, pageSize, recallAlertsOrder, selectedStatus]);

  const rowData: TableRowDataType<IRecallAlert>[] = [
    {
      header: 'Alert Name',
      val: el => el.name,
      orderId: 'Name',
    },
    {
      header: 'NHTSA Campaign',
      val: el => el.nhtsaCampaign,
      orderId: 'NhtsaCampaign',
    },
    {
      header: 'Recall Component',
      width: '240px',
      val: el => {
        const text = el.recallComponent ?? '';
        return text.length > 20 ? (
          <Tooltip placement="top" title={text}>
            <p style={{ cursor: 'pointer', userSelect: 'none' }}>{text.slice(0, 20) + '...'}</p>
          </Tooltip>
        ) : (
          text
        );
      },
      orderId: 'RecallComponent',
    },
    {
      header: 'Audience',
      val: el => <ConfirmationBadge isConfirmed={el.status !== RecallEventStatus.NotConfigured} />,
    },
    {
      header: 'Generate List',
      val: el => (el.listType === 0 ? 'VIN Check (API)' : el.listType === 1 ? 'CSV Uploaded' : ''),
    },
    {
      header: 'Text',
      val: el => (
        <ConfirmationBadge isConfirmed={el.communicationDetails?.textMessage.length > 0} />
      ),
    },
    {
      header: 'Active',
      val: el => (
        <Switch
          disabled={true}
          onClick={() => () => {}}
          checked={el.communicationDetails?.textMessage?.length > 0}
          color="primary"
        />
      ),
    },
    {
      header: 'Status',
      val: el => <Status status={el.status} />,
      orderId: 'Status',
    },
  ];

  const openMenu = (el: IRecallAlert) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setCurrentItem(el);
    setAnchorEl(e.currentTarget);
  };

  const tableActions = (el: IRecallAlert) => {
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
          // dispatch(deleteRecall(currentItem.id, selectedSC.id, showError));
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
      const itemName = '';
      askConfirm({
        isRemove: true,
        title: `Please confirm you want to remove Recall ${itemName}?`,
        onConfirm: handleRemove,
      });
    }
  };

  const onSort = (o: IOrder<IRecallAlert>) => () => {
    dispatch(setRecallAlertsOrder(o));
  };

  const onMenuClose = () => {
    setAnchorEl(null);
    setCurrentItem(null);
  };

  return (
    <div>
      <Table<IRecallAlert>
        data={recallAlerts}
        index={'id'}
        isAscending={recallAlertsOrder.isAscending}
        order={recallAlertsOrder?.orderBy}
        onSort={onSort}
        rowData={rowData}
        actions={tableActions}
        rowsPerPage={pageSize}
        page={pageIndex}
        onChangePage={changePage}
        onChangeRowsPerPage={changeRowsPerPage}
        count={recallAlertsCount}
        hidePagination={recallAlertsCount < 11}
      />
      <Menu open={Boolean(anchorEl)} onClose={onMenuClose} anchorEl={anchorEl}>
        <MenuItem onClick={openEdit}>Edit</MenuItem>
        <MenuItem onClick={() => {}}>View History</MenuItem>
        <MenuItem onClick={askRemove}>Remove</MenuItem>
      </Menu>
    </div>
  );
};

export default WorkflowTable;
