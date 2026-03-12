import React, { useEffect, useState } from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { Titles } from '../../../types/types';
import { applicationRoot } from '../../../utils/constants';
import { useStyles } from './styles';
import Filters from './Filters';
import { useModal } from '../../../hooks/useModal/useModal';
import { AddUserAccount } from '../../../components/modals/admin/AddUserAccount/AddUserAccount';
import { loadAll as loadDealershipsGroup } from '../../../store/reducers/dealershipGroups/actions';
import { loadAll as loadServiceCentersGroup } from '../../../store/reducers/serviceCenters/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IUserAccount } from './types';
import UsersTableWrapper from './UsersTableWrapper';
import { loadRoleUsers, setLoading } from '../../../store/reducers/roleManagement/actions';
import { RootState } from '../../../store/rootReducer';
import { TUserAccountForm } from '../../../components/modals/admin/AddUserAccount/types';
import { AddUserButtonWrapper } from '../EmployeesAddDelete/AddUserButtonWrapper';

const RoleManagement = () => {
  const { classes } = useStyles();
  const { onOpen, isOpen, onClose } = useModal();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state: RootState) => state.roleManagement);
  const [visibleData, setVisibleDate] = useState<IUserAccount[]>([]);
  const [editedItem, setEditedItem] = useState<TUserAccountForm | null>(null);
  const [pageData, setPageData] = useState({ pageIndex: 0, pageSize: 25 });

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
  }, []);

  return (
    <div className={classes.root}>
      <TitleContainer title={Titles.RoleManagement} parent={applicationRoot} pad />
      <AddUserButtonWrapper handleAddUserAccount={handleAddUserAccount} isAdminPanel={false} />
      {!isLoading ? <Filters setData={setVisibleDate} setPageData={setPageData} /> : null}
      <UsersTableWrapper
        setPageData={setPageData}
        pageData={pageData}
        isAdminPanel={false}
        openEdit={handleAddUserAccount}
        data={visibleData}
        isLoading={isLoading}
        setEditedItem={setEditedItem}
        editedItem={editedItem}
      />
      <AddUserAccount open={isOpen} onClose={onClose} payload={editedItem} />
    </div>
  );
};

export default RoleManagement;
