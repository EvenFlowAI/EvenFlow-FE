import React from "react";
import {Link, LinkProps} from "@material-ui/core";
import {Link as BLink} from "react-router-dom";
import {TextField} from "../UI/TextField";

export const BackLink: React.FC<LinkProps & {to: string}> = props => {
    return <Link
        style={{fontWeight: "bold", textTransform: "uppercase"}}
        component={BLink}
        to={props.to}
    >{props.children}</Link>;
};

export type TPasswordProps = {
    password: string,
    password2: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}
export const PasswordForm: React.FC<TPasswordProps> = ({password, password2, onChange}) => {
    return (<form autoComplete="new-password" id="new-password-form">
        <TextField
            value={password}
            onChange={onChange}
            name="password"
            spacing="normal"
            id="password"
            type="password"
            autoComplete="new-password"
            label="New password"
            fullWidth
        />
        <TextField
            value={password2}
            onChange={onChange}
            name="password2"
            id="password2"
            type="password"
            autoComplete="new-password"
            label="Confirm new password"
            fullWidth
        />
    </form>)
}
