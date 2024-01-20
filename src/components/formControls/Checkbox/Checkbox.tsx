import React from 'react';
import {Checkbox as MuiCheckbox, CheckboxProps} from "@mui/material";
import {CheckBoxOutlined} from "@mui/icons-material";

const Checkbox: React.FC<React.PropsWithChildren<CheckboxProps>> = (props) => {
    return (
        <div>
            <MuiCheckbox
            icon={<CheckBoxOutlined/>}
            {...props}
            />
        </div>
    );
};

export default Checkbox;