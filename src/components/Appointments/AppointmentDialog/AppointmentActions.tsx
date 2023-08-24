import React from 'react';
import {Button, Box, ButtonGroup} from "@material-ui/core";
import {SearchInput} from "../../UI/SearchInput";
import {TView} from "../Appointments";
import {Routes} from "../../../config/routes";
import {NavLink} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {encodeSCID} from "../../../utils/utils";
import {useSCs} from "../../../utils/hooks";

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

const useStyles = makeStyles({
    linkBtn: {
        fontSize: 14,
        fontWeight: 700,
        color: "#7898FF",
        textTransform: 'uppercase',
        textDecoration: 'none',
        marginRight: 20
    }
})

export const AppointmentActions: React.FC<TProps> = ({handleChangeView, selectedView, searchTerm, handleSearchChange, onSearch, onFilterOpen}) => {
    const classes = useStyles();
    const {selectedSC} = useSCs();
    const encoded = encodeSCID(selectedSC?.id??0);
    const url = Routes.EndUser.Welcome + "/" + encoded + "?frame=1";

    return <Box>
            <NavLink to={url} className={classes.linkBtn} target="_blank">Book Appointment</NavLink>
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