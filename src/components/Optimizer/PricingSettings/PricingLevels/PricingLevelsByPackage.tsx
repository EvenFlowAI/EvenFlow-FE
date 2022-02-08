import React, {useEffect, useState} from 'react';
import {Button} from "@material-ui/core";
import {TableRowDataType} from "../../../UI/types";
import {Table} from "../../../UI/Table";
import {makeStyles} from "@material-ui/core/styles";
import {useModal, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {
    loadMPList,
    loadPackagePricingLevels,
} from "../../../../store/reducers/pricingSettings/actions";
import {EDemandCategory, IGetMPListData} from "../../../../store/reducers/pricingSettings/types";
import EditPackagePricingLevel from "../../../Modals/EditPackagePricingLevel/EditPackagePricingLevel";

export type TPackagePricingLevel = {
    id: number;
    maintenancePackageName: string;
    maintenancePackageId: number;
    discount: string | null;
    premium: string | null;
};

const RowData: TableRowDataType<TPackagePricingLevel>[] = [
    {val: (el: TPackagePricingLevel, index: number) => `${index + 1}`, header: "#"},
    {val: (el: TPackagePricingLevel) => el.maintenancePackageName, header: "MAINTENANCE PACKAGE NAME", width: '45%'},
    {val: (el: TPackagePricingLevel) => `${el.maintenancePackageId}`, header: "MAINTENANCE PACKAGE ID", align: "center"},
    {val: (el: TPackagePricingLevel) => el.discount ? `${el.discount} %` : 'Default', header: "DISCOUNT"},
    {val: (el: TPackagePricingLevel) => el.premium ? `${el.premium} %` : 'Default', header: "PREMIUM"},
];

const useStyles = makeStyles(() => ({
    button: {
        textTransform: 'none',
    },
    tableWrapper: {
        border: '1px solid #DADADA',
        borderRadius: 1,
        margin: 27,
    }
}))

const PricingLevelsByPackage = () => {
    const { mpPricingLevels, isLoading, mpList } = useSelector((state: RootState) => state.pricingSettings);
    const [editElement, setEditElement] = useState<TPackagePricingLevel | null>(null);
    const [data, setData] = useState<TPackagePricingLevel[]>([]);

    const {onOpen, onClose, isOpen} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const classes = useStyles();

    const onEditClick = async (el: TPackagePricingLevel) => {
        await setEditElement(el);
        await onOpen();
    }

    useEffect(() => {
        if (selectedSC) {
            const data: IGetMPListData = {
                serviceCenterId: selectedSC.id,
                pageIndex: 0,
                pageSize: 0,
            }
            dispatch(loadMPList(data));
            dispatch(loadPackagePricingLevels(selectedSC.id));
        }
    }, [selectedSC])

    useEffect(() => {
        if (mpList && mpPricingLevels) {
            setData(() => {
                return mpList.map(item => {
                    const levelsItem = mpPricingLevels.find(el => el.maintenancePackageId === item.id);
                    let discount = null;
                    let premium = null;
                    if (levelsItem?.values) {
                        const low = levelsItem.values.find(el => el.demandCategory === EDemandCategory.Low);
                        const high = levelsItem.values.find(el => el.demandCategory === EDemandCategory.High);
                        if (low) discount = low.value.toString();
                        if (high) premium = high.value.toString();
                    }
                    return {
                        id: item.id,
                        maintenancePackageId: item.id,
                        maintenancePackageName: item.name,
                        discount,
                        premium,
                    }
                })
            })
        }
    }, [mpList, mpPricingLevels])

    const tableActions = (el: TPackagePricingLevel) => {
        return <Button
            className={classes.button}
            key={el.maintenancePackageId}
            variant="text"
            color="primary"
            onClick={() => onEditClick(el)}>
            Edit
        </Button>
    }

    return <div className={classes.tableWrapper}>
            <Table
                data={data}
                index="id"
                rowData={RowData}
                actions={tableActions}
                isLoading={isLoading}
                smallHeaderFont
                hidePagination
                borderHeader
                compact
            />
            <EditPackagePricingLevel open={isOpen} prisingLevel={editElement} onClose={onClose}/>
        </div>
};

export default PricingLevelsByPackage;