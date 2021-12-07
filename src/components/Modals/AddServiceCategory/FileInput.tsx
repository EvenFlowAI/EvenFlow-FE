import React, {ChangeEventHandler, createRef, Dispatch, SetStateAction} from 'react';
import {useException, useMessage} from "../../../utils/hooks";
import {makeStyles} from "@material-ui/core/styles";

interface IIconState {
    file: File | null;
    dataUrl?: string;
}

const allowedFileTypes = ['image/svg+xml', 'image/svg'];

type TFileInputProps = {
    setState: Dispatch<SetStateAction<IIconState>>
}

const useStyles = makeStyles(() => ({
    buttonWrapper: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'stretch',
    },
    uploadBtn: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        textTransform: 'none',
        color: 'white',
        backgroundColor: '#7898FF',
        padding: 10,
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
    },
    fileInput: {
        display: 'none'
    },
    fileLabel: {
        width: '100%'
    }
}))


const FileInput: React.FC<TFileInputProps> = ({ setState }) => {
    const ref = createRef<HTMLInputElement>();
    const showError = useException();
    const showMessage = useMessage();
    const classes = useStyles();

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (event.target.files) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                if (!allowedFileTypes.includes(file.type)) {
                    return showError('Please upload only SVG icon')
                }
                if (e.target?.result) {
                    setState(prev => ({...prev, dataUrl: e.target?.result
                            ? e.target.result as string : undefined
                    }));
                    showMessage('Icon is ready to Save!')
                }
            }
            setState(prev => ({...prev, file}));
            if (ref.current) {
                ref.current.files = null;
                ref.current.value = "";
            }
        }
    }
    return (
        <div className={classes.buttonWrapper}>
            <label htmlFor="fileInput" className={classes.fileLabel}>
                <div className={classes.uploadBtn}>
                    Upload Service Category Icon
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

export default FileInput;