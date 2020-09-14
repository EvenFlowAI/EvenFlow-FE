import React from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {Button} from "@material-ui/core";
import {OPsCodesListDialog} from "../../Modals/OPsCodesListDialog/OPsCodesListDialog";
import {useModal} from "../../../utils/hooks";

export const OPsCodesPage = () => {
    const {isOpen, onOpen, onClose} = useModal();

    return <>
        <TitleContainer
            title="Service Requests"
            pad
            parent={optimizerRoot}
            actions={
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onOpen}
                >
                    Add Ops Code
                </Button>
            }
        />
        <OPsCodesListDialog open={isOpen} onClose={onClose} />
    </>;
}