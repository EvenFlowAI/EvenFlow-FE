import React, {useEffect, useState} from 'react';
import {List, ListItem, ListItemSecondaryAction} from "@material-ui/core";
import clsx from "clsx";
import {NavLink, useHistory} from "react-router-dom";
import {LinkTypeWithSub} from "../../../../types/types";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {useStyles} from "./styles";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";

type TLinkProps = {
    link: LinkTypeWithSub;
    closeSidebar: () => void;
}

const Link: React.FC<TLinkProps> = ({link, closeSidebar}) => {
    const [isSubListOpen, setSubListOpen] = useState<boolean>(false);
    const currentUser = useCurrentUser();
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        const subLinksPathNames = link.subLinks?.map(el => el.to);
        const subLinkOpened = subLinksPathNames?.includes(history.location.pathname);
        if (subLinkOpened) setSubListOpen(true)
    }, [history, link])

    if (typeof link.roles === "boolean") {
        if (!link.roles) {
            return null;
        }
    } else {
        if (currentUser?.role && !link.roles.includes(currentUser.role)) {
            return null;
        }
    }

    const onClick = () => {
        setSubListOpen(prev => !prev);
        closeSidebar();
    }

    const onOpenSubList = () => {
        setSubListOpen(prev => !prev)
    }

    return link.subLinks?.length
        ? <List disablePadding className={classes.listWithSubs}>
            <ListItem
                disableGutters
                className={clsx(classes.listItem)}
                component={NavLink}
                to={link.to}
                onClick={onOpenSubList}
                exact={link.exact}
                key={link.to}>{link.name}</ListItem>
            <ListItemSecondaryAction
                onClick={onOpenSubList}
                className={classes.expandIcon}>
                {isSubListOpen ? <ExpandLess/> : <ExpandMore/>}
            </ListItemSecondaryAction>
            {isSubListOpen && link.subLinks.map(subLink => {
                if (typeof subLink.roles === "boolean") {
                    if (!subLink.roles) {
                        return null;
                    }
                } else {
                    if (currentUser?.role && !subLink.roles.includes(currentUser.role)) {
                        return null;
                    }
                }
                return <ListItem
                    disableGutters
                    className={clsx(classes.listItem, classes.subMenu)}
                    component={NavLink}
                    to={subLink.to}
                    exact={subLink.exact}
                    key={subLink.to}>{subLink.name}</ListItem>
            })}
        </List>
        : <ListItem
            disableGutters
            className={classes.listItem}
            component={NavLink}
            to={link.to}
            onClick={onClick}
            exact={link.exact}
            key={link.to}>{link.name}</ListItem>;
};

export default Link;