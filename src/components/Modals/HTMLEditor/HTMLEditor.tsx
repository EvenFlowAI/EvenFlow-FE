import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {Editor} from "react-draft-wysiwyg";
import {convertToRaw, EditorState} from "draft-js";
import {convertToHTML, convertFromHTML} from "draft-convert";
import {Button} from "@material-ui/core";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {LoadingButton} from "../../UI/Button";
import {makeStyles} from "@material-ui/core/styles";
import classnames from 'classnames';
import {useException} from "../../../utils/hooks";

type THTMLEditor = DialogProps & {
    onSave: (value: string) => void;
    isLoading?: boolean;
    payload?: string;
}

const useStyles = makeStyles(({
    editor: {
        border: '1px solid #F1F1F1',
    }
}))

const HtmlEditor: React.FC<THTMLEditor> = ({open, onClose, title, onSave, isLoading, payload}) => {
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty())
    const showError = useException();
    const styles = useStyles();

    useEffect(() => {
        if (open) {
            if (payload) {
                setEditorState(EditorState.createWithContent(convertFromHTML(payload)))
            } else {
                setEditorState(EditorState.createEmpty())
            }
        }
    }, [payload, convertFromHTML, setEditorState, open])

    const onEditorStateChange = (value: EditorState) => {
        setEditorState(value)
    };

    const onCancel = () => {
        onClose()
    };

    const checkEditorState = () => {
        const data = convertToRaw(editorState.getCurrentContent());
        return !!data.blocks.find(item => item.text)
    }

    const onSubmit = () => {
        if (checkEditorState()) {
            console.log(convertToRaw(editorState.getCurrentContent()))
            onSave(convertToHTML(editorState.getCurrentContent()))
        }
        else {
            showError("Please enter the text")
        }
    }

    return (
        <BaseModal onClose={onCancel} open={open}>
            <DialogTitle onClose={onCancel}>{title}</DialogTitle>
            <DialogContent>
                <div>
                    <Editor
                        placeholder="Type Here..."
                        editorState={editorState}
                        wrapperClassName="wrapper-class"
                        editorClassName={classnames("editor-class", styles.editor)}
                        toolbarClassName="toolbar-class"
                        onEditorStateChange={onEditorStateChange}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <LoadingButton variant="contained" onClick={onSubmit} loading={isLoading}>
                    Save
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default HtmlEditor;