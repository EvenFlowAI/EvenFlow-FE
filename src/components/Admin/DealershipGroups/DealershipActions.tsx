import React from "react";
import {Button} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import {SquareIconButton} from "../../UI/Button";
import {CreateDealershipGroup} from "../../Modals/CreateDealershipGroup/CreateDealershipGroup";
import {useModal} from "../../../utils/hooks";


export const DealershipActions = () => {
    const {isOpen, onOpen, onClose} = useModal();
    return <>
        <SquareIconButton variant="outlined">
            <Search />
        </SquareIconButton>
        <Button
            variant="contained"
            onClick={onOpen}
            color="primary">
            Create new
        </Button>
        <CreateDealershipGroup open={isOpen} onClose={onClose} />
    </>;
}
