import React from "react";
import {Button} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import {SquareIconButton} from "../../UI/Button";
import {useCurrentUser} from "../../../utils/hooks";


export const EmployeesActions = () => {
    const currentUser = useCurrentUser();
    return <>
        <SquareIconButton variant="outlined">
            <Search />
        </SquareIconButton>
        <Button variant="outlined">
            Filters
        </Button>
        {currentUser && !currentUser.isSuperUser ? <Button variant="contained" color="primary">
            New Employee
        </Button> : null}
    </>;
}
