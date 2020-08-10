import React from "react";
import {SquareIconButton} from "../../UI/Button";
import {Search} from "@material-ui/icons";
import {Button} from "@material-ui/core";

export const ServiceCenterActions = () => {
    return <>
        <SquareIconButton variant="outlined">
            <Search />
        </SquareIconButton>
        <Button variant="outlined">
            Filters
        </Button>
    </>;
}