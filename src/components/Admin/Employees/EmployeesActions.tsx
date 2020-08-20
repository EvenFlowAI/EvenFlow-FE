import React from "react";
import {Button} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import {SquareIconButton} from "../../UI/Button";


export const EmployeesActions = () => {
    return <>
        <SquareIconButton variant="outlined">
            <Search />
        </SquareIconButton>
        <Button variant="outlined">
            Filters
        </Button>
        <Button variant="contained" color="primary" >
            New
        </Button>
    </>;
}
