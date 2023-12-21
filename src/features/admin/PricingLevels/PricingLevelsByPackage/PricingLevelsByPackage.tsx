import React, {useEffect, useState} from 'react';
import {Button} from "@material-ui/core";
import {Table} from "../../../../components/Table/Table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {loadPackageOptionsList, loadPackagePricingLevels,} from "../../../../store/reducers/pricingSettings/actions";
import {EDemandCategory} from "../../../../store/reducers/pricingSettings/types";
import EditPackagePricingLevelModal from "../EditPackagePricingLevelModal/EditPackagePricingLevelModal";
import {TPackagePricingLevel} from "../types";
import {useStyles} from "./styles";
import {TableRowDataType} from "../../../../types/types";
import {useModal} from "../../../../hooks/useModal/useModal";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

const RowData: TableRowDataType<TPackagePricingLevel>[] = [
    {val: (el: TPackagePricingLevel, index: number) => `${index + 1}`, header: "#"},
    {val: (el: TPackagePricingLevel) => el.maintenancePackageName, header: "MAINTENANCE PACKAGE NAME", width: '25%'},
    {val: (el: TPackagePricingLevel) => `${el.maintenancePackageId}`, header: "MAINTENANCE PACKAGE ID", align: "center"},
    {val: (el: TPackagePricingLevel) => el.maintenancePackageOptionName, header: "MAINTENANCE PACKAGE LEVEL", width: '20%'},
    {val: (el: TPackagePricingLevel) => el.discount ? `${el.discount} %` : 'Default', header: "DISCOUNT"},
    {val: (el: TPackagePricingLevel) => el.premium ? `${el.premium} %` : 'Default', header: "PREMIUM"},
];

const PricingLevelsByPackage = () => {
    const { mpPricingLevels, isLoading, mpOptionsList } = useSelector((state: RootState) => state.pricingSettings);
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
            dispatch(loadPackageOptionsList(selectedSC.id));
            dispatch(loadPackagePricingLevels(selectedSC.id));
        }
    }, [selectedSC])

    useEffect(() => {
        if (mpOptionsList && mpPricingLevels) {
            setData(() => {
                return mpOptionsList.map(item => {
                    const levelsItem = mpPricingLevels.find(el => el.maintenancePackageOptionId === item.maintenancePackageOptionId);
                    let discount = null;
                    let premium = null;
                    if (levelsItem?.values) {
                        const low = levelsItem.values.find(el => el.demandCategory === EDemandCategory.Low);
                        const high = levelsItem.values.find(el => el.demandCategory === EDemandCategory.High);
                        if (low) discount = low.value.toString();
                        if (high) premium = high.value.toString();
                    }
                    return {
                        maintenancePackageId: item.maintenancePackageId,
                        maintenancePackageName: item.maintenancePackageName,
                        maintenancePackageOptionName: item.maintenancePackageOptionName,
                        maintenancePackageOptionId: item.maintenancePackageOptionId,
                        discount,
                        premium,
                    }
                })
            })
        }
    }, [mpOptionsList, mpPricingLevels])

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
                index="maintenancePackageOptionId"
                rowData={RowData}
                actions={tableActions}
                isLoading={isLoading}
                smallHeaderFont
                hidePagination
                borderHeader
                compact
            />
            <EditPackagePricingLevelModal open={isOpen} prisingLevel={editElement} onClose={onClose}/>
        </div>
};

export default PricingLevelsByPackage;