import React, {ChangeEventHandler, createRef, useState} from "react";
import {Avatar} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
    root: (size: number) => ({
        width: size,
        height: size,
        cursor: "pointer",
        backgroundColor: "#919191",
        transition: theme.transitions.create(["opacity", "box-shadow"]),
        opacity: .9,
        "&:hover": {
            boxShadow: theme.shadows[5],
            opacity: 1
        }
    }),
    sign: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#FFFFFF",
        border: "1px solid #FFFFFF",
        borderRadius: "50%",
        width: 32,
        height: 32,
        lineHeight: "32px",
        textAlign: "center"
    },
    input: {
        display: "none"
    }
}));

interface IAvatarState {
    file: File | null;
    dataUrl?: string;
}

export type TAvatarProps = {
    dataUrl?: string;
    onChange?: (file: File) => void;
    size?: number;
}

export const AvatarUpload: React.FC<TAvatarProps> = (props) => {
    const [state, setState] = useState<IAvatarState>({file: null, dataUrl: props.dataUrl || undefined});
    const classes = useStyles(props.size || 74);

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
            type="file"
            id="avatarInput"
            className={classes.input}
            ref={ref} />
    </label>;
}