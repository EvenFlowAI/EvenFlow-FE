import React, {ChangeEventHandler, createRef, Dispatch, SetStateAction, useCallback} from 'react';
import {useException, useMessage} from "../../../utils/hooks";
import {useStyles} from "./styles";
import {IIconState} from "../types";

const allowedFileTypes = ['image/svg+xml', 'image/svg', 'image/png', 'image/jpeg', 'image/jpg'];

type TFileInputProps = {
    setState: Dispatch<SetStateAction<IIconState>>,
    label: string;
}

export const FileInput: React.FC<TFileInputProps> = ({ setState, label }) => {
    const ref = createRef<HTMLInputElement>();
    const showError = useException();
    const showMessage = useMessage();
    const classes = useStyles();

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        if (event.target.files) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                if (!allowedFileTypes.includes(file.type)) {
                    return showError('Please upload only SVG/PNG/JPEG/JPG icon')
                }
                if (e.target?.result) {
                    setState(prev => ({...prev, dataUrl: e.target?.result
                            ? e.target.result as string : undefined
                    }));
                    showMessage('Icon is ready to save')
                }
            }
            setState(prev => ({...prev, file}));
            if (ref.current) {
                ref.current.files = null;
                ref.current.value = "";
            }
        }
    }, [ref])

    return (
        <div className={classes.buttonWrapper}>
            <label htmlFor="fileInput" className={classes.fileLabel}>
                <div className={classes.uploadBtn}>
                    {label}
                </div>
                <input
                    onChange={handleFileChange}
                    className={classes.fileInput}
                    type="file"
                    id="fileInput"
                    ref={ref} />
            </label>
        </div>
    );
};