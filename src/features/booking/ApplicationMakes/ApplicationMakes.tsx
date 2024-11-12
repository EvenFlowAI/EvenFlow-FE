import React, {useEffect, useState} from 'react';
import {SaveEditBlock} from "../../../components/buttons/SaveEditBlock/SaveEditBlock";
import {WrapperFlexEnd, WrapperJustify} from "../../../components/styled/WrappersFlex";
import Filters from "./Filters/Filters";
import {IOrder} from "../../../types/types";
import StatisticBlock from "./StatisticBlock/StatisticBlock";
import {useDispatch, useSelector} from "react-redux";
import {loadGlobalMakes} from "../../../store/reducers/globalVehicles/actions";
import {RootState} from "../../../store/rootReducer";
import MakesTable, {initialOrder} from "./MakesTable/MakesTable";
import {useStatePagination} from "../../../hooks/usePaginations/usePaginations";
import {IGlobalMake, TOption, TReviewOption} from "../../../store/reducers/globalVehicles/types";

export const reviewOptions: TReviewOption[] = ["Not Reviewed", "Confirmed", "Override"];

const ApplicationMakes = () => {
    const {isLoading} = useSelector((state: RootState) => state.globalVehicles);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [selectedMake, setSelectedMake] = useState<TOption|null>(null);
    const [selectedStatus, setSelectedStatus] = useState<TReviewOption|null>(null);
    const [data, setData] = useState<IGlobalMake[]>([]);
    const [order, setOrder] = useState<IOrder<IGlobalMake>>(initialOrder)
    const {pageData, onChangePage, onChangeRowsPerPage} = useStatePagination();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadGlobalMakes(pageData, order, selectedStatus))
    }, [pageData, order, selectedStatus])

    const onCancel = () => {
        setEdit(false)
    }
    const onSave = () => {
        onCancel()
    }

    const onMakeChange = (e: React.ChangeEvent<{}>, option: TOption) => {
        setSelectedMake(option)
    }

    const onStatusChange = (e: React.ChangeEvent<{}>, option: TReviewOption) => {
        setSelectedStatus(option)
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
                    onMakeChange={onMakeChange}
                    onStatusChange={onStatusChange}
                    isLoading={isLoading}
                    selectedMake={selectedMake}
                    selectedStatus={selectedStatus}/>
            </WrapperJustify>
            <MakesTable
                data={data}
                setData={setData}
                order={order}
                setOrder={setOrder}
                isEdit={isEdit}
                onChangePage={onChangePage}
                pageData={pageData}
                onChangeRowsPerPage={onChangeRowsPerPage}/>
        </div>
    );
};

export default ApplicationMakes;