import React, {useState} from 'react';
import {PaperTitle} from "../UI";
import {Button, Divider} from "@material-ui/core";
import {SquarePaper} from "../../../UI/Paper";
import {TableRowDataType} from "../../../UI/types";
import {Table} from "../../../UI/Table";
import {makeStyles} from "@material-ui/core/styles";
import EditPricingLevel from "../../../Modals/EditPricingLevel/EditPricingLevel";
import {useModal} from "../../../../utils/hooks";

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
    {val: (el: TPricingLevel) => Number.isNaN(Number(el.discount)) ? 'Default' : `${el.discount}%`, header: "DISCOUNT"},
    {val: (el: TPricingLevel) => Number.isNaN(Number(el.premium)) ? 'Default' : `${el.premium}%`, header: "PREMIUM"},
];

const mockData: TPricingLevel[] = [
    {   id: 1,
        serviceRequest: 'Request 1',
        opsCode: 'DFFHJ567',
        discount: '56',
        premium: 'Default',
    },
    {   id: 2,
        serviceRequest: 'Request 1',
        opsCode: 'DFFHJ567',
        discount: '56',
        premium: 'Default',
    },
]

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
    const [editElement, setEditElement] = useState<TPricingLevel | null>(null);
    const [data, setData] = useState<TPricingLevel[]>(mockData);
    const {onOpen, onClose, isOpen} = useModal();
    const classes = useStyles();

    const onEditClick = async (el: TPricingLevel) => {
        await setEditElement(el);
        await onOpen();
    }

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