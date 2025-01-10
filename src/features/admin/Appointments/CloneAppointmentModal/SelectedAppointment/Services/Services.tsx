import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../store/rootReducer";
import { getServicesForCloning } from "../../../../../../utils/utils";
import { loadSCProfile } from "../../../../../../store/reducers/appointment/actions";
import { useSCs } from "../../../../../../hooks/useSCs/useSCs";

const ServicesList = () => {
  const { currentAppointment } = useSelector(
    (state: RootState) => state.appointments,
  );
  const { scProfile } = useSelector((state: RootState) => state.appointment);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();

  useEffect(() => {
    selectedSC && dispatch(loadSCProfile(selectedSC.id));
  }, [selectedSC]);

  const selectedServices = useMemo(
    () => getServicesForCloning(currentAppointment, scProfile),
    [currentAppointment, scProfile],
  );

  return (
    <div className="service-list">
      {selectedServices.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

export default ServicesList;
