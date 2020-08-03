import React from "react";
import {Button} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import {SquareIconButton} from "../../UI/Button";


export const DealershipActions = () => {
    return <>
        <SquareIconButton variant="outlined">
            <Search />
        </SquareIconButton>
        <Button variant="contained" color="primary">
            Create new
        </Button>
    </>;
}
