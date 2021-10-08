import React from 'react';
import {Checkbox as MuiCheckbox, CheckboxProps} from "@material-ui/core";
import {CheckBoxOutlined} from "@material-ui/icons";

const Checkbox: React.FC<CheckboxProps> = (props) => {
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