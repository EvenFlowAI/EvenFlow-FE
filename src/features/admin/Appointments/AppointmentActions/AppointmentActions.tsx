import React from 'react';
import {Button, Box} from "@mui/material";
import {TView} from "../types";
import {NavLink} from "react-router-dom";
import {encodeSCID} from "../../../../utils/utils";
import {useStyles} from "./styles";
import {SearchDebounced} from "../../../../components/formControls/SearchDebounced/SearchDebounced";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {Routes} from "../../../../routes/constants";
import {TCallback} from "../../../../types/types";
import {ReactComponent as Arrow} from "../../../../assets/img/dropdown-alternate-down.svg";

type TProps = {
    searchTerm: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: TCallback;
    onFilterOpen: TCallback;
    selectedView: TView;
    handleChangeView: (type: TView) => () => void;
    onColumnsOpen: TCallback;
    isFiltersOpen: boolean;
}

export const AppointmentActions: React.FC<TProps> = ({
                                                         handleChangeView,
                                                         selectedView,
                                                         searchTerm,
                                                         handleSearchChange,
                                                         onSearch,
                                                         onFilterOpen,
                                                         onColumnsOpen,
                                                         isFiltersOpen,
                                                     }) => {
    const { classes  } = useStyles();
    const {selectedSC} = useSCs();
    const encoded = encodeSCID(selectedSC?.id ?? 0);
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
            onClick={onColumnsOpen}
            style={{ marginLeft: 20 }}
            variant="outlined"
            color="primary">
            Select Columns
        </Button>
        <Button
                onClick={onFilterOpen}
                style={{ marginLeft: 20 }}
                variant="outlined"
                endIcon={<Arrow style={{transform: isFiltersOpen ? 'rotate(180deg)' : 'none'}}/>}
                disabled={selectedView === "calendar"}
                color="primary">
                Filters
            </Button>
        </Box>
};