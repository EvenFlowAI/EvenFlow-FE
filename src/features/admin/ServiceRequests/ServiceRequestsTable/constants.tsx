import {TableRowDataType} from "../../../../types/types";
import {IAssignedServiceRequest} from "../../../../store/reducers/serviceRequests/types";
import {ServiceRequestCellData} from "../../../../components/wrappers/ServiceRequestCellData/ServiceRequestCellData";
import React from "react";

export const RowData: TableRowDataType<IAssignedServiceRequest>[] = [
    {header: "Ops Code", val: el => el.serviceRequest.code, orderId: "code", width: 130,},
    {
        header: "Description",
        val: el => <ServiceRequestCellData
            data={el.serviceRequest.description}
            override={el.serviceRequestOverride?.description}
        />,
        orderId: "description",
    },
    {
        header: "Labor Hours",
        val: el => <ServiceRequestCellData
            data={el.serviceRequest.durationInHours.toFixed(1)}
            override={el.serviceRequestOverride?.durationInHours?.toFixed(1)}
        />,
        orderId: "duration",
        width: 95,
    },
    {
        header: "Labor Amount",
        val: el => <ServiceRequestCellData
            prefix="$"
            data={el.serviceRequest.warrantyInvoiceAmount.toFixed(2)}
            override={el.serviceRequestOverride?.warrantyInvoiceAmount?.toFixed(2)}
        />,
        orderId: "warrantyInvoiceAmount",
        width: 95,
    },
    {
        header: "Parts Amount",
        val: el => <ServiceRequestCellData
            prefix="$"
            data={el.serviceRequest.partsUnitCost?.toFixed(2)}
            override={el.serviceRequestOverride?.partsUnitCost?.toFixed(2)}
        />,
        orderId: "partsUnitCost",
        width: 95,
    },
    {
        header: "Total Amount",
        val: el => <ServiceRequestCellData
            prefix="$"
            data={el.serviceRequest.invoiceAmount.toFixed(2)}
            override={el.serviceRequestOverride?.invoiceAmount?.toFixed(2)}
        />,
        orderId: "invoiceAmount",
        width: 95,
    },
    {
        header: "Rollover Icon",
        val: el => '-',
        width: 95,
    }
]