import React from 'react';
import { useStyles } from '../../../styles';
import { IRecallAlert } from '../../../../../../../store/reducers/recall/types';
import { ReactComponent as Car } from '../../../../../../../assets/img/car.svg';
import { ReactComponent as People } from '../../../../../../../assets/img/people.svg';

const StatisticData = ({ updatedRecallAlert }: { updatedRecallAlert: IRecallAlert | null }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.statisticDataContainer}>
      <div className={classes.statisticCard}>
        <div>
          <div className={classes.statisticLabel}>VEHICLES IN DMS</div>
          <div className={classes.statisticValue}>{updatedRecallAlert?.vehiclesInDms || '0'}</div>
        </div>
        <Car />
      </div>

      <div className={classes.statisticCard}>
        <div>
          <div className={classes.statisticLabel}>ESTIMATED RECIPIENTS</div>
          <div className={classes.statisticValue}>
            {updatedRecallAlert?.estimatedRecipients || '0'}
          </div>
        </div>
        <People />
      </div>
    </div>
  );
};

export default StatisticData;
