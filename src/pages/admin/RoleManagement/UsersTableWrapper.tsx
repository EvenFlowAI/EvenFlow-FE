import React, { useEffect, useState } from 'react';
import { IUserAccount, statusLabels, UserStatus } from './types';
import { UsersTable } from '../../../components/tables/UsersTable/UsersTable';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { TableAvatarAccounts } from '../../../components/wrappers/TableAvatar/TableAvatarAccounts';
import { IOrder, TableRowDataType } from '../../../types/types';
import { RenderDealershipAndServiceAccordion } from './RenderDealershipAndServiceAccordion';
import { TUserAccountForm } from '../../../components/modals/admin/AddUserAccount/types';
import {
  removeUser,
  restoreUser,
  setLoading,
} from '../../../store/reducers/roleManagement/actions';
import { useDispatch } from 'react-redux';
import { useMessage } from '../../../hooks/useMessage/useMessage';
import { convertUserAccountToEditedItem, truncateText } from './helper';
import { EEmployeeType } from '../../../components/modals/admin/CreateEmployee/types';
import { getDisplayData } from '../../../features/admin/Employees/EmployeesTable/utils';
import RenderServiceCenters from './RenderServiceCenters';
import ResendEmailModal from '../../../features/admin/Employees/ResendEmailModal/ResendEmailModal';
import { useModal } from '../../../hooks/useModal/useModal';

interface UsersTableProps {
  editedItem: TUserAccountForm | null;
  setEditedItem: React.Dispatch<React.SetStateAction<TUserAccountForm | null>>;
  data: IUserAccount[];
  isLoading: boolean;
  openEdit: (edit: boolean) => void;
  isAdminPanel: boolean;
  pageData: { pageIndex: number; pageSize: number };
  setPageData: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
  filterServiceCenterId?: number;
}

const UsersTableWrapper = ({
  data,
  isLoading,
  setEditedItem,
  editedItem,
  openEdit,
  isAdminPanel,
  pageData,
  setPageData,
  filterServiceCenterId,
}: UsersTableProps) => {
  const dispatch = useDispatch();
  const showMessage = useMessage();
  const [visibleData, setVisibleData] = useState<IUserAccount[]>([]);
  const { onOpen: onOpenResend, onClose: onCloseResend, isOpen: isOpenResend } = useModal();

  const [order, setOrder] = useState<IOrder<IUserAccount>>({
    orderBy: 'fullName',
    isAscending: true,
  });
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const emptySearchResultMessage =
    'No users were found. Please try changing the filters or search criteria';

  const reformatType = (type?: number) => {
    return type === EEmployeeType.Individual
      ? 'Individual'
      : type === EEmployeeType.Team
        ? 'Team'
        : '-';
  };

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

  const AdminPanelRowData = (): TableRowDataType<IUserAccount>[] => [
    { val: el => el.fullName, header: 'Name', orderId: 'fullName', width: 150 },
    {
      val: el => <RenderServiceCenters serviceCenters={el.dealerships[0].serviceCenters} />,
      header: 'Service Center',
      width: 250,
    },
    { val: el => el.role, header: 'Role' },
    {
      val: el => {
        if (filterServiceCenterId) {
          const sc = el.dealerships[0].serviceCenters.find(s => s.id === filterServiceCenterId);
          return sc ? reformatType(sc.type) : '-';
        }

        return el.dealerships[0].serviceCenters.length === 1
          ? reformatType(el.dealerships[0].serviceCenters[0].type)
          : '-';
      },
      header: 'Type',
      orderId: 'type',
    },
    { val: el => truncateText(el.email, 25), header: 'Email', width: 180 },
    {
      val: el => {
        if (filterServiceCenterId) {
          const sc = el.dealerships[0].serviceCenters.find(s => s.id === filterServiceCenterId);
          return sc ? sc.dmsId : '-';
        }

        return el.dealerships[0].serviceCenters.length === 1
          ? el.dealerships[0].serviceCenters[0].dmsId
          : '-';
      },
      header: 'Employee ID',
    },
    { header: 'Booking Display', val: el => getDisplayData(el, filterServiceCenterId), width: 120 },
  ];

  const UserPanelRowData = (): TableRowDataType<IUserAccount>[] => [
    { val: el => el.fullName, header: 'Name', orderId: 'fullName' },
    {
      val: el => <RenderDealershipAndServiceAccordion dealerships={el.dealerships} isSc={false} />,
      header: 'Dealership Group',
      width: 230,
    },
    {
      val: el => <RenderDealershipAndServiceAccordion dealerships={el.dealerships} isSc={true} />,
      header: 'Service Center',
      width: 350,
    },
    { val: el => el.role, header: 'Role', orderId: 'role', width: 150 },
    { val: el => statusLabels[el.status], header: 'Status', orderId: 'status', width: 100 },
  ];

  const rowData: TableRowDataType<IUserAccount>[] = isAdminPanel
    ? AdminPanelRowData()
    : UserPanelRowData();

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
    setAnchorEl(null);
    // prevent all menu items blicking
    setTimeout(() => {
      setEditedItem(null);
    }, 200);
  };

  const openMenu = (el: IUserAccount) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setEditedItem(convertUserAccountToEditedItem(el));
    setAnchorEl(e.currentTarget);
  };

  const viewActions = (el: IUserAccount) => (
    <IconButton size="small" onClick={openMenu(el)}>
      <MoreHoriz />
    </IconButton>
  );

  const onSuccess = (message: string) => {
    showMessage(message);
    dispatch(setLoading(false));
  };

  const handleRemove = async () => {
    if (editedItem?.id) {
      dispatch(setLoading(true));
      dispatch(removeUser(editedItem.id, onSuccess));
      setAnchorEl(null);
    }
  };

  const handleRestore = async () => {
    if (editedItem?.id) {
      dispatch(restoreUser(editedItem.id, onSuccess));
      setAnchorEl(null);
    }
  };

  const handleEdit = async () => {
    if (!editedItem) return;
    setAnchorEl(null);
    openEdit(true);
  };

  const handleResend = async () => {
    if (editedItem?.id) {
      onOpenResend();
      setAnchorEl(null);
    }
  };

  const startActions = (el: IUserAccount) => (
    <TableAvatarAccounts name={el.fullName} src={el.avatarPath} />
  );

  return (
    <>
      <UsersTable<IUserAccount>
        data={visibleData}
        order={order.orderBy}
        onSort={handleSort}
        isAscending={order.isAscending}
        noDataTitle={!isLoading ? emptySearchResultMessage : ''}
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
        <MenuItem disabled={editedItem?.status === UserStatus.Removed} onClick={handleEdit}>
          Edit
        </MenuItem>
        {!isAdminPanel ? (
          editedItem?.status === UserStatus.Active || editedItem?.status === UserStatus.Inactive ? (
            <MenuItem onClick={handleRemove}>Remove</MenuItem>
          ) : (
            <MenuItem onClick={handleRestore}>Restore</MenuItem>
          )
        ) : null}
        {!editedItem?.emailConfirmed ? (
          <MenuItem disabled={editedItem?.status === UserStatus.Removed} onClick={handleResend}>
            Resend
          </MenuItem>
        ) : null}
      </Menu>
      <ResendEmailModal
        open={isOpenResend}
        onClose={onCloseResend}
        employeeEmail={editedItem?.email}
        employeeId={editedItem?.id}
        employeeName={editedItem?.firstName + ' ' + editedItem?.lastName}
      />
    </>
  );
};

export default UsersTableWrapper;
