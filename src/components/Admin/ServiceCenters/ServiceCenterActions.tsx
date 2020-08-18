import React from "react";
import {SquareIconButton} from "../../UI/Button";
import {Search} from "@material-ui/icons";
import {Button} from "@material-ui/core";
import {useCurrentUser, useModal} from "../../../utils/hooks";
import {CreateServiceCenter} from "../../Modals/CreateServiceCenter/CreateServiceCenter";

export const ServiceCenterActions = () => {
    const currentUser = useCurrentUser();
    const {isOpen, onClose, onOpen} = useModal();
    return currentUser?.isSuperUser
        ? <>
            <SquareIconButton variant="outlined">
                <Search/>
            </SquareIconButton>
            <Button variant="outlined">
                Filters
            </Button>
        </>
        : <>
            <Button
                color="primary"
                onClick={onOpen}
                variant="contained">
                Add service center
            </Button>
            <CreateServiceCenter open={isOpen} onClose={onClose} />
        </>;
}