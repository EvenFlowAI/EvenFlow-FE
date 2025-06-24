import React from 'react';
import DemandPredictionTable from '../DemandPredictionTable/DemandPredictionTable';

const DemandPrediction = ({
  handleTabChange,
}: {
  handleTabChange: (e: React.ChangeEvent<{}> | null, tab: string) => void;
}) => {
  return (
    <div>
      <DemandPredictionTable handleTabChange={handleTabChange} />
    </div>
  );
};

export default DemandPrediction;
