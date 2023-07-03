import React from 'react';
import {Button, Box, ButtonGroup} from "@material-ui/core";
import {SearchInput} from "../../UI/SearchInput";
import {TView} from "../Appointments";

type TProps = {
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

export const AppointmentActions: React.FC<TProps> = ({handleChangeView, selectedView, searchTerm, handleSearchChange, onSearch, onFilterOpen}) => {
    return <Box>
            {selectedView === 'list' && <SearchInput onSearch={onSearch} onChange={handleSearchChange} value={searchTerm} placeholder="Search customer..."/>}
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
        </Box>
};