import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TableBody } from '@mui/material';
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
  setPlays,
  setUpdatedPlaysName,
} from '../../../../../store/reducers/dealerOperations/actions';
import { RootState } from '../../../../../store/rootReducer';

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
  const { plays } = useSelector((state: RootState) => state.dealerOperations);
  const { selectedSC } = useSCs();
  const [loader, setLoader] = React.useState(false);
  const [selectedServiceBookName, setSelectedServiceBookName] = React.useState<string>('');
  const [isEditEventName, setIsEditEventName] = useState<boolean>(false);

  const { onOpen: opOpen, onClose: onClose, isOpen: isOpen } = useModal();

  useEffect(() => {
    if (selectedSC?.id) {
      setLoader(true);
      dispatch(loadPodsSummary(selectedSC?.id, true, () => setLoader(false)));

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

  const handleAddPlay = (serviceBookName: string) => {
    setSelectedServiceBookName(serviceBookName);
    opOpen();
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
            showServiceBookName={showServiceBookName}
            className={rowClassName}
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
      <AddPlayModal open={isOpen} onClose={onClose} serviceBookName={selectedServiceBookName} />
    </div>
  );
};

export default ServicePulse;
