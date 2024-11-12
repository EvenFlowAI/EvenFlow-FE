import React, {Dispatch, SetStateAction} from 'react';
import {IOrder, IPageRequest, TableRowDataType} from "../../../../types/types";
import {IGlobalMake} from "../../../../store/reducers/globalVehicles/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {Autocomplete} from "@mui/material";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import {reviewOptions} from "../ApplicationMakes";

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

export const initialOrder = {
    orderBy: "VinName",
    isAscending: true,
}

const MakesTable: React.FC<TProps> = ({isEdit, pageData, onChangeRowsPerPage, onChangePage, data, setData, order, setOrder}) => {
    const {isLoading, makes} = useSelector((state: RootState) => state.globalVehicles);

    const onReviewChange = (el: IGlobalMake) => (e: React.ChangeEvent<{}>, option: string) => {

    }

    const RowData: TableRowDataType<IGlobalMake>[] = [
        {
            header: "VIN Make",
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
            val: el => el.vehiclesPercentage.toString(),
            orderId: "VehiclesCount",
            align: "left",
        },
        {
            header: "Review",
            val: el => !isEdit
                ? el.accepted ? el.parent ? "Override" : "Confirmed" : "Not Reviewed"
                : <Autocomplete
                    renderInput={autocompleteRender({
                        label: '',
                        placeholder: '',
                    })}
                    fullWidth
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
                ? el.parent?.vinMake ?? ''
                : el.accepted
                    ? <Autocomplete
                        renderInput={autocompleteRender({
                            label: '',
                            placeholder: '',
                        })}
                        fullWidth
                        options={reviewOptions}
                        value={el.accepted ? el.parent ? "Override" : "Confirmed" : "Not Reviewed"}
                        disableClearable
                        onChange={onReviewChange(el)}
                    />
                    : '',
            align: "left",
        }
    ]

    const handleSort = (data: IOrder<IGlobalMake>) => () => {
        console.log(data)
    }

    return (
        <div>

        </div>
    );
};

export default MakesTable;