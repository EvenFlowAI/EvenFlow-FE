import React from "react";
import {TBayForm} from "../types";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";

type TProps = {
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    form: TBayForm,
    onCheck: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const CreateBayForm: React.FC<TProps> = props => {
    return <div>
        <TextField
            label="Name"
            id="name"
            name="name"
            value={props.form.name}
            onChange={props.onChange}
            fullWidth
        />
        <FormGroup>
            <FormControlLabel
                label="Alignment Equipment"
                control={
                    <Checkbox
                        checked={props.form.alignmentEquipment}
                        onChange={props.onCheck}
                        name="alignmentEquipment"
                        color="primary"
                    />
                }
                labelPlacement="end"
            />
            <FormControlLabel
                label="Carrying Capacity"
                control={
                    <Checkbox
                        checked={props.form.carryingCapacity}
                        onChange={props.onCheck}
                        name="carryingCapacity"
                        color="primary"
                    />
                }
                labelPlacement="end"
            />
            <FormControlLabel
                label="Only Quick Service"
                control={
                    <Checkbox
                        checked={props.form.onlyQuickService}
                        onChange={props.onCheck}
                        name="onlyQuickService"
                        color="primary"
                    />
                }
                labelPlacement="end"
            />
        </FormGroup>
    </div>
}