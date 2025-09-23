import React, { Dispatch, SetStateAction } from 'react';
import { BtnsCell, Cell, Row, SubCell, SubCellWrapper, SubText, SubTitle } from '../styles';
import { IconButton } from '@mui/material';
import { IEmployee } from '../../../../../store/reducers/employees/types';
import { MoreHoriz, Visibility } from '@mui/icons-material';
import { Roles } from '../../../../../types/types';
import { ReactComponent as ArrowDown } from '../../../../../assets/img/dropdown_closed.svg';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser/useCurrentUser';

type TProps = {
  item: IEmployee;
  expandedItem: IEmployee | null;
  idx: number;
  setEditedItem: Dispatch<SetStateAction<IEmployee | undefined>>;
  setExpandedItem: Dispatch<SetStateAction<IEmployee | null>>;
  setAnchorEl: Dispatch<SetStateAction<(EventTarget & HTMLButtonElement) | null>>;
  isOpened: boolean;
};

const EmployeeTableRow: React.FC<TProps> = ({
  isOpened,
  item,
  expandedItem,
  idx,
  setEditedItem,
  setAnchorEl,
  setExpandedItem,
}) => {
  const currentUser = useCurrentUser();

  const handleMenuOpen = (item: IEmployee) => (e: React.MouseEvent<HTMLButtonElement>) => {
    setEditedItem(item);
    setAnchorEl(e.currentTarget);
  };

  const handleView = (el: IEmployee) => () => alert(`View ${el.fullName}`);

  const viewActions = (el: IEmployee) =>
    currentUser?.isSuperUser ? (
      <IconButton size="small" onClick={handleView(el)} style={{ padding: 0 }}>
        <Visibility />
      </IconButton>
    ) : (
      <IconButton
        disabled={el.role === Roles.DealerOwner || el.id === currentUser?.id}
        size="small"
        style={{ padding: 0 }}
        onClick={handleMenuOpen(el)}
      >
        <MoreHoriz />
      </IconButton>
    );

  const onOpenRow = (item: IEmployee) => () => {
    setExpandedItem(item.id === expandedItem?.id ? null : item);
  };

  return (
    <>
      <Row style={{ backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F2F4FB' }}>
        <Cell>{item.fullName}</Cell>
        <Cell>{item.serviceCenter?.name}</Cell>
        <BtnsCell>
          <div>{viewActions(item)}</div>
          <div>
            <IconButton style={{ padding: 0 }} onClick={onOpenRow(item)}>
              <ArrowDown
                style={
                  isOpened
                    ? { transform: 'rotate(180deg)', transition: '0.6s ease' }
                    : { transform: 'rotate(360deg)', transition: '0.6s ease' }
                }
              />
            </IconButton>
          </div>
        </BtnsCell>
      </Row>
      {isOpened ? (
        <div
          style={{
            backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F2F4FB',
          }}
        >
          <SubCellWrapper>
            <SubCell>
              <SubTitle>Role</SubTitle>
              <SubText>{item.role}</SubText>
            </SubCell>
            <SubCell>
              <SubTitle>DMS ID</SubTitle>
              <SubText>{item.dmsId ?? '-'}</SubText>
            </SubCell>
          </SubCellWrapper>
          <SubCell>
            <SubTitle>Email Address</SubTitle>
            <SubText>{item.email ?? '-'}</SubText>
          </SubCell>
        </div>
      ) : null}
    </>
  );
};

export default EmployeeTableRow;
