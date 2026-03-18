import React from 'react';
import { IServiceCenter } from './types';

interface RenderServiceCentersProps {
  serviceCenters: IServiceCenter[];
}

const RenderServiceCenters = ({ serviceCenters }: RenderServiceCentersProps) => {
  if (serviceCenters.length === 1) {
    return <div>{serviceCenters[0].name}</div>;
  }
  if (serviceCenters.length > 1) {
    return <div>{serviceCenters.map(serviceCenter => serviceCenter.name).join(', ')}</div>;
  }

  return <div>-</div>;
};

export default RenderServiceCenters;
