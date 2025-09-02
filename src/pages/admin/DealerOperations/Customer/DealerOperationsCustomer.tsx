/* eslint-disable max-lines */

import React, { useEffect, useState } from 'react';
import { dealerOperationsRoot } from '../../../../utils/constants';
import { TitleContainer } from '../../../../components/wrappers/TitleContainer/TitleContainer';
import { DenseTable } from '../../../../components/styled/DemandTable';
import { StyledTableCell } from '../../../../features/admin/DemandPredictionTable/styles';
import { Button, Switch, Tab, TableBody, TableHead, TablePagination } from '@mui/material';
import LabelLink from '../../../../features/admin/DemandPredictionTable/LabelLink/LabelLink';
import { ReactComponent as CheckIcon } from '../../../../assets/img/checkboxSmall.svg';
import { ReactComponent as RedCross } from '../../../../assets/img/redCross.svg';
import { ReactComponent as GreyCross } from '../../../../assets/img/greyCross.svg';
import { TableRow } from '../../../../components/styled/TableRow';
import {
  changeDealerOperationsPageData,
  deleteCustomerEvent,
  loadDashboardItems,
  setNewEventName,
  updateCustomerEvent,
} from '../../../../store/reducers/dealerOperations/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { usePagination } from '../../../../hooks/usePaginations/usePaginations';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { useModal } from '../../../../hooks/useModal/useModal';
import AddCustomerEventModal from '../../../../components/modals/admin/AddCustomerEvent/AddCustomerEvent';
import CustomerTextConfiguration from '../../../../components/modals/admin/CustomerTextConfiguration/CustomerTextConfiguration';
import { DashboardItemI } from '../../../../store/reducers/dealerOperations/types';
import { TabContext, TabPanel } from '@mui/lab';
import { TabList } from '../../../../components/styled/Tabs';
import TextIntegration from './TextIntegration/TextIntegration';
import DealerCustomerSettings from './DealerCustomerSettings';

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

  const [textMessage, setTextMessage] = useState<string>('');
  const [eventForTextConfiguration, setEventForTextConfiguration] = useState<DashboardItemI | null>(
    null
  );
  const [eventIdForRulesConfiguration, setEventIdForRulesConfiguration] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>('0');

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

    setEventForTextConfiguration(event);
    setTextMessage(event.communicationDetails?.textMessage ?? '');
    onOpenTextConfigurationModal();
  };

  const handleCloseConfigurationTextModal = () => {
    setTextMessage('');
    onCloseTextConfigurationModal();
  };

  const handleSaveText = () => {
    if (!selectedSC?.id) {
      throw new Error('Selected SC is not defined');
    }

    if (eventForTextConfiguration) {
      const updatedEvent = {
        communicationDetails: {
          textMessage: textMessage,
        },
      };

      dispatch(
        updateCustomerEvent(
          {
            serviceCenterId: selectedSC?.id,
            eventId: eventForTextConfiguration.id,
            updatedData: updatedEvent,
          },
          handleCloseConfigurationTextModal
        )
      );
    }
  };

  if (eventIdForRulesConfiguration) {
    return (
      <DealerCustomerSettings
        eventId={eventIdForRulesConfiguration}
        setEventIdForRulesConfiguration={setEventIdForRulesConfiguration}
      />
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <TabContext value={activeTab}>
        <TitleContainer title="Customer" pad parent={dealerOperationsRoot} />
        <TabList
          onChange={(e, tab) => setActiveTab(tab)}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Communication Dashboard" value="0" />
          <Tab label="Text Integration" value="1" />
        </TabList>
        <TabPanel style={{ width: '100%', padding: '24px 0' }} value="0">
          <>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
                paddingBottom: '24px',
              }}
            >
              <Button variant="contained" onClick={onOpenNewCustomerEventModal}>
                Add Event
              </Button>
            </div>
            <DenseTable>
              <TableHead>
                <TableRow>
                  <StyledTableCell
                    key="Event"
                    style={{ textTransform: 'capitalize', width: '26%' }}
                  >
                    Event
                  </StyledTableCell>
                  <StyledTableCell
                    key="Audience & Triggers"
                    style={{ textTransform: 'capitalize', width: '18%' }}
                  >
                    Audience & Triggers
                  </StyledTableCell>
                  <StyledTableCell
                    key="Email"
                    style={{ textTransform: 'capitalize', width: '21%' }}
                  >
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
                          subText={
                            event.triggers.length && event.filterRules.length
                              ? 'Configured'
                              : 'Not Configured'
                          }
                          color={
                            event.triggers.length && event.filterRules.length
                              ? '#7898FF'
                              : '#C71062'
                          }
                          icon={
                            event.triggers.length && event.filterRules.length ? (
                              <CheckIcon />
                            ) : (
                              <RedCross />
                            )
                          }
                          onClick={() => setEventIdForRulesConfiguration(event.id)}
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
                          <Switch
                            disabled={true}
                            onClick={() => {}}
                            checked={false}
                            color="primary"
                          />
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
                              event.communicationDetails?.textMessage
                                ? 'Configured'
                                : 'Not Configured'
                            }
                            color={event.communicationDetails?.textMessage ? '#7898FF' : '#C71062'}
                            icon={
                              event.communicationDetails?.textMessage ? <CheckIcon /> : <RedCross />
                            }
                            onClick={() => handleClickTextConfiguration(event)}
                          />
                          <Switch
                            disabled={
                              !event.communicationDetails?.textMessage ||
                              !event.filterRules.length ||
                              !event.triggers.length
                            }
                            onClick={() => textSwitchChange(event)}
                            checked={event.isTextEnabled}
                            color="primary"
                          />
                        </div>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Switch
                          disabled={true}
                          onClick={() => {}}
                          checked={false}
                          color="primary"
                        />
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
            {customerCommunicationPaging.numberOfRecords > 15 ? (
              <TablePagination
                component="div"
                count={customerCommunicationPaging.numberOfRecords}
                page={customerCommunicationPageData.pageIndex}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[15, 25, 100]}
                onRowsPerPageChange={handleChangeRows}
                rowsPerPage={customerCommunicationPageData.pageSize}
              />
            ) : null}
          </>
        </TabPanel>
        <TabPanel style={{ width: '100%', padding: '24px 0' }} value="1">
          <TextIntegration />
        </TabPanel>
      </TabContext>

      <AddCustomerEventModal
        onClose={handleCloseNewCustomerEventModal}
        open={isOpenNewCustomerEventModal}
      ></AddCustomerEventModal>

      <CustomerTextConfiguration
        onClose={onCloseTextConfigurationModal}
        open={isOpenTextConfigurationModal}
        event={eventForTextConfiguration}
        setTextMessage={setTextMessage}
        textMessage={textMessage}
        handleSaveText={handleSaveText}
      ></CustomerTextConfiguration>
    </div>
  );
};

export default DealerOperationsCustomer;
