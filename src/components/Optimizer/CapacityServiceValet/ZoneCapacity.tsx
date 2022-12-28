import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {ETimeWindows, EZoneTimeGap} from "../../../store/reducers/capacityServiceValet/types";
import {
    ControlsWrapper,
    CustomPaper,
    CustomRadioGroup,
    RadioLabel,
    RadioWrapper,
    useZoneStyles
} from "./styledComponents";
import {Button, CircularProgress, FormControlLabel, Radio} from "@material-ui/core";
import moment from "moment";
import {generateTimeSlots} from "./utils";

const timeWindowNames = [
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

const ZoneCapacity = () => {
    const {zones, isLoading: isZonesLoading} = useSelector((state: RootState) => state.serviceValet);
    const {zoneTimeWindows, zoneCapacity, isLoading} = useSelector((state: RootState) => state.capacityServiceValet);
    const {slotRange} = useSelector((state: RootState) => state.slotScoring);
    const [gap, setGap] = useState<EZoneTimeGap>(EZoneTimeGap.Medium);
    const [slots, setSlots] = useState<moment.Moment[]>([]);
    const [isEdit, setEdit] = useState<boolean>(false);
    const classes = useZoneStyles();

    useEffect(() => {
        setSlots(generateTimeSlots(gap, slotRange?.start, slotRange?.end))
    }, [gap, slotRange])

    const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setEdit && setGap(Number(value) as EZoneTimeGap)
    }

    const handleEditCancel = () => {
        setEdit(false)
    }

    const handleSave = () => {
        setEdit(false)
    }

    const onReservationClick = (zoneId: number, timeWindowType: ETimeWindows) => {
        console.log(zoneId, timeWindowType)
    }

    return <CustomPaper variant="outlined">
            <ControlsWrapper>
                <RadioWrapper>
                    <RadioLabel>Gap Slots:</RadioLabel>
                    <CustomRadioGroup
                        value={gap}
                        onChange={handleGapChange}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group">
                        <FormControlLabel
                            value={EZoneTimeGap.Small}
                            disabled={isLoading || isZonesLoading}
                            control={<Radio color="primary" size="small"/>}
                            label="15 min" />
                        <FormControlLabel
                            value={EZoneTimeGap.Medium}
                            disabled={isLoading || isZonesLoading}
                            control={<Radio color="primary" size="small"/>}
                            label="30 min" />
                        <FormControlLabel
                            value={EZoneTimeGap.Large}
                            disabled={isLoading || isZonesLoading}
                            control={<Radio color="primary" size="small"/>}
                            label="60 min" />
                    </CustomRadioGroup>
                </RadioWrapper>
                {isEdit
                    ? isLoading ? <CircularProgress color="primary" className={classes.progress} />
                        : <div className={classes.editSaveButtons}>
                            <Button
                                className={classes.editButton}
                                color="secondary"
                                onClick={handleEditCancel}>
                                Cancel
                            </Button>
                            <Button
                                className={classes.editButton}
                                color="primary"
                                onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    : <Button
                        color="primary"
                        className={classes.editButton}
                        onClick={() => setEdit(true)}>
                        Edit
                    </Button>
                }
            </ControlsWrapper>
            <div className={classes.tableWrapper} style={{
                gridTemplateColumns: `135px ${zoneCapacity.map(() => '210px').join(' ')}`,
                gridTemplateRows:`${slots.map(() => '1fr')}`,
                columnGap: 23,
            }}>
                {slots.map((item, index ) => {
                        return <div key={item.toISOString()} style={{
                            gridColumnStart: 1,
                            gridColumnEnd: 2,
                            gridRowStart: index + 1,
                            gridRowEnd: index + 2,
                            padding: '16px 24px',
                            fontSize: 16,
                            fontWeight: 600,
                            backgroundColor: index % 2 === 0 ? '#F2F3F7' : 'transparent',
                            borderRight: '1px solid #DADADA'
                        }}>
                            {moment(item).format('H:mm a')}
                        </div>
                    })
                }
                {!!slots.length && zoneCapacity.map((zone, zoneIndex) => {
                    return zone.timeWindows.map((timeWindow, windowIndex) => {
                        const rowStartIndex = slots.findIndex(slot => moment(slot).format('H:mm a') === moment(timeWindow.start, 'H:mm').format('H:mm a'))
                        const rowEndIndex = slots.findIndex(slot => moment(slot).format('H:mm a') === moment(timeWindow.end, 'H:mm').format('H:mm a'))
                        return <div key={timeWindow.start + timeWindow.timeWindowType + zone.zoneId} style={{
                            gridColumnStart: zoneIndex + 2,
                            gridColumnEnd: zoneIndex + 3,
                            gridRowStart: rowStartIndex + 1,
                            gridRowEnd: rowEndIndex + 1,
                            backgroundColor: '#F7F8FB',
                            border: '1px solid #DADADA',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                fontSize: 17,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: 16,
                                marginBottom: 20,
                            }}>
                                {timeWindowNames[timeWindow.timeWindowType]}
                            </div>
                            <Button variant="contained" color="primary" onClick={() => onReservationClick(zone.zoneId, timeWindow.timeWindowType)}>{timeWindow.reservationsCount}</Button>
                        </div>
                    })
                })
                }
            </div>
        </CustomPaper>;
};

export default ZoneCapacity;