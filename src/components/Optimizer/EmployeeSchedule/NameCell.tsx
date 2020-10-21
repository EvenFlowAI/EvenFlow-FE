import React from 'react';
import {IEmployee} from "../../../store/reducers/employees/types";
import {getInitials} from "../../../utils/utils";
import {Avatar} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles({
    wrapper: {
        display: "flex",
        flexFlow: "row no-wrap",
        alignItems: "center"
    },
    info: {
        flexGrow: 1,
        paddingLeft: 26
    },
    name: {
        fontSize: 15,
        lineHeight: "20px",
        fontWeight: "normal",
        margin: 0
    },
    subtitle: {
        fontSize: 11,
        color: "#9FA2B4"
    }
});

type TProps = {
    employee: IEmployee;
}

export const NameCell: React.FC<TProps> = ({employee}) => {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <Avatar>{employee.avatarPath || getInitials(employee.fullName)}</Avatar>
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