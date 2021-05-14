import React from 'react';
import {Link} from "react-router-dom";

export const TextLink: React.FC<{to: string}> = ({children, to}) => {
    return <Link
        style={{fontWeight: "bold", color: "inherit"}}
        to={to}>
        {children}
    </Link>
};