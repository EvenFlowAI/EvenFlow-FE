/* eslint-disable max-lines */

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
  deleteCustomerEvent,
  loadDashboardItems,
  setNewEventName,
  updateCustomerEvent,
} from '../../../store/reducers/dealerOperations/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { usePagination } from '../../../hooks/usePaginations/usePaginations';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { useModal } from '../../../hooks/useModal/useModal';
import AddCustomerEventModal from '../../../components/modals/admin/AddCustomerEvent/AddCustomerEvent';
import CustomerTextConfiguration from '../../../components/modals/admin/CustomerTextConfiguration/CustomerTextConfiguration';
import { DashboardItemI } from '../../../store/reducers/dealerOperations/types';

const DealerOperationsCustomer = () => {
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const {
    onOpen: onOpenNewCustomerEventModal,
    onClose: onCloseNewCustomerEventModal,
    isOpen: isOpenNewCustomerEventModal,
  } = useModal();
  const {
    onOpen: onOpenTextConfigurationModal,
    onClose: onCloseTextConfigurationModal,
    isOpen: isOpenTextConfigurationModal,
  } = useModal();

  const { dashboardItems, customerCommunicationPaging, customerCommunicationPageData } =
    useSelector((state: RootState) => state.dealerOperations);

  const { changeRowsPerPage, changePage } = usePagination(
    (s: RootState) => s.dealerOperations.customerCommunicationPageData,
    changeDealerOperationsPageData
  );

  const [fromPhoneNumber, setFromPhoneNumber] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [textMessage, setTextMessage] = useState<string>('');
  const [eventForConfiguration, setEventForConfiguration] = useState<DashboardItemI | null>(null);

  useEffect(() => {
    if (selectedSC?.id) {
      dispatch(loadDashboardItems(selectedSC.id));
    }
  }, [selectedSC, customerCommunicationPageData]);

  const handleChangePage = async (
    e: React.MouseEvent<Element, MouseEvent> | null,
    pageNumber: number
  ) => {
    changePage(e, pageNumber);
  };

  const handleChangeRows = async (e: React.ChangeEvent<HTMLInputElement>) => {
    changeRowsPerPage(e);
  };

  const textSwitchChange = (event: DashboardItemI) => {
    if (!selectedSC?.id) {
      throw new Error('Selected SC is not defined');
    }

    if (event) {
      const updatedEvent = { isTextEnabled: !event.isTextEnabled };
      dispatch(
        updateCustomerEvent(
          {
            serviceCenterId: selectedSC?.id,
            eventId: event.id,
            updatedData: updatedEvent,
          },
          () => {}
        )
      );
    }
  };

  const handleDeleteCustomerEvent = (id: number) => {
    if (!selectedSC?.id) {
      throw new Error('Selected SC is not defined');
    }

    dispatch(deleteCustomerEvent({ serviceCenterId: selectedSC?.id, id }));
  };

  const handleCloseNewCustomerEventModal = () => {
    onCloseNewCustomerEventModal();
    dispatch(setNewEventName(''));
  };

  const handleClickTextConfiguration = (event: DashboardItemI) => {
    if (!selectedSC?.id) {
      throw new Error('Selected SC is not defined');
    }

    setEventForConfiguration(event);
    setTextMessage(event.communicationDetails?.textMessage ?? '');
    setFromPhoneNumber(event.communicationDetails?.textFrom ?? '');
    onOpenTextConfigurationModal();
  };

  const handleCloseConfigurationTextModal = () => {
    setTextMessage('');
    setFromPhoneNumber('');
    onCloseTextConfigurationModal();
  };

  const handleSaveText = () => {
    if (!selectedSC?.id) {
      throw new Error('Selected SC is not defined');
    }

    if (eventForConfiguration) {
      const updatedEvent = {
        communicationDetails: {
          textFrom: fromPhoneNumber,
          textMessage: textMessage,
        },
      };

      dispatch(
        updateCustomerEvent(
          {
            serviceCenterId: selectedSC?.id,
            eventId: eventForConfiguration.id,
            updatedData: updatedEvent,
          },
          handleCloseConfigurationTextModal
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
        <Button variant="contained" onClick={onOpenNewCustomerEventModal}>
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
            {dashboardItems.map(event => {
              return (
                <TableRow key={event.id}>
                  <StyledTableCell>{event.name}</StyledTableCell>
                  <StyledTableCell>
                    <LabelLink
                      style={{ textTransform: 'upperCase', fontWeight: '700' }}
                      subText={event.triggers.length ? 'Configured' : 'Not Configured'}
                      color={event.triggers.length ? '#7898FF' : '#C71062'}
                      icon={event.triggers.length ? <CheckIcon /> : <RedCross />}
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
                          event.communicationDetails?.textMessage ? 'Configured' : 'Not Configured'
                        }
                        color={event.communicationDetails?.textMessage ? '#7898FF' : '#C71062'}
                        icon={
                          event.communicationDetails?.textMessage ? <CheckIcon /> : <RedCross />
                        }
                        onClick={() => handleClickTextConfiguration(event)}
                      />
                      <Switch
                        disabled={!event.communicationDetails?.textMessage}
                        onClick={() => textSwitchChange(event)}
                        checked={event.isTextEnabled}
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
                      onClick={() => handleDeleteCustomerEvent(event.id)}
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
        onClose={handleCloseNewCustomerEventModal}
        open={isOpenNewCustomerEventModal}
      ></AddCustomerEventModal>

      <CustomerTextConfiguration
        onClose={onCloseTextConfigurationModal}
        open={isOpenTextConfigurationModal}
        event={eventForConfiguration}
        setFromPhoneNumber={setFromPhoneNumber}
        fromPhoneNumber={fromPhoneNumber}
        setSelectedTag={setSelectedTag}
        selectedTag={selectedTag}
        setTextMessage={setTextMessage}
        textMessage={textMessage}
        handleSaveText={handleSaveText}
      ></CustomerTextConfiguration>
    </div>
  );
};

export default DealerOperationsCustomer;
