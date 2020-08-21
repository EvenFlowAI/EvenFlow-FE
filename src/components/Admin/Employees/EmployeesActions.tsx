import React from "react";
import {Button} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import {SquareIconButton} from "../../UI/Button";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import {CreateEmployee} from "../../Modals/CreateEmployee";


export const EmployeesActions = () => {
    const currentUser = useCurrentUser();
    const {isOpen, onClose, onOpen} = useModal();

    return <>
        <SquareIconButton variant="outlined">
            <Search />
        </SquareIconButton>
        <Button variant="outlined">
            Filters
        </Button>
        {currentUser && !currentUser.isSuperUser ? <>
            <Button
                onClick={onOpen}
                variant="contained"
                color="primary">
                New Employee
            </Button>
            <CreateEmployee open={isOpen} onClose={onClose} />
        </> : null}
    </>;
}
