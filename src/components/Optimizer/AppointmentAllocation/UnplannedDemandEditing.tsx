import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import {EDay, IUnplannedDemandBySlot} from "../../../store/reducers/demandSegments/types";
import moment from "moment";
import {SaveEditBlock} from "./UI";
import {makeStyles} from "@material-ui/core/styles";
import {Autocomplete} from "@material-ui/lab";
import {autocompleteRender} from "../../UI/AutocompleteRender";

type TUnplannedDemandEditingProps = {
    isEdit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>;
}

type TOption = {
    name: string;
    value: number;
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
    }
}))

const daysOptions = Object.values(EDay)
    .filter(key => !isNaN(Number(key)))
    .map(value => ({name: moment().set('day', +value).format('dddd'), value: +value}));

const UnplannedDemandEditing: React.FC<TUnplannedDemandEditingProps> = ({ setEdit, isEdit }) => {
    const [demandSlots, setDemandSlots] = useState<IUnplannedDemandBySlot[]>([]);
    const [selectedDay, setSelectedDay] = useState<TOption>(daysOptions[0]);
    // todo loading from redux
    let isSaving = false;
    const classes = useStyles();

    const [slots1, slots2] = useMemo(() => {
        const half = Math.floor(demandSlots.length / 2);
        return [demandSlots.slice(0, half), demandSlots.slice(half)];
    }, [demandSlots]);

    useEffect(() => {
        // todo request by day of week
    }, [])

    const handleSave = () => {
        // todo save data request
    }

    const handleCancel = () => {
        // todo set initial data
        setEdit(false);
    }

    const onDayChange = (e: React.ChangeEvent<{}>, option: TOption) => {
        setSelectedDay(option)
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.titleLine}>
                <div style={{width: '15%'}}>
                    <Autocomplete
                        disableClearable
                        fullWidth
                        value={selectedDay}
                        onChange={onDayChange}
                        getOptionLabel={o => o.name}
                        renderInput={autocompleteRender({
                            label: '',
                            placeholder: '',
                        })}
                        options={daysOptions}
                    />
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
        </div>
    );
};

export default UnplannedDemandEditing;