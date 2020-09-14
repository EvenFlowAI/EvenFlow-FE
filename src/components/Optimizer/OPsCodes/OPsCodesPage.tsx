import React from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {Button} from "@material-ui/core";

export const OPsCodesPage = () => {
    return <>
        <TitleContainer
            title="Service Requests"
            pad
            parent={optimizerRoot}
            actions={
                <Button
                    color="primary"
                    variant="contained"
                >
                    Add Ops Code
                </Button>
            }
        />

    </>;
}