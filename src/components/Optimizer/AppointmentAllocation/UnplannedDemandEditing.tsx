import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {
    IRemappedUnplannedDemandBySlot,
    IUnplannedDemand,
    IUnplannedDemandBySlot
} from "../../../store/reducers/demandSegments/types";
import moment from "moment";
import {SaveEditBlock} from "./UI";
import {makeStyles} from "@material-ui/core/styles";
import UnplannedDemandSlots from "./UnplannedDemandSlots";
import {ETimeSlotType} from "../../../store/reducers/slotScoring/types";

type TUnplannedDemandEditingProps = {
    isEdit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>;
    editingElement: IUnplannedDemand|null;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: "#FFFFFF",
        border: '1px solid #DADADA',
        overflowX: 'auto',
    },
    titleLine: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
        padding: '12px 36px',
    },
    title: {
        fontSize: 16,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    tablesWrapper: {
        display: 'flex',
    },
    dayName:{
        fontSize: 16,
        fontWeight: 700,
    }
}))

const mockSlots = [
    {
        id: 1,
        day: 0,
        start: "08:00:00",
        end: "08:30:00",
        optimizerSetting: 0,
        timeSlotType: ETimeSlotType.ThirtyMinutes,
    },
    {
        id: 2,
        day: 0,
        start: "08:30:00",
        end: "09:00:00",
        optimizerSetting: 0,
        timeSlotType: ETimeSlotType.ThirtyMinutes,
    },
    {
        id: 3,
        day: 0,
        start: "09:00:00",
        end: "09:30:00",
        optimizerSetting: 0,
        timeSlotType: ETimeSlotType.ThirtyMinutes,
    },
    {
        id: 4,
        day: 0,
        start: "09:30:00",
        end: "10:00:00",
        optimizerSetting: 0,
        timeSlotType: ETimeSlotType.ThirtyMinutes,
    },
    {
        id: 5,
        day: 0,
        start: "10:00:00",
        end: "10:30:00",
        optimizerSetting: 0,
        timeSlotType: ETimeSlotType.ThirtyMinutes,
    },
    {
        id: 6,
        day: 0,
        start: "10:30:00",
        end: "11:00:00",
        optimizerSetting: 0,
        timeSlotType: ETimeSlotType.ThirtyMinutes,
    }
]

const remapSlots = (slots: IUnplannedDemandBySlot[]): IRemappedUnplannedDemandBySlot[] => {
    return slots.map((item, index) => ({...item, orderIndex: index}))
}

const UnplannedDemandEditing: React.FC<TUnplannedDemandEditingProps> = ({ setEdit, isEdit, editingElement }) => {
    const [demandSlots, setDemandSlots] = useState<IRemappedUnplannedDemandBySlot[]>([]);
    // todo loading from redux
    let isSaving = false;
    const classes = useStyles();

    const [slots1, slots2] = useMemo(() => {
        const half = Math.floor(demandSlots.length / 2);
        return [demandSlots.slice(0, half), demandSlots.slice(half)];
    }, [demandSlots]);

    useEffect(() => {
        // todo request by day of week and remap them in the redux thunk action
        setDemandSlots(remapSlots(mockSlots))
    }, [])

    const handleSave = () => {
        // todo save data request
    }

    const handleCancel = () => {
        // todo set initial data
        setEdit(false);
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.titleLine}>
                <div className={classes.dayName}>
                    {editingElement ? moment().set('day', editingElement?.day).format('dddd') : ''}
                </div>
                <div className={classes.title}>Enter The Unplanned Demand By Appointment Slot</div>
                <div>
                    <SaveEditBlock
                        isLowerCase
                        onSave={handleSave}
                        onEdit={() => setEdit(true)}
                        onCancel={handleCancel}
                        isEdit={isEdit}
                        isSaving={isSaving}
                    />
                </div>
            </div>
            <div className={classes.tablesWrapper}>
            <UnplannedDemandSlots slots={slots1} setDemandSlots={setDemandSlots}/>
            <UnplannedDemandSlots slots={slots2} setDemandSlots={setDemandSlots}/>
            </div>
        </div>
    );
};

export default UnplannedDemandEditing;