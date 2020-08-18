import React from "react";
import {AvatarContainer, BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {MenuItem, Select} from "@material-ui/core";
import {States} from "../../../config/constants";


const ServiceCenterForm: React.FC = () => {
    return <form>
        <Select>
            {(Object.keys(States).map(state => <MenuItem key={state} value={state}>{state}</MenuItem>))}
        </Select>
    </form>;
};

export const CreateServiceCenter: React.FC<DialogProps> = props => {
    return <BaseModal {...props} onClose={props.onClose}>
        <DialogTitle onClose={props.onClose}>Add service center</DialogTitle>
        <DialogContent>
            <AvatarContainer />
            <ServiceCenterForm />
        </DialogContent>
    </BaseModal>;
}