import React, {ChangeEventHandler, createRef, useState} from "react";
import {Avatar} from "@material-ui/core";
import {useStyles} from "./styles";
import {IAvatarState} from "./types";

export type TAvatarProps = {
    dataUrl?: string;
    onChange?: (file: File) => void;
    size?: number;
    disabled?: boolean;
}

export const AvatarUpload: React.FC<TAvatarProps> = (props) => {
    const [state, setState] = useState<IAvatarState>({file: null, dataUrl: props.dataUrl || undefined});
    const classes = useStyles({size: props.size || 74, disabled: props.disabled});

    const ref = createRef<HTMLInputElement>();

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.target.files) {
             const file = event.target.files[0];
             const reader = new FileReader();
             reader.readAsDataURL(file);
             reader.onload = e => {
                 if (e.target) {
                     setState({...state, dataUrl: e.target.result
                             ? e.target.result as string : undefined
                     });
                 }
             }
             setState({...state, file});
             if (ref.current) {
                 ref.current.files = null;
                 ref.current.value = "";
             }
             if (props.onChange) {
                 props.onChange(file);
             }
        }

    }

    return <label htmlFor="avatarInput">
        <Avatar
            src={state.dataUrl}
            className={classes.root}>
            <span className={classes.sign}>+</span>
        </Avatar>
        <input
            onChange={handleChange}
            disabled={props.disabled}
            type="file"
            id="avatarInput"
            className={classes.input}
            ref={ref} />
    </label>;
}