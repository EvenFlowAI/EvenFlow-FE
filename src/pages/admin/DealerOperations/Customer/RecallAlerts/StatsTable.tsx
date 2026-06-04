import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  deleteRecallAlert,
  getRecallEvents,
  setIsRecallAlertsTableLoading,
  setRecallAlertsOrderStats,
  setRecallAlertsPageData,
  setSelectedRecallAlert,
  setUpdatedAlerts,
} from '../../../../../store/reducers/recall/actions';
import { IRecallAlert } from '../../../../../store/reducers/recall/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useException } from '../../../../../hooks/useException/useException';
import { useConfirm } from '../../../../../hooks/useConfirm/useConfirm';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { usePagination } from '../../../../../hooks/usePaginations/usePaginations';
import { IOrder, TableRowDataType } from '../../../../../types/types';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { Table } from '../../../../../components/tables/Table/Table';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';

type TRecallTableProps = {
  currentItem: IRecallAlert | null;
  setCurrentItem: Dispatch<SetStateAction<IRecallAlert | null>>;
  onOpenHistory: () => void;
};

const StatsTable: React.FC<React.PropsWithChildren<React.PropsWithChildren<TRecallTableProps>>> = ({
  currentItem,
  setCurrentItem,
  onOpenHistory,
}) => {
  const {
    recallAlerts,
    recallAlertsCount,
    recallAlertsOrderStats,
    updatedAlerts,
    isEditName,
    selectedStatus,
    isRecallAlertsTableLoading,
  } = useSelector((state: RootState) => state.recalls);
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
    if (selectedSC && !isEditName) {
      dispatch(
        getRecallEvents(
          selectedSC.id,
          'stats',
          () => {},
          () => {}
        )
      );
    }
  }, [selectedSC, pageIndex, pageSize, recallAlertsOrderStats, selectedStatus]);

  const handleNameChange = (value: string, id: number) => {
    dispatch(
      setUpdatedAlerts(
        updatedAlerts.map(ev => {
          if (ev.id === id && value.length < 51) {
            return { ...ev, name: value };
          }
          return ev;
        })
      )
    );
  };

  const rowData: TableRowDataType<IRecallAlert>[] = [
    {
      header: 'Alert Name',
      val: el => {
        if (isEditName) {
          return (
            <TextField
              fullWidth
              value={updatedAlerts.find(e => el.id === e.id)?.name}
              onChange={e => handleNameChange(e.target.value, el.id)}
              id={`recall-alert-name-${el.id}`}
              multiline
              rows={2}
              placeholder="Type recall name"
              sx={{ '& .MuiInputBase-input': { padding: '4px 8px' } }}
            />
          );
        }

        const text = el.name ?? '';
        return text.length > 20 ? (
          <Tooltip placement="top" title={text}>
            <p style={{ cursor: 'pointer', userSelect: 'none' }}>{text.slice(0, 20) + '...'}</p>
          </Tooltip>
        ) : (
          text
        );
      },
      orderId: 'Name',
      width: 200,
    },
    {
      header: 'NHTSA Campaign',
      width: 143,
      val: el => el.nhtsaCampaign,
      orderId: 'NhtsaCampaign',
    },
    {
      header: 'Recall Component',
      width: 209,
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
      header: 'Vehicles In DMS',
      val: el => (el.vehiclesInDms >= 0 ? String(el.vehiclesInDms) : ''),
      orderId: 'VehiclesNumber',
    },
    {
      header: 'Credits Used',
      val: el => (el.creditsUsed >= 0 ? String(el.creditsUsed) : ''),
      width: 151,
      orderId: 'CreditsUsed',
    },
    {
      header: 'Est. Recipients',
      val: el => (el.estimatedRecipients >= 0 ? String(el.estimatedRecipients) : ''),
      orderId: 'EstimatedRecipientsNumber',
    },
    {
      header: 'Actual Recipients',
      val: el => (el.actualRecipients >= 0 ? String(el.actualRecipients) : ''),
      orderId: 'EstimatedRecipientsNumber',
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
    dispatch(setSelectedRecallAlert(currentItem));
  };

  const handleRemove = async () => {
    if (!currentItem) {
      showError('Make is not chosen');
    } else {
      if (selectedSC) {
        try {
          dispatch(
            deleteRecallAlert(
              selectedSC.id,
              currentItem.id,
              'stats',
              () => {
                dispatch(setIsRecallAlertsTableLoading(false));
              },
              showError
            )
          );
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
      showError('Recall alert is not chosen');
    } else {
      const itemName = currentItem.name;
      askConfirm({
        isRemove: true,
        title: `Please confirm you want to remove ${itemName}?`,
        onConfirm: handleRemove,
      });
    }
  };

  const onSort = (o: IOrder<IRecallAlert>) => () => {
    dispatch(setRecallAlertsOrderStats(o));
  };

  const onMenuClose = () => {
    setAnchorEl(null);
    setCurrentItem(null);
  };

  const viewHistory = () => {
    setAnchorEl(null);
    onOpenHistory();
  };

  return (
    <div>
      <Table<IRecallAlert>
        data={recallAlerts}
        index={'id'}
        isAscending={recallAlertsOrderStats.isAscending}
        order={recallAlertsOrderStats?.orderBy}
        onSort={onSort}
        rowData={rowData}
        actions={tableActions}
        rowsPerPage={pageSize}
        page={pageIndex}
        onChangePage={changePage}
        onChangeRowsPerPage={changeRowsPerPage}
        count={recallAlertsCount}
        hidePagination={recallAlertsCount < 11}
        isLoading={isRecallAlertsTableLoading}
      />
      <Menu open={Boolean(anchorEl)} onClose={onMenuClose} anchorEl={anchorEl}>
        <MenuItem onClick={openEdit}>Edit</MenuItem>
        <MenuItem onClick={viewHistory}>View History</MenuItem>
        <MenuItem onClick={askRemove}>Remove</MenuItem>
      </Menu>
    </div>
  );
};

export default StatsTable;
