import React from 'react';
import {Button, Box} from "@material-ui/core";
import {useModal} from "../../utils/hooks";
import {AppointmentDialog} from "./AppointmentDialog";
import {SearchInput} from "../UI/SearchInput";

type TProps = {
    onAction?: () => void;
    searchTerm: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    onFilterOpen: () => void;
}
export const AppointmentActions: React.FC<TProps> = ({onAction, searchTerm, handleSearchChange, onSearch, onFilterOpen}) => {
    const {isOpen, onOpen, onClose} = useModal();

    return <>
        <Box>
        <SearchInput onSearch={onSearch} onChange={handleSearchChange} value={searchTerm} />
            <Button
                onClick={onFilterOpen}
                style={{ marginLeft: 20 }}
                variant="outlined"
                color="primary">
               Filters
            </Button>
        <Button
            onClick={onOpen}
            style={{ marginLeft: 20 }}
            variant="contained"
            color="primary">
            New Appointment
        </Button>
        </Box>
        <AppointmentDialog onAction={onAction} open={isOpen} onClose={onClose} />
    </>
};