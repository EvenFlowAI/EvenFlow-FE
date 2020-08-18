import React from "react";
import {AvatarContainer, BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {States} from "../../../config/constants";
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "../../UI/TextField";


const states = Object.keys(States)
const ServiceCenterForm: React.FC = () => {
    return <form>
        <Autocomplete
            options={states}
            renderInput={params => <div ref={params.InputProps.ref}><TextField {...params.inputProps} label="Test"/></div>}
        />
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