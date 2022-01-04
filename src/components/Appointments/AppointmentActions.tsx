import React from 'react';
import {Button, Box, ButtonGroup} from "@material-ui/core";
import {useModal} from "../../utils/hooks";
import {AppointmentDialog} from "./AppointmentDialog";
import {SearchInput} from "../UI/SearchInput";
import {TView} from "./Appointments";

type TProps = {
    onAction?: () => void;
    searchTerm: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    onFilterOpen: () => void;
    selectedView: TView;
    handleChangeView: (type: TView) => () => void;
}

type TButton = { label: string, type: TView };
const views: TButton[] = [
    {type: "calendar", label: "Calendar View"},
    {type: "list", label: "List View"}
];

export const AppointmentActions: React.FC<TProps> = ({handleChangeView, selectedView, onAction, searchTerm, handleSearchChange, onSearch, onFilterOpen}) => {
    const {isOpen, onOpen, onClose} = useModal();

    return <>
        <Box>
            {selectedView === 'list' && <SearchInput onSearch={onSearch} onChange={handleSearchChange} value={searchTerm} />}
            <ButtonGroup color="primary" style={{ marginLeft: 20 }}>
                {views.map(view =>
                    <Button
                        key={view.type}
                        onClick={handleChangeView(view.type)}
                        variant={view.type === selectedView ? "contained" : "outlined"}>
                        {view.label}
                    </Button>
                )}
            </ButtonGroup>
            <Button
                onClick={onFilterOpen}
                style={{ marginLeft: 20 }}
                variant="outlined"
                disabled={selectedView === "calendar"}
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