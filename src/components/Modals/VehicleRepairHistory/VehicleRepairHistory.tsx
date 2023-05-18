import React from 'react';
import {
    IRepairHistory,
    IRepairOrder,
} from "../../../store/reducers/enhancedCustomerSearch/types";

const mockRepairData: IRepairOrder[] = [
    {
        date: "2023-05-20T00:00:00Z",
        number: '23',
        advisor: '34457678 Luis Garcia',
        mileage: 113000,
        status: 'started',
        comments: ['Comment  Comment Comment CommentComment CommentCommentCommentCommentComment   Comment Comment Comment',
            'Comment1, Comment1 Comment1 Comment1 Comment1 Comment1 Comment1 Comment1 Comment1 '],
        technicianLaborTime: 4,
        repairOrderPrice: {total: 120, tax: 12},
        warrantyPrice: {total: 120, tax: 12},
        customerPayPrice: {total: 120, tax: 12},
        miscPrice: {total: 120, tax: 12},
        services: [
            {
                number: '55656',
                title: 'Service Title',
                description:'Very Long Service Description',
                complaint:'Very Long Complaint About The Car',
                correction: 'Very Short Correction',
                cause: 'Very Long Text Very Long Text Very Long Text Very Long Text Very Long Text',
            }
        ],
        parts: [
            {
                number: '55656',
                description:'Very Long Part Description',
                quantity: 1,
                price: 120
            }
        ]
    }
]

const mockData: IRepairHistory = {
    customerId: 1,
    cellPhone: '0633055234',
    homePhone: '34696048516',
    firstName: 'Alisa',
    lastName: "Rodionovich",
    vehicleId: 23,
    make: 'Ford',
    model: 'Focus',
    vin: '567tytytyty6688',
    year: 2004,
    repairOrders: mockRepairData,
}

const VehicleRepairHistory = () => {
    return (
        <div>

        </div>
    );
};

export default VehicleRepairHistory;