import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TableBody, TablePagination } from '@mui/material';
import { useStyles } from './styles';
import { DenseTable } from '../../../../../components/styled/DemandTable';
import { TableRow } from '../../../../../components/styled/TableRow';
import { StyledTableCell } from '../../../../../features/admin/DemandPredictionTable/styles';
import TableHeadLayout from './TableHeadLayout';
import TableRowLayout from './TableRowLayout';
import { loadPodsSummary } from '../../../../../store/reducers/pods/actions';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import AddPlayModal from './AddPlayModal';
import { useModal } from '../../../../../hooks/useModal/useModal';
import { serviceBooksWithPlays } from './mock';
import {
  changeDealerOperationsPageData,
  setPlays,
  setUpdatedPlaysName,
} from '../../../../../store/reducers/dealerOperations/actions';
import { RootState } from '../../../../../store/rootReducer';
import { usePagination } from '../../../../../hooks/usePaginations/usePaginations';
import PlaySettingsModal from './PlaySettingsModal';
import { loadSCRequestsShort } from '../../../../../store/reducers/serviceRequests/actions';
import { IAssignedServiceRequestShort } from '../../../../../store/reducers/serviceRequests/types';
import { loadServiceConsultants } from '../../../../../store/reducers/appointments/actions';
import { TServiceConsultant } from '../../../../../store/reducers/appointments/types';
import { loadTransportationOptionsShort } from '../../../../../store/reducers/transportationNeeds/actions';
import { TTransportationShort } from '../../../../../store/reducers/transportationNeeds/types';
import TextConfigurationServicePulse from './TextConfigurationServicePulse';

interface IPlayDetails {
  services: string[];
  advisor: number | null;
  transportation: number;
}

export interface IPlayItem {
  name: string;
  id?: string;
  play: IPlayDetails;
  filterRules: unknown[];
  communicationDetails: {
    textMessage: string;
  };
  triggers: unknown[];
  active: boolean;
  activeText: string;
}

export interface IPlayWithServiceBook extends IPlayItem {
  serviceBookName: string;
  serviceBookId: string;
}

const TABLE_COLUMNS_COUNT = 7;

const ServicePulse = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const { plays, playsPaging, playsPageData } = useSelector(
    (state: RootState) => state.dealerOperations
  );
  const { selectedSC } = useSCs();
  const [loader, setLoader] = React.useState(false);
  const [selectedServiceBookName, setSelectedServiceBookName] = React.useState<string>('');
  const [isEditEventName, setIsEditEventName] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<IPlayWithServiceBook | null>(null);
  const [selectedServiceRequests, setSelectedServiceRequests] = useState<
    IAssignedServiceRequestShort[]
  >([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<TServiceConsultant | null>(null);
  const [selectedTransportation, setSelectedTransportation] = useState<TTransportationShort | null>(
    null
  );
  const [isFormChecked, setIsFormChecked] = useState<boolean>(false);

  const { onOpen: opOpen, onClose: onClose, isOpen: isOpen } = useModal();
  const {
    onOpen: opOpenPlaySettings,
    onClose: onClosePlaySettings,
    isOpen: isOpenPlaySettings,
  } = useModal();
  const { isOpen: isOpenText, onClose: onCloseText, onOpen: onOpenText } = useModal();

  const { changeRowsPerPage, changePage } = usePagination(
    (s: RootState) => s.dealerOperations.playsPageData,
    changeDealerOperationsPageData
  );

  useEffect(() => {
    if (selectedSC?.id) {
      setLoader(true);
      dispatch(loadPodsSummary(selectedSC?.id, true, () => setLoader(false)));
      dispatch(loadSCRequestsShort(selectedSC.id));
      dispatch(loadServiceConsultants(selectedSC.id, true));
      dispatch(loadTransportationOptionsShort(selectedSC.id));

      const allPlaysWithServiceBook: IPlayWithServiceBook[] = serviceBooksWithPlays.flatMap(
        serviceBook =>
          serviceBook.plays.map(playItem => ({
            ...playItem,
            serviceBookName: serviceBook.name,
            serviceBookId: serviceBook.id,
          }))
      );
      dispatch(setPlays(allPlaysWithServiceBook));
    }
  }, [selectedSC?.id]);

  useEffect(() => {
    // effect on a first page load to store current names in updatedPlaysName
    if (plays.length) {
      dispatch(
        setUpdatedPlaysName(
          plays.map(item => {
            return {
              id: item.id,
              name: item.name,
            };
          })
        )
      );
    }
  }, [plays]);

  const onServiceRequestsChange = (e: SyntheticEvent, option: IAssignedServiceRequestShort[]) => {
    setSelectedServiceRequests(option);
    setIsFormChecked(false);
  };

  const onAdvisorChange = (e: SyntheticEvent, option: TServiceConsultant | null) => {
    setSelectedAdvisor(option);
    setIsFormChecked(false);
  };

  const onTransportationChange = (e: SyntheticEvent, option: TTransportationShort | null) => {
    setSelectedTransportation(option);
    setIsFormChecked(false);
  };

  const handleAddPlay = (serviceBookName: string) => {
    setSelectedServiceBookName(serviceBookName);
    opOpen();
  };

  const handleChangePage = async (
    e: React.MouseEvent<Element, MouseEvent> | null,
    pageNumber: number
  ) => {
    changePage(e, pageNumber);
  };

  const handleOpenText = () => {
    onOpenText();
    setIsEditEventName(false);
  };

  const handleChangeRows = async (e: React.ChangeEvent<HTMLInputElement>) => {
    changeRowsPerPage(e);
  };

  const renderPlayRows = (): React.JSX.Element[] => {
    let indexInGroup = 0;
    return plays.map((play, index): React.JSX.Element => {
      const showServiceBookName =
        index === 0 || plays[index - 1].serviceBookName !== play.serviceBookName;
      const isLastInGroup =
        index === plays.length - 1 || plays[index + 1].serviceBookName !== play.serviceBookName;

      if (showServiceBookName) indexInGroup = 0;
      const rowClassName = indexInGroup % 2 === 0 ? classes.rowEven : classes.rowOdd;
      indexInGroup += 1;

      return (
        <React.Fragment key={play.id ?? `${play.serviceBookId}-${play.name}`}>
          <TableRowLayout
            play={play}
            isEdit={isEditEventName}
            handleOpenText={handleOpenText}
            showServiceBookName={showServiceBookName}
            className={rowClassName}
            setCurrentItem={setCurrentItem}
            onOpen={opOpenPlaySettings}
          />
          {isLastInGroup && (
            <TableRow>
              <StyledTableCell colSpan={TABLE_COLUMNS_COUNT} className={classes.addPlayCell}>
                <div className={classes.addPlayRow}>
                  <p
                    className={classes.addPlayText}
                    onClick={() => {
                      handleAddPlay(play.serviceBookName);
                    }}
                  >
                    + Add Play
                  </p>
                </div>
              </StyledTableCell>
            </TableRow>
          )}
        </React.Fragment>
      );
    });
  };

  if (loader)
    return (
      <>
        <Loading />
      </>
    );

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        {isEditEventName ? (
          <>
            <Button
              variant="text"
              onClick={() => {
                setIsEditEventName(false);
                dispatch(
                  setUpdatedPlaysName(
                    plays.map(item => {
                      return {
                        id: item.id,
                        name: item.name,
                      };
                    })
                  )
                );
              }}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setIsEditEventName(false);
              }}
            >
              Save
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              setIsEditEventName(true);
            }}
            color="primary"
          >
            Edit Play Name
          </Button>
        )}
      </div>
      <DenseTable>
        <TableHeadLayout />
        <TableBody>{renderPlayRows()}</TableBody>
      </DenseTable>
      {playsPaging.numberOfRecords > 10 && plays.length ? (
        <TablePagination
          component="div"
          count={playsPaging.numberOfRecords}
          page={playsPageData.pageIndex}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 100]}
          onRowsPerPageChange={handleChangeRows}
          rowsPerPage={playsPageData.pageSize}
        />
      ) : null}
      <AddPlayModal open={isOpen} onClose={onClose} serviceBookName={selectedServiceBookName} />
      <PlaySettingsModal
        play={currentItem}
        open={isOpenPlaySettings}
        onClose={onClosePlaySettings}
        selectedServiceRequests={selectedServiceRequests}
        selectedAdvisor={selectedAdvisor}
        selectedTransportation={selectedTransportation}
        onServiceRequestsChange={onServiceRequestsChange}
        onAdvisorChange={onAdvisorChange}
        onTransportationChange={onTransportationChange}
        isFormChecked={isFormChecked}
        setIsFormChecked={setIsFormChecked}
      />
      <TextConfigurationServicePulse open={isOpenText} onClose={onCloseText} play={currentItem} />
    </div>
  );
};

export default ServicePulse;
