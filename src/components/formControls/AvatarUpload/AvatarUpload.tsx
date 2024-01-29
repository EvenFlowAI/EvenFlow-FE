import React, {ChangeEventHandler, createRef, useState} from "react";
import {StyledAvatar, useStyles} from "./styles";
import {IAvatarState} from "./types";

export type TAvatarProps = {
    dataUrl?: string;
    onChange?: (file: File) => void;
    size?: number;
    disabled?: boolean;
}

export const AvatarUpload: React.FC<React.PropsWithChildren<React.PropsWithChildren<TAvatarProps>>> = (props) => {
    const [state, setState] = useState<IAvatarState>({file: null, dataUrl: props.dataUrl || undefined});
    const classes = useStyles();

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
        <StyledAvatar
            size={props.size || 74}
            disabled={props.disabled}
            src={state.dataUrl}>
            <span className={classes.sign}>+</span>
        </StyledAvatar>
        <input
            onChange={handleChange}
            disabled={props.disabled}
            type="file"
            id="avatarInput"
            className={classes.input}
            ref={ref} />
    </label>;
}