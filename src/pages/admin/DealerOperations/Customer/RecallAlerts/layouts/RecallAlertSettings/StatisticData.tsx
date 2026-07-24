import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from '../../../styles';
import { IRecallAlert } from '../../../../../../../store/reducers/recall/types';
import { ReactComponent as Car } from '../../../../../../../assets/img/car.svg';
import { ReactComponent as People } from '../../../../../../../assets/img/people.svg';
import { TSelectedModelKey } from '../../../../helper';
import { RootState } from '../../../../../../../store/rootReducer';

type TSelectedModelWithCount = TSelectedModelKey & {
  vehicleCount?: number;
};

interface StatisticDataProps {
  updatedRecallAlert: IRecallAlert | null;
  selectedModelKeys: TSelectedModelKey[];
  isEditTable: boolean;
}

const StatisticData: React.FC<StatisticDataProps> = ({
  updatedRecallAlert,
  selectedModelKeys,
  isEditTable,
}) => {
  const { classes } = useStyles();
  const { affectedModels } = useSelector((state: RootState) => state.recalls);

  const selectedVehiclesInDms = useMemo(
    () =>
      selectedModelKeys.reduce(
        (sum, modelKey) => sum + ((modelKey as TSelectedModelWithCount).vehicleCount || 0),
        0
      ),
    [selectedModelKeys]
  );

  const vehiclesInDmsValue = !affectedModels.length
    ? 0
    : isEditTable
      ? selectedVehiclesInDms
      : !updatedRecallAlert?.vehiclesInDms || updatedRecallAlert?.vehiclesInDms === 0
        ? selectedVehiclesInDms
        : (updatedRecallAlert?.vehiclesInDms ?? 0);

  return (
    <div className={classes.statisticDataContainer}>
      <div className={classes.statisticCard}>
        <div>
          <div className={classes.statisticLabel}>VEHICLES IN DMS</div>
          <div className={classes.statisticValue}>{vehiclesInDmsValue}</div>
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
