import React, {Dispatch, SetStateAction, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { Descendant } from 'slate'

type TTextEditorProps = DialogProps & {
    title: string;
    onSubmit: () => void;
    value: Descendant[];
    setValue: Dispatch<SetStateAction<Descendant[]>>;
}

const TextEditor: React.FC<TTextEditorProps> = ({title, open, onClose, onSubmit, setValue, value}) => {
    const [editor] = useState(() => withReact(createEditor()))
    const onCancel = () => {
        setValue([]);
        onClose();
    };

    const onChange = (value: Descendant[]) => {
        console.log(value);
        setValue(value);
    }
    return (
        <BaseModal open={open} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                {title}
            </DialogTitle>
            <DialogContent>
                <Slate editor={editor} value={value} onChange={onChange}>
                    <Editable onKeyDown={event => {
                        console.log(event.key)
                    }}/>
                </Slate>
            </DialogContent>
            <DialogActions>

            </DialogActions>

        </BaseModal>
    );
};

export default TextEditor;