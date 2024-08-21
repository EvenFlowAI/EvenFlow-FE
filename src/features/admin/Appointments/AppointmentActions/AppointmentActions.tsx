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
import {ReactComponent as ArrowDisabled} from "../../../../assets/img/dropdown-alternate-down_grey.svg";
import ChangeViewButtons from "./ChangeViewButtons/ChangeViewButtons";

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
        <NavLink to={url} className={classes.linkBtn} target="_blank" style={{height: 40}}>Book Appointment</NavLink>
        {selectedView === 'list' && <SearchDebounced
            onSearch={onSearch}
            onChange={handleSearchChange}
            style={{height: 40}}
            value={searchTerm}
            placeholder="Search customer..."/>
        }
        <Button
            onClick={onColumnsOpen}
            style={{ marginLeft: 20, height: 40 }}
            variant="outlined"
            color="primary">
            Select Columns
        </Button>

        {process.env.REACT_APP_ENV === 'production' ? null : <ChangeViewButtons handleChangeView={handleChangeView} selectedView={selectedView}/>}

        <Button
                onClick={onFilterOpen}
                style={{ marginLeft: 20, height: 40 }}
                variant="outlined"
                endIcon={selectedView === 'list'
                    ? <Arrow style={{transform: isFiltersOpen ? 'rotate(180deg) translate(0px, 3px)' : 'none'}}/> :
                    <ArrowDisabled/>}
                disabled={selectedView === "calendar"}
                color="primary">
                Filters
            </Button>
        </Box>
};