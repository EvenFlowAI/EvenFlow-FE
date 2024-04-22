import React from "react";
import {ICustomerWithPhones} from "../../../../../store/reducers/enhancedCustomerSearch/types";
import {IAddressData} from "../../../../../api/types";
import {CustomerInput} from "../../../../../components/formControls/CustomerInput/CustomerInput";

type TAddressInputFieldProps = {
    editingElement: ICustomerWithPhones|null;
    isEdit: boolean;
    fieldName: keyof IAddressData;
    customer: ICustomerWithPhones;
    onFieldChange: (fieldName: keyof IAddressData) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
}

export const AddressInputField:React.FC<React.PropsWithChildren<React.PropsWithChildren<TAddressInputFieldProps>>> = ({
                                                                        editingElement,
                                                                        isEdit,
                                                                        onFieldChange,
                                                                        fieldName,
                                                                        customer,
                                                                        error
                                                                    }) => {
    return isEdit && editingElement?.vehicleId === customer.vehicleId && editingElement?.customerId === customer.customerId
        ? <CustomerInput
            value={editingElement.address ? editingElement.address[fieldName] ?? "" : ""}
            error={error}
            onChange={onFieldChange(fieldName)}/>
        : <React.Fragment>{customer.address ? customer.address[fieldName] ?? "" : ""}</React.Fragment>;
};