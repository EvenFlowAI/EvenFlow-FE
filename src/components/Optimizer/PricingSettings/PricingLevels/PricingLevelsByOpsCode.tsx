import React, {useEffect, useState} from 'react';
import {PaperTitle} from "../UI";
import {Button, Divider} from "@material-ui/core";
import {SquarePaper} from "../../../UI/Paper";
import {TableRowDataType} from "../../../UI/types";
import {Table} from "../../../UI/Table";
import {makeStyles} from "@material-ui/core/styles";
import EditPricingLevel from "../../../Modals/EditPricingLevel/EditPricingLevel";
import {useModal, useSCs} from "../../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadAssignedServiceRequests} from "../../../../store/reducers/serviceRequests/actions";
import {RootState} from "../../../../store/rootReducer";
import {loadRequestsPricingLevels} from "../../../../store/reducers/pricingSettings/actions";
import {EDemandCategory} from "../../../../store/reducers/pricingSettings/types";

export type TPricingLevel = {
    id: number;
    serviceRequest: string;
    opsCode: string;
    discount: string | null;
    premium: string | null;
};

const RowData: TableRowDataType<TPricingLevel>[] = [
    {val: (el: TPricingLevel, index: number) => `${index + 1}`, header: "#"},
    {val: (el: TPricingLevel) => el.serviceRequest, header: "INDIVIDUAL SERVICE", width: '60%'},
    {val: (el: TPricingLevel) => el.opsCode, header: "OPS CODE"},
    {val: (el: TPricingLevel) => el.discount ? `${el.discount}%` : 'Default', header: "DISCOUNT"},
    {val: (el: TPricingLevel) => el.premium ? `${el.premium}%` : 'Default', header: "PREMIUM"},
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


const PricingLevelsByOpsCode = () => {
    const { assignedList } = useSelector((state: RootState) => state.serviceRequests);
    const { srPricingLevels, isLoading } = useSelector((state: RootState) => state.pricingSettings);
    const [editElement, setEditElement] = useState<TPricingLevel | null>(null);
    const [data, setData] = useState<TPricingLevel[]>([]);

    const {onOpen, onClose, isOpen} = useModal();
    const dispatch = useDispatch();
    const {selectedSC} = useSCs();
    const classes = useStyles();

    const onEditClick = async (el: TPricingLevel) => {
        await setEditElement(el);
        await onOpen();
    }

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id, true));
            dispatch(loadRequestsPricingLevels(selectedSC.id));
        }
    }, [selectedSC])

    useEffect(() => {
        if (assignedList && srPricingLevels) {
            setData(() => {
                return assignedList.map(item => {
                    const levelsItem = srPricingLevels.find(el => el.serviceRequestId === item.id);
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
                        serviceRequest: item.serviceRequest.description ?? item.serviceRequestOverride?.description,
                        opsCode: item.serviceRequest.code,
                        discount,
                        premium,
                    }
                })
            })
        }
    }, [assignedList, srPricingLevels])

    const tableActions = (el: TPricingLevel) => {
        return <Button
            className={classes.button}
            key={el.opsCode}
            variant="text"
            color="primary"
            onClick={() => onEditClick(el)}>
            Edit
        </Button>
    }

    return <SquarePaper variant="outlined">
        <PaperTitle>Pricing Levels By Ops Code</PaperTitle>
        <Divider />
        <div className={classes.tableWrapper}>
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
        </div>
        <EditPricingLevel open={isOpen} prisingLevel={editElement} onClose={onClose}/>
    </SquarePaper>
};

export default PricingLevelsByOpsCode;