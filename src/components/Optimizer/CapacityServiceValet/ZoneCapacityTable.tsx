import React, {useEffect, useState} from 'react';
import {ETimeWindows, EZoneTimeGap, ITimeWindowReservation} from "../../../store/reducers/capacityServiceValet/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";
import {generateTimeSlots} from "./utils";
import {TableWrapper, TimeOfDayWrapper, TimeWindowName} from "./styledComponents";
import {Button, styled, Theme} from "@material-ui/core";
import {Loading} from "../../UI/Loading";
import {useModal} from "../../../utils/hooks";
import EditReservationsCount from "../../Modals/EdirReservationsCount/EdirReservationsCount";

type TZoneCapacityTableProps = {
    gap: EZoneTimeGap;
    isEdit: boolean;
}

export const timeWindowNames = [
    'Time Window 1',
    'Time Window 2',
    'Time Window 3',
    'Time Window 4',
    'Time Window 5',
    'Time Window 6',
    'Time Window 7',
    'Time Window 8',
    'Time Window 9',
    'Time Window 10',
    'Time Window 11',
    'Time Window 12',
    'Drop Off Period',
    'Not Available'
]

const TimeWindow = styled(({zoneIndex, rowStartIndex, rowEndIndex, timeWindowType, ...rest}) => <div {...rest}/>) <Theme, {zoneIndex: number, rowStartIndex: number, rowEndIndex: number, timeWindowType: ETimeWindows}>(
    ({theme, zoneIndex, rowStartIndex, rowEndIndex, timeWindowType}) => ({
        gridColumnStart: zoneIndex + 2,
        gridColumnEnd: zoneIndex + 3,
        gridRowStart: rowStartIndex + 1,
        gridRowEnd: rowEndIndex + 1,
        backgroundColor: timeWindowType !== ETimeWindows.NotAvailable ? '#F7F8FB' : 'transparent',
        border: '1px solid #DADADA',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }))

const HeaderWrapper = styled(({zoneCount, ...rest}) => <div {...rest}/>)<Theme, {zoneCount: number}>(({theme, zoneCount}) => ({
    display: "grid",
    width: 'fit-content',
    gridTemplateColumns: `135px repeat(${zoneCount}, 210px)`,
    gridTemplateRows: '1fr',
    columnGap: 23,
    borderBottom: '1px solid #DADADA',
}))

const ZoneNameWrapper = styled(({index, ...rest}) => <div {...rest}/>)<Theme, {index: number}>(({theme, index}) => ({
    gridColumnStart: index + 2,
    gridColumnEnd: index + 3,
    gridRowStart: 1,
    gridRowEnd: 2,
    padding: '24px 24px 24px 0',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 700,
    color: '#9FA2B4'
}))

const DataGrid = styled(({zoneCapacityCount, slotsCount, ...rest}) => <div {...rest}/>)<Theme, {zoneCapacityCount: number, slotsCount: number}>(({theme, zoneCapacityCount, slotsCount}) => ({
    display: 'grid',
    gridTemplateColumns: `135px repeat(${zoneCapacityCount}, 210px)`,
    gridTemplateRows:`repeat(${slotsCount}, 1fr)`,
    columnGap: 23,
}))

const SlotItem = styled(({index, ...rest}) => <div {...rest}/>)<Theme, {index: number}>(({theme, index}) => ({
    gridColumnStart: 1,
    gridColumnEnd: 2,
    gridRowStart: index + 1,
    gridRowEnd: index + 2,
    padding: '16px 24px',
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: index % 2 === 0 ? '#F2F3F7' : 'transparent',
    borderRight: '1px solid #DADADA'
}))

const ZoneCapacityTable: React.FC<TZoneCapacityTableProps> = ({gap, isEdit}) => {
    const {slotRange} = useSelector((state: RootState) => state.slotScoring);
    const {zones, isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const {zoneCapacity, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const {isOpen, onOpen, onClose} = useModal();
    const [slots, setSlots] = useState<moment.Moment[]>([]);
    const [editingZoneId, setEditingZoneId] = useState<number|null>(null);
    const [editingTimeWindow, setEditingTimeWindow] = useState<ITimeWindowReservation|null>(null);

    useEffect(() => {
        setSlots(generateTimeSlots(gap, slotRange?.start, slotRange?.end))
    }, [slotRange, gap])

    const onReservationClick = async (zoneId: number, timeWindow: ITimeWindowReservation) => {
        await setEditingTimeWindow(timeWindow)
        await setEditingZoneId(zoneId)
        await onOpen();
    }

    return isLoading || isZonesLoading
        ? <Loading/>
        : <TableWrapper>
            <HeaderWrapper zoneCount={zoneCapacity.length}>
                <TimeOfDayWrapper key="time of day">Time Of Day</TimeOfDayWrapper>
                {zones.map((zone, index) => <ZoneNameWrapper key={zone.name} index={index}>{zone.name}</ZoneNameWrapper>)}
            </HeaderWrapper>

            <DataGrid zoneCapacityCount={zoneCapacity.length} slotsCount={slots.length}>
                {slots.map((item, index ) => {
                    return <SlotItem index={index} key={item.toISOString()}>
                        {moment(item).format('H:mm a')}
                    </SlotItem>
                })}

                {Boolean(slots.length) && zoneCapacity.map((zone, zoneIndex) => {
                    return zone.timeWindows.map((timeWindow) => {
                        const rowStartIndex = slots.findIndex(slot => moment(slot).format('H:mm a') === moment(timeWindow.start, 'H:mm').format('H:mm a'))
                        const rowEndIndex = slots.findIndex(slot => moment(slot).format('H:mm a') === moment(timeWindow.end, 'H:mm').format('H:mm a'))

                        return <TimeWindow
                            zoneIndex={zoneIndex}
                            rowStartIndex={rowStartIndex}
                            rowEndIndex={rowEndIndex}
                            key={timeWindow.start + timeWindow.timeWindowType + zone.zoneId}
                            timeWindowType={timeWindow.timeWindowType}>
                            <TimeWindowName>
                                {timeWindowNames[timeWindow.timeWindowType]}
                            </TimeWindowName>
                            {timeWindow.timeWindowType !== ETimeWindows.NotAvailable
                            && <Button
                              variant="contained"
                              color="primary"
                              disabled={!isEdit}
                              onClick={() => onReservationClick(zone.zoneId, timeWindow)}>
                                {timeWindow.reservationsCount}
                            </Button>}
                        </TimeWindow>
                    })
                })
                }
            </DataGrid>
            <EditReservationsCount open={isOpen} zoneId={editingZoneId} timeWindow={editingTimeWindow} onClose={onClose}/>
        </TableWrapper>
};

export default ZoneCapacityTable;