import React, {useEffect, useState} from 'react';
import {WrapperFlexEnd, WrapperJustify} from "../../../components/styled/WrappersFlex";
import {SaveEditBlock} from "../../../components/buttons/SaveEditBlock/SaveEditBlock";
import StatisticBlock from "./StatisticBlock/StatisticBlock";
import Filters from "./Filters/Filters";
import {IOrder} from "../../../types/types";
import {IGlobalMake, IGlobalModel, TReviewOption} from "../../../store/reducers/globalVehicles/types";
import {initialOrder} from "../ApplicationMakes/utils";
import {useStatePagination} from "../../../hooks/usePaginations/usePaginations";
import {useDispatch, useSelector} from "react-redux";
import {useException} from "../../../hooks/useException/useException";
import {loadGlobalModels, loadModelStatistic, updateModels} from "../../../store/reducers/globalVehicles/actions";
import {RootState} from "../../../store/rootReducer";
import {isEqual} from "lodash";
import ModelsTable from "./ModelsTable/ModelsTable";

const ApplicationModels = () => {
    const {isLoading, models, allModelsOptions} = useSelector((state: RootState) => state.globalVehicles);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [selectedMake, setSelectedMake] = useState<IGlobalMake|null>(null);
    const [selectedModels, setSelectedModels] = useState<IGlobalModel[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<TReviewOption|null>(null);
    const [filteredModels, setFilteredModels] = useState<IGlobalModel[]>([]);
    const [data, setData] = useState<IGlobalModel[]>([]);
    const [order, setOrder] = useState<IOrder<IGlobalModel>>(initialOrder)
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        dispatch(loadModelStatistic())
    }, [])

    useEffect(() => {
        setFilteredModels(allModelsOptions)
    }, [allModelsOptions])

    useEffect(() => {
        const selectedModelsIds = selectedModels.map(el => el.id);
        dispatch(loadGlobalModels(pageData, order, selectedStatus, selectedMake?.id, selectedModelsIds))
    }, [pageData, selectedModels, order, selectedStatus, selectedMake])

    useEffect(() => {
        setData(models)
    }, [models])

    const onCancel = () => {
        setData(models)
        setEdit(false)
    }
    const onSave = () => {
        const items = data.map(el => ({id: el.id, accepted: el.accepted, parentId: el.parent?.id ?? null}))
        const selectedModelsIds = selectedModels.map(el => el.id);
        dispatch(updateModels(
            items,
            pageData,
            order,
            selectedStatus,
            selectedMake?.id,
            selectedModelsIds,
            showError,
            () => setEdit(false)))
    }

    const onMakeChange = (e: React.ChangeEvent<{}>, option: IGlobalMake|null) => {
        onChangePage(null, 0)
        setSelectedMake(option)
        setFilteredModels(option ? allModelsOptions.filter(el => el.make.id === option?.id) : allModelsOptions)
        setSelectedModels([]);
    }

    const onModelsChange = (e: React.ChangeEvent<{}>, option: IGlobalModel[]) => {
        onChangePage(null, 0)
        setSelectedModels(option)
    }

    const onStatusChange = (e: React.ChangeEvent<{}>, option: TReviewOption) => {
        onChangePage(null, 0)
        setSelectedStatus(option)
    }

    const handlePage = (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number): void => {
        const mappedModels = models.map(el => ({...el, parent: el.parent ?? undefined}))
        const mappedData = data.map(el => ({...el, parent: el.parent ?? undefined}))
        const equalItems = mappedData.filter(el => mappedModels.find(item => isEqual(el, item)))
        if (equalItems.length === models.length) {
            onChangePage(e, pageIndex)
        } else {
            showError('Please save the changes first')
        }
    }

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
            <WrapperJustify style={{marginBottom: 44}}>
                <StatisticBlock/>
                <Filters
                    modelsOptions={filteredModels}
                    onModelsChange={onModelsChange}
                    onMakeChange={onMakeChange}
                    onStatusChange={onStatusChange}
                    selectedModel={selectedModels}
                    isLoading={isLoading}
                    selectedMake={selectedMake}
                    selectedStatus={selectedStatus}/>
            </WrapperJustify>
            <ModelsTable
                order={order}
                setOrder={setOrder}
                onChangePage={handlePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
                data={data}
                pageData={pageData}
                setData={setData}
                isEdit={isEdit}/>
        </div>
    );
};

export default ApplicationModels;