import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import {
    IUnplannedDemand,
    IUnplannedDemandBySlot, IUnplannedDemandSlotsRequest
} from "../../../store/reducers/demandSegments/types";
import moment from "moment";
import {SaveEditBlock} from "./UI";
import {makeStyles} from "@material-ui/core/styles";
import UnplannedDemandSlots from "./UnplannedDemandSlots";
import {timeSpanString} from "../../../config/constants";
import {useException, useMessage, useSCs, useSelectedPod} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {changeUnplannedSlots, loadUnplannedSlots} from "../../../store/reducers/demandSegments/actions";
import {RootState} from "../../../store/rootReducer";
import {Loading} from "../../UI/Loading";
import {Divider} from "@material-ui/core";

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
        padding: '12px 36px 0 36px',
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
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        paddingBottom: 36,
    }
}))

export const sortSlots = (slots: IUnplannedDemandBySlot[]): IUnplannedDemandBySlot[] => {
    return slots.sort((a, b) => {
        return moment(a.start, timeSpanString).diff(moment(b.start, timeSpanString)) > 0 ? 1 : -1
    })
}

const UnplannedDemandEditing: React.FC<TUnplannedDemandEditingProps> = ({ setEdit, isEdit, editingElement }) => {
    const {unplannedSlots, isSlotsLoading} = useSelector((state: RootState) => state.demandSegments);
    const [slots1, setSlots1] = useState<IUnplannedDemandBySlot[]>([]);
    const [slots2, setSlots2] = useState<IUnplannedDemandBySlot[]>([]);
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();
    const dispatch = useDispatch();
    const classes = useStyles();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (selectedSC && editingElement) {
            const data: IUnplannedDemandSlotsRequest = {
                serviceCenterId: selectedSC.id,
                podId: selectedPod?.id,
                day: editingElement?.day
            }
            dispatch(loadUnplannedSlots(data))
        }
    }, [selectedSC, editingElement, selectedPod])

    const setInitialData = useCallback(() => {
        const half = Math.floor(unplannedSlots.length / 2);
        setSlots1(unplannedSlots.slice(0, half));
        setSlots2(unplannedSlots.slice(half));
    }, [unplannedSlots])

    useEffect(() => {
        setInitialData()
    }, [setInitialData])

    const handleCancel = useCallback(() => {
        setInitialData()
        setEdit(false);
    }, [setInitialData])

    const onSuccess = () => {
        showMessage("Unplanned Demand Updated");
        handleCancel()
    }

    const handleSave = () => {
        if (selectedSC && editingElement) {
            const items = [...slots1, ...slots2]
                .map(item => ({...item, amount: +item.amount}))
            const data = {
                items,
                day: editingElement.day,
                serviceCenterId: selectedSC.id,
                podId: selectedPod?.id
            }
            dispatch(changeUnplannedSlots(data, showError, onSuccess))
        }
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
                        isSaving={isSlotsLoading}
                    />
                </div>
            </div>
            {isSlotsLoading
                ? <Loading/>
                : slots1.length
                    ?  <div className={classes.tablesWrapper}>
                        <UnplannedDemandSlots slots={slots1} setDemandSlots={setSlots1}/>
                        <UnplannedDemandSlots slots={slots2} setDemandSlots={setSlots2}/>
                    </div>
                    : <div className={classes.text}>
                        <Divider style={{marginBottom: 36}}/>
                        <div>There are no working hours for this day</div>
                    </div>}
        </div>
    );
};

export default UnplannedDemandEditing;