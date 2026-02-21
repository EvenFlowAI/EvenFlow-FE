import React, { useEffect, useState } from 'react';
import { IUserAccount, statusLabels } from './types';
import { AccountsTable } from '../../../components/tables/AccountsTable/AccountsTable';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { TableAvatarAccounts } from '../../../components/wrappers/TableAvatar/TableAvatarAccounts';
import { IOrder, TableRowDataType } from '../../../types/types';
import { RenderDealershipsAccordion } from './RenderDealershipsAccordion';
import { TUserAccountForm } from '../../../components/modals/admin/AddUserAccount/types';

interface UsersTableProps {
  editedItem: TUserAccountForm | null;
  setEditedItem: React.Dispatch<React.SetStateAction<TUserAccountForm | null>>;
  data: IUserAccount[];
  isLoading: boolean;
  openEdit: (edit: boolean) => void;
}

const UsersTable = ({ data, isLoading, setEditedItem, editedItem, openEdit }: UsersTableProps) => {
  const [visibleData, setVisibleData] = useState<IUserAccount[]>([]);
  const [pageData, setPageData] = useState({ pageIndex: 0, pageSize: 10 });
  const [order, setOrder] = useState<IOrder<IUserAccount>>({
    orderBy: 'fullName',
    isAscending: true,
  });
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);

  useEffect(() => {
    const sortedData = [...data];

    if (order.orderBy) {
      const orderBy = order.orderBy as keyof IUserAccount;

      sortedData.sort((a, b) => {
        const aVal = String(a[orderBy] ?? '');
        const bVal = String(b[orderBy] ?? '');
        if (aVal < bVal) return order.isAscending ? -1 : 1;
        if (aVal > bVal) return order.isAscending ? 1 : -1;
        return 0;
      });
    }

    const start = pageData.pageIndex * pageData.pageSize;
    const end = start + pageData.pageSize;

    setVisibleData(sortedData.slice(start, end));
  }, [data, pageData, order]);

  const rowData: TableRowDataType<IUserAccount>[] = [
    { val: el => el.fullName, header: 'Name', orderId: 'fullName' },
    {
      val: el => <RenderDealershipsAccordion dealerships={el.dealerships} isSc={false} />,
      header: 'Dealership Group',
    },
    {
      val: el => <RenderDealershipsAccordion dealerships={el.dealerships} isSc={true} />,
      header: 'Service Center',
      width: 350,
    },

    { val: el => el.role, header: 'Role', orderId: 'role', width: 150 },
    { val: el => statusLabels[el.status], header: 'Status', orderId: 'status', width: 100 },
  ];

  const changePage = (e: React.MouseEvent<Element, MouseEvent> | null, pageNumber: number) => {
    setPageData(prev => ({ ...prev, pageIndex: pageNumber }));
  };

  const changeRowsPerPage: React.ChangeEventHandler<HTMLInputElement> = e => {
    setPageData({ pageSize: +e.target.value, pageIndex: 0 });
  };

  const handleSort = (newOrder: IOrder<IUserAccount>) => () => {
    setOrder(newOrder);
  };

  const closeMenu = () => {
    setEditedItem(null);
    setAnchorEl(null);
  };

  const openMenu = (el: IUserAccount) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setEditedItem({
      id: el.id,
      status: el.status,
      emailConfirmed: el.emailConfirmed,
      avatarPath: el.avatarPath,
      firstName: el.firstName,
      email: el.email,
      role: el.role,
      lastName: el.lastName,
      dealerships: el.dealerships.map(d => ({
        name: d.name,
        value: d.id,
      })),
      serviceCenters: el.dealerships.flatMap(d =>
        d.serviceCenters.map(sc => ({
          name: sc.name,
          value: sc.id,
          categoryName: d.name,
          categoryId: d.id,
          dmsId: sc.dmsId ?? null,
          position: sc.position ?? '',
          displayOnBookingTypes: sc.displayOnBookingTypes,
          type: sc.type ?? null,
          // решта полів можна залишити пустими або дефолтними
          hourlyRate: sc.details?.hourlyRate,
          overtimeRate: sc.details?.overtimeRate,
          technicianLevel: sc.details?.skillLevel,
        }))
      ),
    });
    setAnchorEl(e.currentTarget);
  };

  const viewActions = (el: IUserAccount) => (
    <IconButton size="small" onClick={openMenu(el)}>
      <MoreHoriz />
    </IconButton>
  );

  const handleRemove = async () => {
    if (!editedItem) return;
    console.log(editedItem);
  };

  const handleEdit = async () => {
    if (!editedItem) return;
    setAnchorEl(null);
    openEdit(true);
  };

  const handleResend = async () => {
    if (!editedItem) return;
    console.log(editedItem);
  };

  const startActions = (el: IUserAccount) => (
    <TableAvatarAccounts name={el.fullName} src={el.avatarPath} />
  );

  return (
    <>
      <AccountsTable<IUserAccount>
        data={visibleData}
        order={order.orderBy}
        onSort={handleSort}
        isAscending={order.isAscending}
        noDataTitle={
          !isLoading
            ? 'No users were found. Please try changing the filters or search criteria'
            : ''
        }
        isLoading={isLoading}
        rowData={rowData}
        onChangePage={changePage}
        onChangeRowsPerPage={changeRowsPerPage}
        count={data.length}
        page={pageData.pageIndex}
        rowsPerPage={pageData.pageSize}
        index="id"
        startActions={startActions}
        actions={viewActions}
      />
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={closeMenu}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleRemove}>Remove</MenuItem>
        <MenuItem onClick={handleResend}>Resend</MenuItem>
      </Menu>
    </>
  );
};

export default UsersTable;
