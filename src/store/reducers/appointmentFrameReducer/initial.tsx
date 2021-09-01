import {EServiceCategoryPage, IServiceCategory} from "../../../api/types";
import {ReactComponent as MoreIcon} from "../../../assets/img/tell-more.svg";
import React from "react";

export const tellMoreCard: IServiceCategory = {
    id: -2,
    name: "Tell us more",
    loadedIcon: <MoreIcon />,
    page: EServiceCategoryPage.Page1,
    serviceRequests: []
};