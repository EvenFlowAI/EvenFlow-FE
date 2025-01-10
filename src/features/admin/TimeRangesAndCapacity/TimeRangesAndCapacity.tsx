import React, { useEffect, useState } from 'react';
import { ITimeRangeAndCapacity } from '../../../store/reducers/capacityServiceValet/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { Table } from '../../../components/tables/Table/Table';
import { Button } from '@mui/material';
import EditTimeRangeAndCapacityModal from './EditTimeRangeAndCapacityModal/EditTimeRangeAndCapacityModal';
import { loadTimeRangesAndCapacity } from '../../../store/reducers/capacityServiceValet/actions';
import { timeWithSecond } from './constants';
import { TableRowDataType } from '../../../types/types';
import { useModal } from '../../../hooks/useModal/useModal';
import { useSCs } from '../../../hooks/useSCs/useSCs';
import { time24HourFormat } from '../../../utils/constants';
import dayjs from 'dayjs';

const TimeRangesAndCapacity = () => {
  const { timeRangesAndCapacity, isLoading } = useSelector(
    (state: RootState) => state.capacityServiceValet
  );
  const [tableData, setTableData] = useState<ITimeRangeAndCapacity[]>([]);
  const [currentRange, setCurrentRange] = useState<ITimeRangeAndCapacity | null>(null);
  const { onOpen, isOpen, onClose } = useModal();
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();

  useEffect(() => {
    selectedSC && dispatch(loadTimeRangesAndCapacity(selectedSC.id));
  }, [selectedSC]);

  useEffect(() => {
    if (selectedSC) {
      setTableData(() => {
        return [1, 2, 3, 4, 5, 6, 0].map(day => {
          const timeRange = timeRangesAndCapacity.find(item => item.dayOfWeek === day);
          return {
            serviceCenterId: selectedSC.id,
            dayOfWeek: day,
            pickUpMin: timeRange?.pickUpMin
              ? dayjs(timeRange?.pickUpMin, timeWithSecond).format(time24HourFormat)
              : '-',
            pickUpMax: timeRange?.pickUpMax
              ? dayjs(timeRange?.pickUpMax, timeWithSecond).format(time24HourFormat)
              : '-',
            dropOffMin: timeRange?.dropOffMin
              ? dayjs(timeRange?.dropOffMin, timeWithSecond).format(time24HourFormat)
              : '-',
            dropOffMax: timeRange?.dropOffMax
              ? dayjs(timeRange?.dropOffMax, timeWithSecond).format(time24HourFormat)
              : '-',
            capacity: timeRange?.capacity ?? 0,
            id: timeRange?.id ?? 0,
          };
        });
      });
    }
  }, [timeRangesAndCapacity]);

  const onEdit = async (el: ITimeRangeAndCapacity) => {
    await setCurrentRange(el);
    await onOpen();
  };

  const RowData: TableRowDataType<ITimeRangeAndCapacity>[] = [
    {
      header: 'Day Of Week',
      val: el =>
        typeof el.dayOfWeek !== 'undefined' ? dayjs().set('day', el.dayOfWeek).format('dddd') : '',
    },
    {
      header: 'Pick Up Min',
      align: 'center',
      val: el => el.pickUpMin,
    },
    {
      header: 'Pick Up Max',
      align: 'center',
      val: el => el.pickUpMax,
    },
    {
      header: 'Drop Off Min',
      align: 'center',
      val: el => el.dropOffMin,
    },
    {
      header: 'Drop Off Max',
      align: 'center',
      val: el => el.dropOffMax,
    },
    {
      header: 'Daily Capacity',
      align: 'center',
      val: el => el.capacity.toString(),
    },
    {
      header: '',
      align: 'center',
      val: el => (
        <Button
          color="primary"
          style={{ textTransform: 'none' }}
          variant="text"
          onClick={() => onEdit(el)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <Table<ITimeRangeAndCapacity>
            data={tableData}
            index={'dayOfWeek'}
            rowData={RowData}
            hidePagination
          />
        </div>
      )}
      {currentRange && (
        <EditTimeRangeAndCapacityModal
          open={isOpen}
          editingElement={currentRange}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default TimeRangesAndCapacity;
