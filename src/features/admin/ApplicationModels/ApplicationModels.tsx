import React, {useEffect, useState} from 'react';
import {WrapperJustify} from "../../../components/styled/WrappersFlex";
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
    const [selectedMakes, setSelectedMakes] = useState<IGlobalMake[]>([]);
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
        const selectedMakesIds = selectedMakes.map(el => el.id);
        dispatch(loadGlobalModels(pageData, order, selectedStatus, selectedMakesIds, selectedModelsIds))
    }, [pageData, selectedModels, order, selectedStatus, selectedMakes])

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
        const selectedMakesIds = selectedMakes.map(el => el.id);
        dispatch(updateModels(
            items,
            pageData,
            order,
            selectedStatus,
            selectedMakesIds,
            selectedModelsIds,
            showError,
            () => setEdit(false)))
    }

    const onMakesChange = (e: React.ChangeEvent<{}>, options: IGlobalMake[]) => {
        onChangePage(null, 0)
        setSelectedMakes(options)
        const filteredAll = allModelsOptions.filter(el => options.find(item => item.id === el.make.id))
        const filteredSelected = selectedModels.filter(el => options.find(item => item.id === el.make.id))
        setFilteredModels(options.length ? filteredAll : allModelsOptions)
        setSelectedModels(filteredSelected);
    }

    const onModelsChange = (e: React.ChangeEvent<{}>, option: IGlobalModel[]) => {
        onChangePage(null, 0)
        setSelectedModels(option)
    }

    const onStatusChange = (e: React.ChangeEvent<{}>, option: TReviewOption|null) => {
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
            <WrapperJustify style={{marginBottom: 16}}>
                <StatisticBlock/>
                <SaveEditBlock
                    onSave={onSave}
                    onEdit={() => setEdit(true)}
                    onCancel={onCancel}
                    isEdit={isEdit}
                    isSaving={isLoading}/>
            </WrapperJustify>
            <WrapperJustify style={{marginBottom: 24}}>
                <Filters
                    modelsOptions={filteredModels}
                    onModelsChange={onModelsChange}
                    onMakesChange={onMakesChange}
                    onStatusChange={onStatusChange}
                    disabled={isEdit}
                    selectedModel={selectedModels}
                    isLoading={isLoading}
                    selectedMakes={selectedMakes}
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