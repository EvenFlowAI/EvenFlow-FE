import React, {useEffect, useState} from 'react';
import {SaveEditBlock} from "../../../components/buttons/SaveEditBlock/SaveEditBlock";
import {WrapperFlexEnd, WrapperJustify} from "../../../components/styled/WrappersFlex";
import Filters from "./Filters/Filters";
import {IOrder} from "../../../types/types";
import StatisticBlock from "./StatisticBlock/StatisticBlock";
import {useDispatch, useSelector} from "react-redux";
import {loadGlobalMakes, updateMakes} from "../../../store/reducers/globalVehicles/actions";
import {RootState} from "../../../store/rootReducer";
import MakesTable from "./MakesTable/MakesTable";
import {useStatePagination} from "../../../hooks/usePaginations/usePaginations";
import {IGlobalMake, TReviewOption} from "../../../store/reducers/globalVehicles/types";
import {initialOrder} from "./utils";
import {useException} from "../../../hooks/useException/useException";
import _ from 'lodash';

const ApplicationMakes = () => {
    const {isLoading, makes} = useSelector((state: RootState) => state.globalVehicles);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [selectedMakes, setSelectedMakes] = useState<IGlobalMake[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<TReviewOption|null>(null);
    const [data, setData] = useState<IGlobalMake[]>([]);
    const [order, setOrder] = useState<IOrder<IGlobalMake>>(initialOrder)
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        const selectedMakesIds = selectedMakes.map(el => el.id);
        dispatch(loadGlobalMakes(pageData, order, selectedStatus, selectedMakesIds))
    }, [pageData, order, selectedStatus, selectedMakes])

    useEffect(() => {
        setData(makes)
    }, [makes])

    const onCancel = () => {
        setData(makes)
        setEdit(false)
    }
    const onSave = () => {
        const items = data.map(el => ({id: el.id, accepted: el.accepted, parentId: el.parent?.id ?? null}))
        const selectedMakesIds = selectedMakes.map(el => el.id);
        dispatch(updateMakes(items, pageData, order, selectedStatus, selectedMakesIds, showError, () => setEdit(false)))
    }

    const onMakesChange = (e: React.ChangeEvent<{}>, option: IGlobalMake[]) => {
        onChangePage(null, 0)
        setSelectedMakes(option)
    }

    const onStatusChange = (e: React.ChangeEvent<{}>, option: TReviewOption) => {
        onChangePage(null, 0)
        setSelectedStatus(option)
    }

    const handlePage = (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number): void => {
        const mappedMakes = makes.map(el => ({...el, parent: el.parent ?? undefined}))
        const mappedData = data.map(el => ({...el, parent: el.parent ?? undefined}))
        const equalItems = mappedData.filter(el => mappedMakes.find(item => _.isEqual(el, item)))
        if (equalItems.length === makes.length) {
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
            <WrapperJustify>
                <StatisticBlock/>
                <Filters
                    disabled={isEdit}
                    onMakesChange={onMakesChange}
                    onStatusChange={onStatusChange}
                    isLoading={isLoading}
                    selectedMake={selectedMakes}
                    selectedStatus={selectedStatus}/>
            </WrapperJustify>
            <MakesTable
                data={data}
                setData={setData}
                order={order}
                setOrder={setOrder}
                isEdit={isEdit}
                onChangePage={handlePage}
                pageData={pageData}
                onChangeRowsPerPage={onChangeRowsPerPage}/>
        </div>
    );
};

export default ApplicationMakes;