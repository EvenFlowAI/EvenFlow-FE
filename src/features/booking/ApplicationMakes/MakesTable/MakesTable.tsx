import React, {Dispatch, SetStateAction} from 'react';
import {IOrder, IPageRequest, TableRowDataType} from "../../../../types/types";
import {EReviewStatus, IGlobalMake} from "../../../../store/reducers/globalVehicles/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Autocomplete} from "@mui/material";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {reviewOptions} from "../ApplicationMakes";
import {Table} from "../../../../components/tables/Table/Table";
import {sortMakesById} from "../utils";
import {useAutocompleteStyles} from "../styles";

type TProps = {
    isEdit: boolean;
    pageData: IPageRequest;
    onChangePage: (e: React.MouseEvent<Element, MouseEvent> | null, pageIndex: number) => void;
    onChangeRowsPerPage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    data: IGlobalMake[];
    setData: Dispatch<SetStateAction<IGlobalMake[]>>;
    order: IOrder<IGlobalMake>;
    setOrder: Dispatch<SetStateAction<IOrder<IGlobalMake>>>;
}

const MakesTable: React.FC<TProps> = ({isEdit, pageData, onChangeRowsPerPage, onChangePage, data, setData, order, setOrder}) => {
    const {isLoading, allMakesOptions, makesPagination} = useSelector((state: RootState) => state.globalVehicles);
    const {classes} = useAutocompleteStyles();
    const onReviewChange = (el: IGlobalMake) => (e: React.ChangeEvent<{}>, option: string) => {
        setData(prev => {
            const itemToChange = prev.find(item => item.id === el.id)
            if (itemToChange) {
                const status = option === "Confirmed"
                    ? EReviewStatus.Confirmed
                    : option === "Override"
                        ? EReviewStatus.Override
                        : EReviewStatus.NotReviewed;
                const updated = {...itemToChange, accepted: option !== "Not Reviewed", status}
                const filtered = prev.filter(item => item.id !== el.id)
                return [...filtered, updated].sort(sortMakesById)
            }
            return prev
        })
    }

    const onMakeChange = (el: IGlobalMake) => (e: React.ChangeEvent<{}>, option: IGlobalMake|null) => {
        setData(prev => {
            const itemToChange = prev.find(item => item.id === el.id)
            if (itemToChange) {
                const updated = {...itemToChange, parent: option ?? undefined}
                const filtered = prev.filter(item => item.id !== el.id)
                return [...filtered, updated].sort(sortMakesById)
            }
            return prev
        })
    }

    const RowData: TableRowDataType<IGlobalMake>[] = [
        {
            header: "VIN Make",
            width: 370,
            val: el => el.vinMake,
            orderId: "VinName",
            align: "left",
        },
        {
            header: "Count",
            val: el => el.vehiclesCount.toString(),
            orderId: "VehiclesCount",
            align: "left",
        },
        {
            header: "% of Total",
            val: el => (Math.round(el.vehiclesPercentage * 100) / 100).toFixed(2),
            orderId: "VehiclesCount",
            align: "left",
        },
        {
            header: "Review",
            width: 180,
            val: el => !isEdit
                ? el.accepted ? el.parent ? "Override" : "Confirmed" : "Not Reviewed"
                : <Autocomplete
                    renderInput={autocompleteRender({
                        label: '',
                        placeholder: '',
                    })}
                    style={{margin: '-8.5px -4px', height: 40}}
                    fullWidth
                    classes={classes}
                    options={reviewOptions}
                    value={el.accepted ? el.parent ? "Override" : "Confirmed" : "Not Reviewed"}
                    disableClearable
                    onChange={onReviewChange(el)}
                />,
            align: "left",
        },
        {
            header: "Override Assignment",
            val: el => !isEdit
                ? el.accepted && el.parent?.vinMake ? el.parent?.vinMake : " "
                : el.accepted && el.status === EReviewStatus.Override
                    ? <Autocomplete
                        renderInput={autocompleteRender({
                            label: '',
                            placeholder: 'Not selected',
                        })}
                        fullWidth
                        classes={classes}
                        style={{margin: '-6px -4px', height: 40}}
                        options={allMakesOptions}
                        value={allMakesOptions.find(item => item.id === el.parent?.id)}
                        getOptionLabel={o => o.vinMake}
                        disableClearable
                        onChange={onMakeChange(el)}
                    />
                    : ' ',
            align: "left",
        },
        {
            header: "Evenflow Make",
            width: 184,
            val: el => el.parent?.vinMake ?? el.vinMake,
            align: "left",
        },
    ]

    const handleSort = (data: IOrder<IGlobalMake>) => () => {
        setOrder(prev => ({...data, isAscending: !prev.isAscending}))
    }

    return (
        <Table<IGlobalMake>
            index="localId"
            data={data}
            rowData={RowData}
            rowsPerPage={pageData.pageSize}
            page={pageData.pageIndex}
            count={makesPagination.numberOfRecords}
            onChangeRowsPerPage={onChangeRowsPerPage}
            onChangePage={onChangePage}
            onSort={handleSort}
            hidePagination={makesPagination.numberOfRecords < 10}
            isLoading={isLoading}/>
    );
};

export default MakesTable;