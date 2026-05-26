import React, { useEffect, useState } from 'react';
import { Button, TableBody, TablePagination } from '@mui/material';
import {
  changeDealerOperationsPageData,
  loadDashboardItems,
  loadTextIntegrationSettings,
  setNewEventName,
  setTextMessage,
  setUpdatedEventsName,
  updateCustomerEvent,
  updateCustomerEventName,
} from '../../../../../store/reducers/dealerOperations/actions';
import { DenseTable } from '../../../../../components/styled/DemandTable';
import TableHeadLayout from './TableHeadLayout';
import TableRowLayout from './TableRowLayout';
import { useStyles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../../hooks/useException/useException';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { usePagination } from '../../../../../hooks/usePaginations/usePaginations';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import AddCustomerEventModal from '../../../../../components/modals/admin/AddCustomerEvent/AddCustomerEvent';
import CustomerTextConfiguration from '../../../../../components/modals/admin/CustomerTextConfiguration/CustomerTextConfiguration';

const OutboundEvents = () => {
  const { selectedSC } = useSCs();
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const [isEditEventName, setIsEditEventName] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingConfigurationText, setIsLoadingConfigurationText] = useState<boolean>(false);
  const showError = useException();

  const { changeRowsPerPage, changePage } = usePagination(
    (s: RootState) => s.dealerOperations.customerCommunicationPageData,
    changeDealerOperationsPageData
  );

  const {
    dashboardItems,
    customerCommunicationPaging,
    customerCommunicationPageData,
    textMessage,
    eventForTextConfiguration,
    updatedEventsName,
    textIntegrationSettings,
  } = useSelector((state: RootState) => state.dealerOperations);

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

  useEffect(() => {
    if (selectedSC?.id) {
      setIsLoading(true);

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

  const handleCloseConfigurationTextModal = () => {
    dispatch(setTextMessage(''));
    onCloseTextConfigurationModal();
    setIsLoadingConfigurationText(false);
    setIsLoading(true);
  };

  if (isLoading) return <Loading />;

  return (
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
    </>
  );
};

export default OutboundEvents;
