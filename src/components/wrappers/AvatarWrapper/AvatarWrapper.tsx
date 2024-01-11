import React from "react";
import {AvatarUpload, TAvatarProps} from "../../formControls/AvatarUpload/AvatarUpload";
import {Container} from "@material-ui/core";
import {useStyles} from "./styles";

export const AvatarWrapper: React.FC<TAvatarProps> = (props) => {
    const classes = useStyles({maxWidth: 0});
    return <Container className={classes.avatarWrapper}>
        <AvatarUpload {...props} />
    </Container>
}