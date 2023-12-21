import React from 'react';
import {Button, Box} from "@material-ui/core";
import {TView} from "../types";
import {Routes} from "../../../../config/routes";
import {NavLink} from "react-router-dom";
import {encodeSCID} from "../../../../utils/utils";
import {useStyles} from "./styles";
import {SearchDebounced} from "../../../../components/FormControls/SearchDebounced/SearchDebounced";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

type TProps = {
    searchTerm: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    onFilterOpen: () => void;
    selectedView: TView;
    handleChangeView: (type: TView) => () => void;
}

export const AppointmentActions: React.FC<TProps> = ({handleChangeView, selectedView, searchTerm, handleSearchChange, onSearch, onFilterOpen}) => {
    const classes = useStyles();
    const {selectedSC} = useSCs();
    const encoded = encodeSCID(selectedSC?.id??0);
    const url = Routes.EndUser.Welcome + "/" + encoded + "?frame=1";

    return <Box>
            <NavLink to={url} className={classes.linkBtn} target="_blank">Book Appointment</NavLink>
            {selectedView === 'list' && <SearchDebounced
                onSearch={onSearch}
                onChange={handleSearchChange}
                value={searchTerm}
                placeholder="Search customer..."/>
            }
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