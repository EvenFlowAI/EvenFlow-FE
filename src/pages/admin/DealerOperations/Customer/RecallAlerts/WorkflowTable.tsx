/* eslint-disable max-lines */

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  deleteRecallAlert,
  getRecallEvents,
  setIsRecallAlertsTableLoading,
  setRecallAlertSettingsEditMode,
  setRecallAlertsOrderWorkflow,
  setRecallAlertsPageData,
  setSelectedRecallAlert,
  setUpdatedAlerts,
  updateRecallAlert,
} from '../../../../../store/reducers/recall/actions';
import { IRecallAlert, RecallListType } from '../../../../../store/reducers/recall/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useException } from '../../../../../hooks/useException/useException';
import { useConfirm } from '../../../../../hooks/useConfirm/useConfirm';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { usePagination } from '../../../../../hooks/usePaginations/usePaginations';
import { IOrder, TableRowDataType } from '../../../../../types/types';
import { IconButton, Menu, MenuItem, Switch, Tooltip } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { Table } from '../../../../../components/tables/Table/Table';
import Status from './layouts/Status';
import ConfirmationBadge from './layouts/ConfirmationBadge';
import { RecallEventStatus } from '../types';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { CSV_UPLOADED, VIN_CHECK_API } from '../../helper';

type TRecallTableProps = {
  currentItem: IRecallAlert | null;
  setCurrentItem: Dispatch<SetStateAction<IRecallAlert | null>>;
  onOpenText: () => void;
  onOpenHistory: () => void;
};

const WorkflowTable: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TRecallTableProps>>
> = ({ currentItem, setCurrentItem, onOpenText, onOpenHistory }) => {
  const {
    recallAlerts,
    recallAlertsCount,
    recallAlertsOrderWorkflow,
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
  const { textIntegrationSettings } = useSelector((state: RootState) => state.dealerOperations);
  const { changeRowsPerPage, changePage, pageIndex, pageSize } = usePagination(
    (s: RootState) => s.recalls.recallAlertsPageData,
    setRecallAlertsPageData
  );

  useEffect(() => {
    if (selectedSC && !isEditName) {
      dispatch(
        getRecallEvents(
          selectedSC.id,
          'workflow',
          () => {},
          () => {}
        )
      );
    }
  }, [selectedSC, pageIndex, pageSize, recallAlertsOrderWorkflow, selectedStatus]);

  const handleNameChange = (value: string, id: number) => {
    dispatch(
      setUpdatedAlerts(
        updatedAlerts.map(ev => {
          if (ev.id === id && value.length < 51) {
            return {
              ...ev,
              name: value,
              recallCampaignId: ev.recallCampaignId,
              listType: ev.listType,
            };
          }
          return ev;
        })
      )
    );
  };

  const isRecallAlertActive = (el: IRecallAlert): boolean => {
    if (!el.triggers?.length) {
      return false;
    }

    return el.triggers.every(trigger => trigger.isPaused === false);
  };

  const handleActiveChange = (recallAlert: IRecallAlert, nextChecked: boolean) => {
    if (!selectedSC || !recallAlert) {
      return;
    }

    dispatch(
      updateRecallAlert(
        {
          id: recallAlert.id,
          serviceCenterId: selectedSC.id,
          triggers: (recallAlert.triggers || []).map(trigger => ({
            ...trigger,
            isPaused: !nextChecked,
          })),
        },
        () => {},
        undefined,
        showError
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
      header: 'Audience',
      val: el => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentItem(el);
            dispatch(setRecallAlertSettingsEditMode(false));
            dispatch(setSelectedRecallAlert(el));
          }}
        >
          <ConfirmationBadge isConfirmed={el.status !== RecallEventStatus.NotConfigured} />
        </div>
      ),
    },
    {
      header: 'Generate List',
      val: el =>
        el.listType === RecallListType.VIN_CHECK_API
          ? VIN_CHECK_API
          : el.listType === RecallListType.UPLOAD_CSV
            ? CSV_UPLOADED
            : '',
    },
    {
      header: 'Text',
      val: el => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentItem(el);
            onOpenText();
          }}
        >
          <ConfirmationBadge
            isConfirmed={Boolean(
              el.communicationDetails?.textMessage?.length &&
              textIntegrationSettings?.fromPhoneNumber?.length
            )}
          />
        </div>
      ),
    },
    {
      header: 'Active',
      val: el => (
        <Switch
          disabled={
            el.status !== RecallEventStatus.ResultsAvailable ||
            !el.triggers?.length ||
            !el.communicationDetails?.textMessage?.length ||
            !textIntegrationSettings?.fromPhoneNumber?.length
          }
          checked={isRecallAlertActive(el)}
          onChange={(_, checked) => handleActiveChange(el, checked)}
          color="primary"
        />
      ),
    },
    {
      header: 'Status',
      val: el => <Status status={el.status} />,
      width: '142px',
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
    if (!currentItem) {
      dispatch(setRecallAlertSettingsEditMode(false));
      return;
    }
    dispatch(setRecallAlertSettingsEditMode(true));
    dispatch(setSelectedRecallAlert(currentItem));
  };

  const viewHistory = () => {
    setAnchorEl(null);
    onOpenHistory();
  };

  const handleRemove = async () => {
    if (!currentItem) {
      showError('Recall Alert is not chosen');
    } else {
      if (selectedSC) {
        try {
          dispatch(
            deleteRecallAlert(
              selectedSC.id,
              currentItem.id,
              'workflow',
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
    dispatch(setRecallAlertsOrderWorkflow(o));
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
        isAscending={recallAlertsOrderWorkflow.isAscending}
        order={recallAlertsOrderWorkflow?.orderBy}
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
        customPaginationData
      />
      <Menu open={Boolean(anchorEl)} onClose={onMenuClose} anchorEl={anchorEl}>
        <MenuItem onClick={openEdit}>Edit</MenuItem>
        <MenuItem onClick={viewHistory}>View History</MenuItem>
        <MenuItem disabled={currentItem?.status === RecallEventStatus.Running} onClick={askRemove}>
          Remove
        </MenuItem>
      </Menu>
    </div>
  );
};

export default WorkflowTable;
