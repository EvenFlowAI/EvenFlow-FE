import React, {useEffect, useState} from 'react';
import {DemandTable, TableRow} from "../AppointmentAllocation/UI";
import {TableBody, TableHead, Switch, withStyles, TableCell as TC} from '@material-ui/core';

const TableCell = withStyles({
    root: {
        border: "none !important",
        padding: "12px 16px !important",
        // textAlign: "left",
    }
})(TC);

const HeaderTableCell = withStyles({
    root: {
        color: '#9FA2B4',
        textTransform: "none",
    }
})(TableCell)

const EligibleSegmentTable = withStyles({
    root: {
        "& .MuiTableCell-root": {
            textTransform: "none",
        }
    }
})(DemandTable)

enum ECustomerSegmentMobileService {
    New, Lost, Existing, HighValue, MediumValue, LowValue, EndOfWarranty, PostWarranty
}

type TSegmentType = {
    type: ECustomerSegmentMobileService,
    name: string,
    enabled: boolean,
    order: number,
}

const data = [
    {
        type: ECustomerSegmentMobileService.New,
        name: 'New Customer',
        enabled: false,
        order: 0,
    },
    {
        type: ECustomerSegmentMobileService.Lost,
        name: 'Lost Customer',
        enabled: true,
        order: 1,
    },
    {
        type: ECustomerSegmentMobileService.Existing,
        name: 'Existing',
        enabled: true,
        order: 2,
    },
    {
        type: ECustomerSegmentMobileService.HighValue,
        name: 'High Value',
        enabled: true,
        order: 3,
    },
    {
        type: ECustomerSegmentMobileService.MediumValue,
        name: 'Medium Value',
        enabled: true,
        order: 4,
    },
    {
        type: ECustomerSegmentMobileService.LowValue,
        name: 'Low Value',
        enabled: true,
        order: 5,
    },
    {
        type: ECustomerSegmentMobileService.EndOfWarranty,
        name: 'End Of Warranty',
        enabled: true,
        order: 6,
    },
    {
        type: ECustomerSegmentMobileService.LowValue,
        name: 'Post Warranty',
        enabled: true,
        order: 7,
    }
]

const EligibleCustomerSegment = () => {
    const [segmentsData, setSegmentsData] = useState<TSegmentType[]>([]);

    useEffect(() => {
        // todo request to get data for mobile service
        setSegmentsData(data.sort((a, b) => a.order - b.order))
    }, [data])

    const onChange = (type: ECustomerSegmentMobileService) => (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setSegmentsData(prev => {
            const itemToUpdate = prev.find(item => item.type === type);
            if (itemToUpdate) {
                const updated = {...itemToUpdate, enabled: checked}
                const filtered = prev.filter(item => item.type !== type);
                return [...filtered, updated].sort((a, b) => a.order - b.order)
            }
            return prev
        })
    }

    return (
        <EligibleSegmentTable>
            <TableHead>
                <TableRow>
                    <HeaderTableCell align="left">
                        Customer (Segment)
                    </HeaderTableCell>
                    <HeaderTableCell>
                        OFF/ON
                    </HeaderTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {segmentsData.map(item => {
                    return <TableRow key={item.name}>
                        <TableCell key={item.type + "name"} align="left">
                            {item.name}
                        </TableCell>
                        <TableCell key={item.type + "switch"}>
                            <Switch onChange={onChange(item.type)} checked={item.enabled} color="primary"/>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </EligibleSegmentTable>
    );
};

export default EligibleCustomerSegment;