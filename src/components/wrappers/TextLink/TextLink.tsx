import React from 'react';
import {Link} from "react-router-dom";

export const TextLink: React.FC<React.PropsWithChildren<React.PropsWithChildren<{to: string}>>> = ({children, to}) => {
    return <Link
        style={{fontWeight: "bold", color: "inherit"}}
        to={to}>
        {children}
    </Link>
};