import React from 'react';
import {IEmployee} from "../../../../store/reducers/employees/types";
import {getInitials} from "../../../../utils/utils";
import {Avatar} from "@mui/material";
import {useStyles} from "./styles";

type TProps = {
    employee: IEmployee;
}

export const NameCell: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({employee}) => {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <Avatar src={employee.avatarPath}>{getInitials(employee.fullName)}</Avatar>
            <div className={classes.info}>
                <h4 className={classes.name}>{employee.fullName}</h4>
                <span className={classes.subtitle}>{
                    employee.employeeInfo
                        ? `Level ${employee.employeeInfo.skillLevel}`
                        : employee.role
                }</span>
            </div>
        </div>
    );
};