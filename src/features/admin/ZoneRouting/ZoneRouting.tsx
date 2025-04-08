import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import Checkbox from '../../../components/formControls/Checkbox/Checkbox';
import {
  EDaysFromMonday,
  IZonesRoutingByDay,
} from '../../../store/reducers/capacityServiceValet/types';
import { Table } from '../../../components/tables/Table/Table';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import {
  loadZonesRouting,
  updateZonesRouting,
} from '../../../store/reducers/capacityServiceValet/actions';
import { EDay } from '../../../store/reducers/demandSegments/types';
import { TableRowDataType } from '../../../types/types';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { CheckBox } from '@mui/icons-material';

const dayNames = Object.keys(EDay).filter(key => Number.isNaN(+key));

const ZoneRouting = ({ serviceType }: { serviceType: string }) => {
  const { zones: serviceValetZones, isLoading: isServiceValetZonesLoading } = useSelector(
    (state: RootState) => state.serviceValet
  );
  const { zones: mobileZones, isLoading: isMobileZonesLoading } = useSelector(
    (state: RootState) => state.mobileService
  );
  const { zonesRouting, isLoading } = useSelector((state: RootState) => state.capacityServiceValet);
  const [initialZones, setInitialZones] = useState<IZonesRoutingByDay[]>([]);
  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedSC) dispatch(loadZonesRouting(selectedSC.id, serviceType));
  }, [selectedSC, dispatch, serviceType]);

  useEffect(() => {
    setInitialZones(
      [1, 2, 3, 4, 5, 6, 0].map(item => {
        const existingDay = zonesRouting.find(el => el.dayOfWeek.toString() === item.toString());
        return existingDay ?? { dayOfWeek: item, geographicZoneIds: [] };
      })
    );
  }, [zonesRouting]);

  const onCheckboxChange =
    (zoneId: number, dayOfWeek: EDaysFromMonday) => (e: any, checked: boolean) => {
      const dayOfWeekData = initialZones.find(item => item.dayOfWeek === dayOfWeek);
      if (dayOfWeekData && selectedSC) {
        let updatedData: IZonesRoutingByDay = { ...dayOfWeekData };
        if (checked) {
          updatedData = {
            ...updatedData,
            geographicZoneIds: [...updatedData.geographicZoneIds, zoneId],
          };
        } else {
          updatedData = {
            ...updatedData,
            geographicZoneIds: updatedData.geographicZoneIds.filter(el => el !== zoneId),
          };
        }
        const data = zonesRouting.filter(item => item.dayOfWeek !== dayOfWeek).concat(updatedData);
        dispatch(updateZonesRouting(selectedSC.id, data, serviceType));
      }
    };

  const getRowData = (): TableRowDataType<IZonesRoutingByDay>[] => {
    const data: TableRowDataType<IZonesRoutingByDay>[] = [
      {
        header: 'Day Of Week',
        width: 200,
        val: el => dayNames[el.dayOfWeek].toString(),
      },
    ];
    const zonesData: TableRowDataType<IZonesRoutingByDay>[] = (
      serviceType === 'PickUpDropOff' ? serviceValetZones : mobileZones
    ).map(item => {
      return {
        header: item.name,
        width: 100,
        val: el => (
          <Checkbox
            color="primary"
            style={{ padding: '0' }}
            checkedIcon={<CheckBox />}
            checked={Boolean(el.geographicZoneIds.find(zoneId => item.id === zoneId))}
            onChange={onCheckboxChange(item.id, el.dayOfWeek)}
          />
        ),
      };
    });
    return [...data, ...zonesData];
  };

  return isLoading || isServiceValetZonesLoading || isMobileZonesLoading ? (
    <Loading />
  ) : (
    <div style={{ overflowX: 'auto' }}>
      <Table<IZonesRoutingByDay>
        data={initialZones}
        index={'dayOfWeek'}
        rowData={getRowData()}
        hidePagination
        borderHeader
      />
    </div>
  );
};

export default ZoneRouting;
