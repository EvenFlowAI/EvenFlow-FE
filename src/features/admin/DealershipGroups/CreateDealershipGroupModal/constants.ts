import {KeyPair} from "./types";
import {IContactPersonForm, IDealershipForm} from "../../../../store/reducers/dealershipGroups/types";
import {ValidationKeyPairs} from "../../../../types/types";

export const elementsGroup1: KeyPair<IDealershipForm>[] = [
    {name: "name", label: "Dealership group name"},
    {name: "phoneNumber", label: "Phone"},
];

export const elementsGroup2: KeyPair<IContactPersonForm>[] = [
    {name: "firstName", label: "Contact person first name"},
    {name: "lastName", label: "Contact person last name"},
    {name: "phoneNumber", label: "Contact person phone"},
    {name: "email", label: "Contact person email"}
];

export const requiredFields: ValidationKeyPairs<IDealershipForm & IContactPersonForm>[] = [
    {
        field: "firstName",
        message: "Contact Person First Name is required"
    },
    {
        field: "lastName",
        message: "Contact Person Last Name is required"
    },
    {
        field: "phoneNumber",
        message: "Phone is required"
    },
    {
        field: "email",
        message: "Contact Person Email is required"
    },
    {
        field: "name",
        message: "Dealership Name is required"
    },
];

export const initialStateDealershipState: IDealershipForm = {
    name: "", phoneNumber: "",
};

export const initialCPState: IContactPersonForm = {
    phoneNumber: "", firstName: "", lastName: "", email: ""
}