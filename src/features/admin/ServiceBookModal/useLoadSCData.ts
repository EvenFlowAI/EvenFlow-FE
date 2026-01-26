import { loadSCAdvisors, loadSCEmployees } from '../../../store/reducers/employees/actions';
import { useEffect } from 'react';
import { loadSCRequestsShort } from '../../../store/reducers/serviceRequests/actions';
import { loadEngineType, loadMakesGlobally } from '../../../store/reducers/vehicleDetails/actions';
import { loadMobServiceZones } from '../../../store/reducers/mobileService/actions';
import { loadServiceValetZones } from '../../../store/reducers/serviceValet/actions';
import { loadTransportationOptions } from '../../../store/reducers/transportationNeeds/actions';
import { useDispatch } from 'react-redux';
import { IServiceCenter } from '../../../store/reducers/serviceCenters/types';

export function useLoadSCData(open: boolean, selectedSC: IServiceCenter | undefined) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedSC && open) {
      dispatch(loadSCAdvisors(selectedSC.id));
      dispatch(loadSCEmployees(selectedSC.id));
      dispatch(loadSCRequestsShort(selectedSC.id));
      dispatch(loadMakesGlobally(selectedSC.id));
      dispatch(loadMobServiceZones(selectedSC.id));
      dispatch(loadServiceValetZones(selectedSC.id));
      dispatch(loadEngineType(selectedSC.id));
      dispatch(loadTransportationOptions(selectedSC.id));
    }
  }, [selectedSC, open, dispatch]);
}
