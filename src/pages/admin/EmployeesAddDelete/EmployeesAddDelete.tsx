import React, { useEffect, useState } from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { useModal } from '../../../hooks/useModal/useModal';
import { employeesRoot } from '../../../utils/constants';
import { useMediaQuery, useTheme } from '@mui/material';
import { useStyles } from '../RoleManagement/styles';
import { loadRoleUsers, setLoading } from '../../../store/reducers/roleManagement/actions';
import { loadAll as loadDealershipsGroup } from '../../../store/reducers/dealershipGroups/actions';
import { loadAll as loadServiceCentersGroup } from '../../../store/reducers/serviceCenters/actions';
import { useDispatch, useSelector } from 'react-redux';
import Filters from '../RoleManagement/Filters';
import UsersTableWrapper from '../RoleManagement/UsersTableWrapper';
import { AddUserAccount } from '../../../components/modals/admin/AddUserAccount/AddUserAccount';
import { RootState } from '../../../store/rootReducer';
import { IUserAccount } from '../RoleManagement/types';
import { TUserAccountForm } from '../../../components/modals/admin/AddUserAccount/types';
import { useSCs } from '../../../hooks/useSCs/useSCs';

export const EmployeesAddDelete = () => {
  const [editedItem, setEditedItem] = useState<TUserAccountForm | null>(null);
  const { onOpen, isOpen, onClose } = useModal();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.roleManagement);
  const [visibleData, setVisibleDate] = useState<IUserAccount[]>([]);
  const [pageData, setPageData] = useState({ pageIndex: 0, pageSize: 25 });
  const { selectedSC } = useSCs();
  const [filterServiceCenterId, setFilterServiceCenterId] = useState<number>(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));
  const { classes } = useStyles();

  const handleAddUserAccount = (isEdit: boolean) => {
    if (!isEdit) setEditedItem(null);
    onOpen();
  };

  const onSuccess = () => {
    dispatch(setLoading(false));
  };

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(loadDealershipsGroup(true));
    dispatch(loadServiceCentersGroup(true));
    dispatch(loadRoleUsers(onSuccess));
  }, [selectedSC]);

  return (
    <div className={classes.root}>
      <TitleContainer title={'Add & Delete'} pad={!isMobile} parent={employeesRoot} />

      {!isLoading ? (
        <Filters
          setFilterServiceCenterId={setFilterServiceCenterId}
          setData={setVisibleDate}
          isAdminPanel={true}
          handleAddUserAccount={handleAddUserAccount}
          setPageData={setPageData}
        />
      ) : null}
      <UsersTableWrapper
        filterServiceCenterId={filterServiceCenterId}
        pageData={pageData}
        setPageData={setPageData}
        isAdminPanel={true}
        openEdit={handleAddUserAccount}
        data={visibleData}
        isLoading={isLoading}
        setEditedItem={setEditedItem}
        editedItem={editedItem}
      />
      <AddUserAccount open={isOpen} onClose={onClose} payload={editedItem} isAdminPanel />
    </div>
  );
};
