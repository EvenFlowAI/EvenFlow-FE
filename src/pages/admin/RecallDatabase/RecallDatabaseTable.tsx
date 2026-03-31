import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table } from '../../../components/tables/Table/Table';
import { IGlobalRecall, OrderByField } from './types';
import { IOrder, IPageRequest, TableRowDataType } from '../../../types/types';
import { RootState } from '../../../store/rootReducer';
import { useException } from '../../../hooks/useException/useException';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { useModal } from '../../../hooks/useModal/useModal';
import ViewGlobalRecall from '../../../components/modals/admin/ViewGlobalRecall/ViewGlobalRecall';

type TProps = {
  isEdit: boolean;
  pageData: IPageRequest;
  onChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number) => void;
  onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data: IGlobalRecall[];
  setData: React.Dispatch<React.SetStateAction<IGlobalRecall[]>>;
  order: IOrder<IGlobalRecall>;
  setOrder: Dispatch<SetStateAction<IOrder<IGlobalRecall>>>;
};

const RecallDatabaseTable: React.FC<TProps> = ({
  isEdit,
  pageData,
  onChangeRowsPerPage,
  onChangePage,
  data,
  setData,
  order,
  setOrder,
}) => {
  const { isLoading, pagination } = useSelector((state: RootState) => state.recallDatabase);
  const showError = useException();
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const [recallComponentId, setRecallComponentId] = useState<number | null>(null);
  const { onOpen, isOpen, onClose } = useModal();
  const recallIdRef = useRef<number | null>(null);

  const onChangeRecallComponent = (el: IGlobalRecall, text: string) => {
    setData(prev =>
      prev.map(item => (item.id === el.id ? { ...item, recallComponentBookingFlow: text } : item))
    );
  };

  const RowData: TableRowDataType<IGlobalRecall>[] = [
    {
      header: 'Reported Date',
      width: 130,
      val: el => el.reportedDate,
      orderId: String(OrderByField.ReportedDate),
      align: 'left',
    },
    {
      header: 'NHTSA Campaign',
      width: 133,
      val: el => el.nhtsaCampaign,
      orderId: String(OrderByField.NhtsaCampaign),
      align: 'left',
    },
    {
      header: 'OEM Program',
      width: 121,
      val: el => el.oemProgram,
      orderId: String(OrderByField.OemProgram),
      align: 'left',
    },
    {
      header: 'Manufacturer',
      width: 152,
      val: el => el.manufacturer,
      orderId: String(OrderByField.Manufacturer),
      align: 'left',
    },
    {
      header: 'Impacted Vehicles',
      val: el => String(el.impactedVehicles),
      width: 119,
      orderId: String(OrderByField.ImpactedVehicles),
      align: 'left',
    },
    {
      header: 'Recall Component',
      width: 234,
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
      orderId: String(OrderByField.RecallComponent),
      align: 'left',
    },
    {
      header: 'Recall Component Booking Flow',
      width: 191,
      val: el =>
        isEdit ? (
          <TextField
            name={String(el.id)}
            value={el.recallComponentBookingFlow}
            type="text"
            onChange={e => onChangeRecallComponent(el, e.target.value)}
            id={String(el.id)}
            multiline
            rows={3}
            placeholder="Type recall text"
            sx={{ '& .MuiInputBase-input': { padding: '4px 8px' } }}
          />
        ) : el.recallComponentBookingFlow?.length > 18 ? (
          el.recallComponentBookingFlow.slice(0, 18) + '...'
        ) : (
          el.recallComponentBookingFlow
        ),
      align: 'left',
    },
  ];

  const handleSort = (data: IOrder<IGlobalRecall>) => () => {
    if (!isEdit) {
      setOrder(prev => ({ ...data, isAscending: !prev.isAscending }));
      onChangePage(null, 0);
    } else {
      showError('Sorting is not possible in the EDIT mode');
    }
  };

  const handleView = () => {
    setRecallComponentId(recallIdRef.current);
    onOpen();
    setAnchorEl(null);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setRecallComponentId(null);
  };

  const openMenu = (el: IGlobalRecall) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    recallIdRef.current = el.id;
    setAnchorEl(e.currentTarget);
  };

  const viewActions = (el: IGlobalRecall) => (
    <IconButton size="small" onClick={openMenu(el)}>
      <MoreHoriz />
    </IconButton>
  );

  return (
    <>
      <Table<IGlobalRecall>
        index="id"
        noDataTitle="No results."
        data={data}
        order={order.orderBy}
        isAscending={order.isAscending}
        rowData={RowData}
        rowsPerPage={pageData.pageSize}
        page={pageData.pageIndex}
        count={pagination.numberOfRecords}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onChangePage={onChangePage}
        onSort={handleSort}
        hidePagination={pagination.numberOfRecords < 10}
        isLoading={isLoading}
        actions={viewActions}
      />
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
        <MenuItem onClick={handleView}>View</MenuItem>
      </Menu>
      <ViewGlobalRecall open={isOpen} onClose={onClose} recallId={recallComponentId} />
    </>
  );
};

export default RecallDatabaseTable;
