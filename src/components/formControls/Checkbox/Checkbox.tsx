import React from 'react';
import {Checkbox as MuiCheckbox, CheckboxProps} from "@mui/material";
import {CheckBoxOutlineBlank} from "@mui/icons-material";

const Checkbox: React.FC<React.PropsWithChildren<React.PropsWithChildren<CheckboxProps>>> = (props) => {
    return (
        <div>
            <MuiCheckbox
            icon={<CheckBoxOutlineBlank/>}
            {...props}
            />
        </div>
    );
};

export default Checkbox;