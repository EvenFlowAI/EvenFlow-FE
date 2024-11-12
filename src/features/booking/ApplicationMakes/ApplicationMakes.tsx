import React, {useEffect, useState} from 'react';
import {SaveEditBlock} from "../../../components/buttons/SaveEditBlock/SaveEditBlock";
import {WrapperFlexEnd, WrapperJustify} from "../../../components/styled/WrappersFlex";
import Filters from "./Filters/Filters";
import {TArgCallback} from "../../../types/types";
import StatisticBlock from "./StatisticBlock/StatisticBlock";
import {useDispatch} from "react-redux";
import {loadGlobalMakes} from "../../../store/reducers/globalVehicles/actions";

const ApplicationMakes = () => {
    const [isEdit, setEdit] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [selectedMake, setSelectedMake] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<any>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadGlobalMakes())
    }, [])

    const onCancel = () => {
        setEdit(false)
    }
    const onSave = () => {
        onCancel()
    }

    const onMakeChange: TArgCallback<any> = (make) => {}

    const onStatusChange: TArgCallback<any> = (status) => {}

    return (
        <div>
            <WrapperFlexEnd style={{marginBottom: 16}}>
                <SaveEditBlock
                    onSave={onSave}
                    onEdit={() => setEdit(true)}
                    onCancel={onCancel}
                    isEdit={isEdit}
                    isSaving={isLoading}/>
            </WrapperFlexEnd>
            <WrapperJustify>
                <StatisticBlock/>
                <Filters
                    onMakeChange={onMakeChange}
                    onStatusChange={onStatusChange}
                    isLoading={isLoading}
                    selectedMake={selectedMake}
                    selectedStatus={selectedStatus}/>
            </WrapperJustify>
        </div>
    );
};

export default ApplicationMakes;