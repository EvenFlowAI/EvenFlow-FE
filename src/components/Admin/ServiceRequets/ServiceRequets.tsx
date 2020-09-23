import React from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {Button} from "@material-ui/core";
import {SearchInput} from "../../UI/SearchInput";

export const ServiceRequests = () => {
    const actions = <div style={{display: "flex", alignItems: "center"}}>
        <SearchInput onSearch={() => {}} />
        <Button
            style={{marginLeft: 16}}
            color="primary"
            variant="contained">
            Add OPs Code
        </Button>
    </div>;

    return <>
        <TitleContainer title="Service Requests" pad actions={actions} />
        <p>Content</p>
    </>
}