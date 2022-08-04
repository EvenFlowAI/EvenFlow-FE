import React, {useState} from 'react';
import {ListItem, List, lighten, ListItemSecondaryAction} from "@material-ui/core";
import clsx from "clsx";
import {NavLink} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {LinkTypeWithSub} from "../../types/types";
import {useCurrentUser} from "../../utils/hooks";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    listItem: {
        color: "#FFFFFF",
        textTransform: "uppercase",
        fontSize: 14,
        padding: "16px 0",
        lineHeight: "17px",
        fontWeight: "bold",
        transition: theme.transitions.create(['color']),
        "&.active": {
            color: "#7898FF"
        },
        "&:hover": {
            color: lighten("#7898FF", .5)
        }
    },
    subMenu: {
        color: "#929292",
        padding: "10px 0 10px 15px",
        textTransform: "none"
    },
    expandIcon: {
        top: 28,
        right: -30,
        cursor: "pointer",
    },
    listWithSubs: {
        transition: theme.transitions.create(['color']),
        "&.active": {
            color: "#7898FF"
        },
        "&:hover": {
            color: lighten("#7898FF", .5)
        }
    }
}))

type TLinkProps = {
    link: LinkTypeWithSub;
    closeSidebar: () => void;
}

const Link: React.FC<TLinkProps> = ({link, closeSidebar}) => {
    const [isSubListOpen, setSubListOpen] = useState<boolean>(false);
    const currentUser = useCurrentUser();
    const classes = useStyles();

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
                className={classes.listItem}
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