import React, {useState} from 'react';
import {WrapperFlexEnd, WrapperJustify} from "../../../components/styled/WrappersFlex";
import {SaveEditBlock} from "../../../components/buttons/SaveEditBlock/SaveEditBlock";
import StatisticBlock from "./StatisticBlock/StatisticBlock";
import Filters from "./Filters/Filters";
import {TArgCallback} from "../../../types/types";

const ApplicationModels = () => {
    const [isEdit, setEdit] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [selectedMake, setSelectedMake] = useState<any>(null);
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<any>(null);

    const onCancel = () => {
        setEdit(false)
    }
    const onSave = () => {
        onCancel()
    }

    const onMakeChange: TArgCallback<any> = (make) => {}

    const onModelChange: TArgCallback<any> = (model) => {}

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
                    onModelChange={onModelChange}
                    onMakeChange={onMakeChange}
                    onStatusChange={onStatusChange}
                    selectedModel={selectedModel}
                    isLoading={isLoading}
                    selectedMake={selectedMake}
                    selectedStatus={selectedStatus}/>
            </WrapperJustify>
        </div>
    );
};

export default ApplicationModels;