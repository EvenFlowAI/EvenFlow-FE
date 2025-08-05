import React, { useEffect, useState } from 'react';
import { dealerOperationsRoot } from '../../../utils/constants';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { DenseTable } from '../../../components/styled/DemandTable';
import { StyledTableCell } from '../../../features/admin/DemandPredictionTable/styles';
import { Button, Switch, TableBody, TableHead, TablePagination } from '@mui/material';
import LabelLink from '../../../features/admin/DemandPredictionTable/LabelLink/LabelLink';
import { ReactComponent as CheckIcon } from '../../../assets/img/checkboxSmall.svg';
import { ReactComponent as RedCross } from '../../../assets/img/redCross.svg';
import { ReactComponent as GreyCross } from '../../../assets/img/greyCross.svg';
import { TableRow } from '../../../components/styled/TableRow';
import {
  changeDealerOperationsPageData,
  createCustomerEvent,
  deleteCustomerEvent,
  loadDashboardItems,
} from '../../../store/reducers/dealerOperations/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { usePagination } from '../../../hooks/usePaginations/usePaginations';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useModal } from '../../../hooks/useModal/useModal';
import AddCustomerEventModal from '../../../components/modals/admin/AddCustomerEvent/AddCustomerEvent';

const DealerOperationsCustomer = () => {
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const { onOpen, onClose, isOpen } = useModal();

  const { dashboardItems, customerCommunicationPaging, customerCommunicationPageData } =
    useSelector((state: RootState) => state.dealerOperations);

  const { changeRowsPerPage, changePage } = usePagination(
    (s: RootState) => s.dealerOperations.customerCommunicationPageData,
    changeDealerOperationsPageData
  );

  const [newEventName, setNewEventName] = useState('');

  useEffect(() => {
    if (selectedSC?.id) {
      dispatch(loadDashboardItems(selectedSC.id));
    }
  }, [selectedSC, customerCommunicationPageData]);

  const handleChangePage = async (
    e: React.MouseEvent<Element, MouseEvent> | null,
    pageNumber: number
  ) => {
    await changePage(e, pageNumber);
  };

  const handleChangeRows = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await changeRowsPerPage(e);
  };

  const textSwitchChange = (id: number) => {
    console.log(id);
  };

  const elementRemove = (id: number) => {
    if (!selectedSC?.id) {
      throw new Error('Selected SC is not defined');
    }

    dispatch(deleteCustomerEvent({ serviceCenterId: selectedSC?.id, id }));
  };

  const handleCloseModal = () => {
    onClose();
    setNewEventName('');
  };

  const handleSaveNewEvent = () => {
    if (!selectedSC?.id) {
      throw new Error('Selected SC is not defined');
    }

    if (newEventName?.length > 2) {
      dispatch(
        createCustomerEvent(
          { serviceCenterId: selectedSC?.id, name: newEventName },
          handleCloseModal
        )
      );
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <TitleContainer title="Customer" pad parent={dealerOperationsRoot} />

      <div
        style={{
          width: '100%',
          marginBottom: 24,
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <p style={{ fontSize: '18px', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          Customer Communication Dashboard
        </p>
        <Button variant="contained" onClick={onOpen}>
          Add Event
        </Button>
      </div>

      <div>
        <DenseTable>
          <TableHead>
            <TableRow>
              <StyledTableCell key="Event" style={{ textTransform: 'capitalize', width: '26%' }}>
                Event
              </StyledTableCell>
              <StyledTableCell
                key="Audience & Triggers"
                style={{ textTransform: 'capitalize', width: '18%' }}
              >
                Audience & Triggers
              </StyledTableCell>
              <StyledTableCell key="Email" style={{ textTransform: 'capitalize', width: '21%' }}>
                Email
              </StyledTableCell>
              <StyledTableCell key="Text" style={{ textTransform: 'capitalize', width: '21%' }}>
                Text
              </StyledTableCell>
              <StyledTableCell key="BDC" style={{ textTransform: 'capitalize', width: '7%' }}>
                BDC
              </StyledTableCell>
              <StyledTableCell
                key="Remove"
                style={{ textTransform: 'capitalize' }}
              ></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboardItems.map(el => {
              return (
                <TableRow key={el.id}>
                  <StyledTableCell>{el.name}</StyledTableCell>
                  <StyledTableCell>
                    <LabelLink
                      style={{ textTransform: 'upperCase', fontWeight: '700' }}
                      subText={el.triggers.length ? 'Configured' : 'Not Configured'}
                      color={el.triggers.length ? '#7898FF' : '#C71062'}
                      icon={el.triggers.length ? <CheckIcon /> : <RedCross />}
                      onClick={() => {}}
                    />
                  </StyledTableCell>

                  <StyledTableCell>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <LabelLink
                        subText={'Not Configured'}
                        color={'#B8B9BF'}
                        icon={<GreyCross />}
                        onClick={() => {}}
                      />
                      <Switch disabled={true} onClick={() => {}} checked={false} color="primary" />
                    </div>
                  </StyledTableCell>

                  <StyledTableCell>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <LabelLink
                        subText={
                          el.communicationDetails?.textMessage ? 'Configured' : 'Not Configured'
                        }
                        color={el.communicationDetails?.textMessage ? '#7898FF' : '#C71062'}
                        icon={el.communicationDetails?.textMessage ? <CheckIcon /> : <RedCross />}
                        onClick={() => {}}
                      />
                      <Switch
                        disabled={!el.communicationDetails?.textMessage}
                        onClick={() => textSwitchChange(el.id)}
                        checked={el.isTextEnabled}
                        color="primary"
                      />
                    </div>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Switch disabled={true} onClick={() => {}} checked={false} color="primary" />
                  </StyledTableCell>

                  <StyledTableCell>
                    <LabelLink
                      style={{ textTransform: 'upperCase', fontWeight: '700' }}
                      subText={'Remove'}
                      color={'#7898FF'}
                      onClick={() => elementRemove(el.id)}
                    />
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </DenseTable>
      </div>

      {customerCommunicationPaging.numberOfRecords > 5 ? (
        <TablePagination
          // className={classes.pagination}
          component="div"
          count={customerCommunicationPaging.numberOfRecords}
          page={customerCommunicationPageData.pageIndex}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 20, 50]}
          onRowsPerPageChange={handleChangeRows}
          rowsPerPage={customerCommunicationPageData.pageSize}
        />
      ) : null}

      <AddCustomerEventModal
        onClose={onClose}
        open={isOpen}
        setNewEventName={setNewEventName}
        newEventName={newEventName}
        handleSaveNewEvent={handleSaveNewEvent}
      ></AddCustomerEventModal>
    </div>
  );
};

export default DealerOperationsCustomer;
