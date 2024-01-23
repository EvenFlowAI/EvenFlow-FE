import React from 'react';
import {ICustomerForTable, ICustomerWithPhones} from "../../../../../store/reducers/enhancedCustomerSearch/types";
import {CustomerInput} from "../../../../../components/formControls/CustomerInput/CustomerInput";

type TCustomerInputFieldProps = {
    editingElement: ICustomerWithPhones|null;
    isEdit: boolean;
    fieldName: keyof ICustomerForTable;
    customer: ICustomerWithPhones;
    onFieldChange: (fieldName: keyof ICustomerForTable) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomerInputField: React.FC<React.PropsWithChildren<React.PropsWithChildren<TCustomerInputFieldProps>>> = ({
                                                                    editingElement,
                                                                    isEdit,
                                                                    onFieldChange,
                                                                    fieldName,
                                                                    customer
                                                                }) => {
    return isEdit && editingElement?.vehicleId === customer.vehicleId && editingElement?.customerId === customer.customerId
        ? <CustomerInput
            value={editingElement[fieldName] ?? ""}
            onChange={onFieldChange(fieldName)}/>
        : <React.Fragment>{customer[fieldName] ?? ""}</React.Fragment>;
};