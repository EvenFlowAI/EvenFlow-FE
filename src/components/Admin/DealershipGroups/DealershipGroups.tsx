import React from "react";
import {Table} from "../../UI/Table";
import {IconButton} from "@material-ui/core";
import {Edit, Visibility} from "@material-ui/icons";
import {TableRowDataType} from "../../UI/types";
import {IDealershipGroup} from "../../../store/reducers/dealershipGroups/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import * as dealershipActions from "../../../store/reducers/dealershipGroups/actions";


const rowData: TableRowDataType<IDealershipGroup>[] = [
    {val: el => el.name, header: "Dealership name"},
    {val: el => el.serviceCenters.toString(), header: "Service centers", align: "center"},
    {val: el => el.employees.toString(), header: "Employees", align: "center"},
    {val: el => el.mainAddress, header: "Main Address"}
];


export const DealershipGroups = () => {
    const handleView = (el: IDealershipGroup) => () => alert(`View ${el.name}`);
    const handleEdit = (el: IDealershipGroup) => () => alert(`Update ${el.name}`);
    const viewActions = (el: IDealershipGroup) => (<>
        <IconButton size="small" onClick={handleView(el)}><Visibility /></IconButton>
        <IconButton size="small" style={{marginLeft: 8}} onClick={handleEdit(el)}><Edit /></IconButton>
    </>);

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(dealershipActions.loadAll());
    }, [dispatch]);

    const {data, isLoading} = useSelector((state: RootState) => {
        return {
            data: state.dealershipGroups.dealershipList,
            isLoading: state.dealershipGroups.loading
        }
    });

    return <Table
        data={data}
        noDataTitle="No service centers present"
        isLoading={isLoading}
        rowData={rowData}
        index="name"
        actions={viewActions}
    />
}