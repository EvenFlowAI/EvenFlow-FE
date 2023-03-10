import React, {useEffect, useState} from 'react';
import {TableRowDataType} from "../../UI/types";
import {ITimeRangeAndCapacity} from "../../../store/reducers/capacityServiceValet/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";
import {Loading} from "../../UI/Loading";
import {Table} from "../../UI/Table";
import {Button} from "@material-ui/core";
import {useModal, useSCs} from "../../../utils/hooks";
import EditTimeRangeAndCapacity from "../../Modals/EditTimeRangeAndCapacity/EditTimeRangeAndCapacity";
import {loadTimeRangesAndCapacity} from "../../../store/reducers/capacityServiceValet/actions";

const timeFormat = "HH:mm A";
const timeWithSecond = "HH:mm:ss";

const TimeRangesAndCapacity = () => {
    const {timeRangesAndCapacity, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const [tableData, setTableData] = useState<ITimeRangeAndCapacity[]>([])
    const [currentRange, setCurrentRange] = useState<ITimeRangeAndCapacity|null>(null)
    const {onOpen, isOpen, onClose} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();

    useEffect(() => {
        selectedSC && dispatch(loadTimeRangesAndCapacity(selectedSC.id))
    }, [selectedSC])

    useEffect(() => {
        if (selectedSC) {
            setTableData(() => {
                return [1, 2, 3, 4, 5, 6, 7].map(day => {
                    const timeRange = timeRangesAndCapacity.find(item =>  item.dayOfWeek === day)
                    return {
                        serviceCenterId: selectedSC.id,
                        dayOfWeek: day,
                        pickUpMin: timeRange?.pickUpMin ? moment(timeRange?.pickUpMin, timeWithSecond).format(timeFormat) : '-',
                        pickUpMax: timeRange?.pickUpMax ? moment(timeRange?.pickUpMax, timeWithSecond).format(timeFormat) : '-',
                        dropOffMin: timeRange?.dropOffMin ? moment(timeRange?.pickUpMax, timeWithSecond).format(timeFormat) : '-',
                        dropOffMax: timeRange?.dropOffMax ? moment(timeRange?.pickUpMax, timeWithSecond).format(timeFormat) : '-',
                        capacity: timeRange?.capacity ?? 0,
                        id: timeRange?.id ?? 0,
                    }
                })
            })
        }
    }, [timeRangesAndCapacity])

    const onEdit = async (el: ITimeRangeAndCapacity) => {
        await setCurrentRange(el)
        await onOpen()
    }

    const RowData: TableRowDataType<ITimeRangeAndCapacity>[] = [
            {
                header: 'Day Of Week'.toUpperCase(),
                val: el => el.dayOfWeek ? moment().set('day', el.dayOfWeek).format('dddd') : '',
            },
            {
                header: 'Pick Up Min'.toUpperCase(),
                align: 'center',
                val: el => el.pickUpMin,
            },
            {
                header: 'Pick Up Max'.toUpperCase(),
                align: 'center',
                val: el => el.pickUpMax,
            },
            {
                header: 'Drop Off Min'.toUpperCase(),
                align: 'center',
                val: el => el.dropOffMin,
            },
            {
                header: 'Drop Off Max'.toUpperCase(),
                align: 'center',
                val: el => el.dropOffMax,
            },
            {
                header: 'Daily Capacity'.toUpperCase(),
                align: 'center',
                val: el => el.capacity.toString(),
            },
            {
                header: '',
                align: 'center',
                val: el => <Button color="primary" style={{textTransform: 'none'}} variant="text" onClick={() => onEdit(el)}>Edit</Button>,
            },
        ]

    return isLoading
        ? <Loading/>
        : <div style={{width: 'fit-content', overflowX: 'auto'}}>
            <Table<ITimeRangeAndCapacity>
                data={tableData}
                index={"dayOfWeek"}
                rowData={RowData}
                hidePagination
            />
            {currentRange && <EditTimeRangeAndCapacity open={isOpen} editingElement={currentRange} onClose={onClose}/>}
        </div>
};

export default TimeRangesAndCapacity;