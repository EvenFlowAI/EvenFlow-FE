import React, {useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../../Modals/BaseModal";
import {DialogProps} from "../../../Modals/types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {makeStyles} from "@material-ui/core/styles";
import {Delete, EditOutlined} from "@material-ui/icons";
import {Divider, IconButton} from "@material-ui/core";
import {useException, useModal} from "../../../../utils/hooks";
import HtmlEditor from "../../../Modals/HTMLEditor/HTMLEditor";
import {TExtendedComplimentary, TExtendedService} from "../../../../api/types";
import {Loading} from "../../../UI/Loading";
import {
    updatePackageComplimentaryDescription,
    updatePackageSRDescription
} from "../../../../store/reducers/packages/actions";

type TDescriptionProps = DialogProps;

const useStyles = makeStyles({
    wrapper: {
        display: "grid",
        gridGap: 10,
        gridTemplateColumns: "1fr 3fr 4fr 1fr 1fr",
        alignItems: "baseline",
    },
    iconWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        textAlign: "center"
    }
})

const Description: React.FC<TDescriptionProps>  = ({open, onClose}) => {
    const { isPackageLoading, currentPackage } = useSelector((state: RootState) => state.packages);
    const [editingElement, setEditingElement] = useState<TExtendedService|TExtendedComplimentary|null>(null);
    const [editingElementType, setEditingElementType] = useState<"service"|"complimentary"|null>(null);
    const {onOpen: onEditorOpen, isOpen: isEditorOpen, onClose: onEditorClose} = useModal();
    const dispatch = useDispatch();
    const showError = useException();
    const classes = useStyles();

    const onCancel = () => {
        setEditingElement(null);
        onClose();
    }

    const onEditSR = async(item: TExtendedService) => {
        await setEditingElement(item)
        await setEditingElementType("service");
        onEditorOpen()
    }

    const onEditComplimentary = async (item: TExtendedComplimentary) => {
        await setEditingElement(item)
        await setEditingElementType("complimentary");
        onEditorOpen()
    }

    const onDeleteSR = (item: TExtendedService) => {
        if (currentPackage) dispatch(updatePackageSRDescription(currentPackage.id, item.id, null, showError));
    }

    const onDeleteComplimentary = (item: TExtendedComplimentary) => {
        if (currentPackage) dispatch(updatePackageComplimentaryDescription(currentPackage.id, item.id, null, showError));
    }

    const onSave = (description: string) => {
        const trimmed = description.trim();
        if (trimmed.length > 300) return showError("The description can`t include more than 300 characters")
        if (currentPackage && editingElement) {
            if (trimmed.length && trimmed !== '<p></p>') {
                if (editingElementType === "service") {
                    dispatch(updatePackageSRDescription(currentPackage.id, editingElement.id, trimmed, showError, () => onEditorClose()))
                } else if (editingElementType === "complimentary") {
                    dispatch(updatePackageComplimentaryDescription(currentPackage.id, editingElement.id, trimmed, showError, () => onEditorClose()))
                } else {
                    return;
                }
            } else showError("Please enter the description text")
        }
    }

    return (
        <BaseModal open={open} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Describe Maintenance Package's OPS Codes</DialogTitle>
            {isPackageLoading
                ? <Loading/>
                : <DialogContent>
                    <h3 className={classes.title}>Service Requests</h3>
                    <div className={classes.wrapper}>
                        <h4>Code</h4>
                        <h4>Title</h4>
                        <h4>Description</h4>
                        <h4 className={classes.title}>Edit</h4>
                        <h4 className={classes.title}>Delete</h4>
                    </div>
                    {currentPackage?.serviceRequests
                        .map(item => <div className={classes.wrapper} key={item.id}>
                        <p>{item.code}</p>
                        <p>{item.description}</p>
                        <div>
                            {item.detailedDescription ?
                                <div dangerouslySetInnerHTML={{__html: item.detailedDescription}}/>
                                : <h3>_</h3> }
                        </div>
                        <div className={classes.iconWrapper}>
                            <IconButton size="small" onClick={() => onEditSR(item)}><EditOutlined/></IconButton>
                        </div>
                        <div className={classes.iconWrapper}>
                            <IconButton size="small" onClick={() => onDeleteSR(item)}><Delete/></IconButton>
                        </div>
                    </div>)}
                    <Divider/>
                    <h3 className={classes.title}>Complimentary Services</h3>
                    <div className={classes.wrapper}>
                        <h4/>
                        <h4>Title</h4>
                        <h4>Description</h4>
                        <h4 className={classes.title}>Edit</h4>
                        <h4 className={classes.title}>Delete</h4>
                    </div>
                    {currentPackage?.complimentaryServices
                        .map(item => <div className={classes.wrapper} key={item.id}>
                        <div/>
                        <p>{item.name}</p>
                        <div>
                            {item.detailedDescription
                                ? <div dangerouslySetInnerHTML={{__html: item.detailedDescription}}/>
                                : <h3>_</h3>}
                        </div>
                        <div className={classes.iconWrapper}>
                            <IconButton size="small" onClick={() => onEditComplimentary(item)}><EditOutlined/></IconButton>
                        </div>
                        <div className={classes.iconWrapper}>
                            <IconButton size="small" onClick={() => onDeleteComplimentary(item)}><Delete/></IconButton>
                        </div>
                    </div>)}
                </DialogContent>
            }
            <HtmlEditor
                open={isEditorOpen}
                onSave={onSave}
                onClose={onEditorClose}
                title="Edit Request Description"
                payload={editingElement?.detailedDescription ?? undefined}
            />
        </BaseModal>
    );
};

export default Description;