import React, { useEffect, useState } from 'react';
import { dealerOperationsRoot } from '../../../../../utils/constants';
import { TitleContainer } from '../../../../../components/wrappers/TitleContainer/TitleContainer';
import { DenseTable } from '../../../../../components/styled/DemandTable';
import { Button, TableBody, TablePagination } from '@mui/material';
import {
  changeDealerOperationsPageData,
  setTextMessage,
  loadDashboardItems,
  loadTextIntegrationSettings,
  setNewEventName,
  updateCustomerEvent,
  updateCustomerEventName,
  setUpdatedEventsName,
} from '../../../../../store/reducers/dealerOperations/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { usePagination } from '../../../../../hooks/usePaginations/usePaginations';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { useModal } from '../../../../../hooks/useModal/useModal';
import AddCustomerEventModal from '../../../../../components/modals/admin/AddCustomerEvent/AddCustomerEvent';
import CustomerTextConfiguration from '../../../../../components/modals/admin/CustomerTextConfiguration/CustomerTextConfiguration';
import { TabContext, TabPanel } from '@mui/lab';
import TextIntegration from '../TextIntegration/TextIntegration';
import DealerCustomerSettings from '../Configuration/DealerCustomerSettings';
import { useException } from '../../../../../hooks/useException/useException';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import TableHeadLayout from './TableHeadLayout';
import TableRowLayout from './TableRowLayout';
import { useStyles } from './styles';
import TabWrapper from './TabWrapper';

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
  const showError = useException();
  const { classes } = useStyles();

  const {
    dashboardItems,
    customerCommunicationPaging,
    customerCommunicationPageData,
    textIntegrationSettings,
    textMessage,
    eventForTextConfiguration,
    eventIdForRulesConfiguration,
    updatedEventsName,
  } = useSelector((state: RootState) => state.dealerOperations);

  const { changeRowsPerPage, changePage } = usePagination(
    (s: RootState) => s.dealerOperations.customerCommunicationPageData,
    changeDealerOperationsPageData
  );

  const [isEditEventName, setIsEditEventName] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingConfigurationText, setIsLoadingConfigurationText] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    if (selectedSC?.id) {
      dispatch(loadDashboardItems(selectedSC.id, () => setIsLoading(false)));

      // load text integration settings to check if textIntegration is configured
      if (!textIntegrationSettings?.fromPhoneNumber)
        dispatch(loadTextIntegrationSettings(selectedSC.id, () => setIsLoading(false)));
    }
  }, [selectedSC, customerCommunicationPageData]);

  useEffect(() => {
    // effect on a first page load to store current names in updatedEventsName
    if (dashboardItems.length) {
      dispatch(
        setUpdatedEventsName(
          dashboardItems.map(item => {
            return {
              id: item.id,
              name: item.name,
            };
          })
        )
      );
    }
  }, [dashboardItems]);

  const handleChangePage = async (
    e: React.MouseEvent<Element, MouseEvent> | null,
    pageNumber: number
  ) => {
    changePage(e, pageNumber);
  };

  const handleChangeRows = async (e: React.ChangeEvent<HTMLInputElement>) => {
    changeRowsPerPage(e);
  };

  const handleCloseNewCustomerEventModal = () => {
    onCloseNewCustomerEventModal();
    dispatch(setNewEventName(''));
  };

  const handleCloseConfigurationTextModal = () => {
    dispatch(setTextMessage(''));
    onCloseTextConfigurationModal();
    setIsLoadingConfigurationText(false);
    setIsLoading(true);
  };

  const handleSaveText = () => {
    if (!selectedSC?.id) {
      throw new Error('Selected SC is not defined');
    }

    if (eventForTextConfiguration) {
      setIsLoadingConfigurationText(true);
      const updatedEvent = {
        communicationDetails: {
          textMessage: textMessage.trim(),
        },
      };

      dispatch(
        updateCustomerEvent(
          {
            serviceCenterId: selectedSC?.id,
            eventId: eventForTextConfiguration.id,
            updatedData: updatedEvent,
          },
          handleCloseConfigurationTextModal,
          () => setIsLoading(false)
        )
      );
    }
  };

  const onError = (eventName: string) => {
    showError(`Event name "${eventName}" is already used. Please enter a unique name.`);
    setIsEditEventName(true);
    setIsLoading(false);
  };

  const handleUpdateEventName = () => {
    const onSuccess = () => {
      setIsEditEventName(false);
    };

    if (selectedSC?.id) {
      setIsLoading(true);
      let counter = 0;
      dashboardItems.forEach(event => {
        updatedEventsName.forEach(updatedEvent => {
          if (event.id === updatedEvent.id) {
            if (event.name !== updatedEvent.name) {
              dispatch(
                updateCustomerEventName(
                  {
                    id: updatedEvent.id,
                    name: updatedEvent.name.trim(),
                    serviceCenterId: selectedSC?.id,
                  },
                  onSuccess,
                  onError,
                  () => setIsLoading(false)
                )
              );
              counter += 1;
            }
          }
        });
      });

      if (counter === 0) {
        setIsLoading(false);
        setIsEditEventName(false);
      }
    }
  };

  if (eventIdForRulesConfiguration) {
    return <DealerCustomerSettings />;
  }

  return (
    <div className={classes.wrapper}>
      <TabContext value={activeTab}>
        <TitleContainer title="Customer" pad parent={dealerOperationsRoot} />
        <TabWrapper setActiveTab={setActiveTab} />
        <TabPanel className={classes.tabPanel} value="0">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className={classes.itemsContainer}>
                {dashboardItems.length ? (
                  <div className={classes.updateNamesContainer}>
                    {isEditEventName ? (
                      <>
                        <Button
                          variant="text"
                          onClick={() => {
                            dispatch(
                              setUpdatedEventsName(
                                dashboardItems.map(item => {
                                  return {
                                    id: item.id,
                                    name: item.name,
                                  };
                                })
                              )
                            );
                            setIsEditEventName(false);
                          }}
                          color="secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="text"
                          disabled={!!updatedEventsName.find(event => event.name.trim().length < 3)}
                          onClick={handleUpdateEventName}
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <Button variant="text" onClick={() => setIsEditEventName(true)}>
                        Edit Name
                      </Button>
                    )}
                  </div>
                ) : null}

                <Button variant="contained" onClick={onOpenNewCustomerEventModal}>
                  Add Event
                </Button>
              </div>
              {dashboardItems.length ? (
                <DenseTable>
                  <TableHeadLayout />
                  <TableBody>
                    {dashboardItems.map(event => {
                      return (
                        <TableRowLayout
                          key={event.id}
                          event={event}
                          isEditEventName={isEditEventName}
                          onOpenTextConfigurationModal={onOpenTextConfigurationModal}
                          setIsLoading={setIsLoading}
                        />
                      );
                    })}
                  </TableBody>
                </DenseTable>
              ) : null}
              {customerCommunicationPaging.numberOfRecords > 15 && dashboardItems.length ? (
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
          )}
        </TabPanel>
        <TabPanel className={classes.rightTab} value="1">
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
        handleSaveText={handleSaveText}
        isLoading={isLoadingConfigurationText}
      ></CustomerTextConfiguration>
    </div>
  );
};

export default DealerOperationsCustomer;
