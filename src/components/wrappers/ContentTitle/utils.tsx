import React from "react";
import {Link} from "react-router-dom";
import {TTitle} from "../../../types/types";

export const collectParents = (title: TTitle): JSX.Element => {
    const link = <Link to={title.to}>{title.title}</Link>;
    if (title.parent) {
        return <>{collectParents(title.parent)} / {link}</>;
    }
    return link;
}