import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../../../components/modals/BaseModal/types';
import { IRecallAlert } from '../../../../../../store/reducers/recall/types';
import { useDispatch } from 'react-redux';
import { viewHistoryData } from '../../../../../../store/reducers/recall/actions';
import { Loading } from '../../../../../../components/wrappers/Loading/Loading';
import { ReactComponent as NotConfigured } from '../../../../../../assets/img/alerts-status/not-configured.svg';
import { ReactComponent as Configured } from '../../../../../../assets/img/alerts-status/configured.svg';
import { ReactComponent as Failed } from '../../../../../../assets/img/alerts-status/failed.svg';
import { ReactComponent as Completed } from '../../../../../../assets/img/alerts-status/completed.svg';
import { ReactComponent as Received } from '../../../../../../assets/img/alerts-status/received.svg';
import { ReactComponent as Requested } from '../../../../../../assets/img/alerts-status/requested.svg';
import { ReactComponent as Started } from '../../../../../../assets/img/alerts-status/started.svg';
import { useException } from '../../../../../../hooks/useException/useException';
import { useHistoryRecallStyles } from './styles';

type HistoryRecallI = DialogProps & {
  currentItem: IRecallAlert | null;
};

type HistoryRecallStatus =
  | 'not_configured'
  | 'configured'
  | 'check_requested'
  | 'results_available'
  | 'running'
  | 'completed'
  | 'csv_uploaded'
  | 'failed';

const historyRecallStatusLabels: Record<HistoryRecallStatus, string> = {
  not_configured: 'Alert not configured (Alert created)',
  configured: 'Alert configured',
  check_requested: 'VIN check requested',
  results_available: 'Open Recall received',
  running: 'Alert started',
  completed: 'Alert completed',
  csv_uploaded: 'CSV uploaded',
  failed: 'VIN check failed (AutoAp returned an error)',
};

const historyRecallStatusIcons: Record<HistoryRecallStatus, JSX.Element> = {
  not_configured: <NotConfigured />,
  configured: <Configured />,
  check_requested: <Requested />,
  results_available: <Received />,
  running: <Started />,
  completed: <Completed />,
  csv_uploaded: <Received />,
  failed: <Failed />,
};

export interface HistoryRecallData {
  updatedAt: string;
  operation: string;
  changes: {
    propertyName: string;
    value: HistoryRecallStatus;
  }[];
}

const HistoryRecall = ({ onClose, open, currentItem }: HistoryRecallI) => {
  const { classes } = useHistoryRecallStyles();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [historyData, setHistoryData] = React.useState<HistoryRecallData[]>([]);
  const dispatch = useDispatch();
  const showError = useException();
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (currentItem && open) {
      setIsLoading(true);
      dispatch(
        viewHistoryData(
          currentItem.id,
          (data: HistoryRecallData[]) => {
            setHistoryData(data);
            setIsLoading(false);
          },
          () => {
            setIsLoading(false);
            showError('Something went wrong. Please try again later.');
          }
        )
      );
    }
  }, [open, currentItem?.id, dispatch]);

  const normalizeEventName = (status?: HistoryRecallStatus) => {
    if (!status) {
      return '-';
    }

    return historyRecallStatusLabels[status];
  };

  const normalizeEventIcon = (status?: HistoryRecallStatus) => {
    if (!status) {
      return null;
    }

    return historyRecallStatusIcons[status];
  };

  const normalizeDate = (date?: string) => {
    if (!date) {
      return '-';
    }

    return dayjs(date).format('MMM D, YYYY [at] hh:mm A');
  };

  return (
    <BaseModal open={open} width={428} onClose={handleClose}>
      {isLoading ? (
        <div className={classes.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <>
          <DialogTitle style={{ textAlign: 'left' }} onClose={handleClose}>
            {currentItem ? currentItem.name + ' - History' : ''}
          </DialogTitle>
          <DialogContent>
            <div className={classes.list}>
              {!historyData.length ? (
                <div>No history data available for this recall alert.</div>
              ) : (
                historyData.map((item, index) => (
                  <div key={index} className={classes.row}>
                    <span className={classes.iconWrapper}>
                      {normalizeEventIcon(item.changes[0]?.value)}
                    </span>
                    <div className={classes.textContainer}>
                      <span className={classes.eventName}>
                        {normalizeEventName(item.changes[0]?.value)}
                      </span>
                      <span className={classes.eventDate}>{normalizeDate(item.updatedAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </>
      )}
    </BaseModal>
  );
};

export default HistoryRecall;
