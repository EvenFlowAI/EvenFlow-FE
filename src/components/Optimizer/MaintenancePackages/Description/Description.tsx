import React, {useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../../../Modals/BaseModal";
import {DialogProps} from "../../../Modals/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {makeStyles} from "@material-ui/core/styles";
import {EditOutlined} from "@material-ui/icons";
import {Divider, IconButton} from "@material-ui/core";
import {useModal} from "../../../../utils/hooks";
import HtmlEditor from "../../../Modals/HTMLEditor/HTMLEditor";
import {TExtendedComplimentary, TExtendedService} from "../../../../api/types";
import {Loading} from "../../../UI/Loading";

type TDescriptionProps = DialogProps;

const useStyles = makeStyles({
    wrapper: {
        display: "grid",
        gridGap: 10,
        gridTemplateColumns: "1fr 3fr 4fr 1fr",
    },
    iconWrapper: {
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
    },
    title: {
        textAlign: 'center'
    }
})

const Description: React.FC<TDescriptionProps>  = ({open, onClose}) => {
    const { isPackageLoading, currentPackage } = useSelector((state: RootState) => state.packages);
    const [editingElement, setEditingElement] = useState<TExtendedService|TExtendedComplimentary|null>(null);
    const classes = useStyles();
    const {onOpen: onEditorOpen, isOpen: isEditorOpen, onClose: onEditorClose} = useModal();

    const onCancel = () => {
        setEditingElement(null);
        onClose();
    }

    const onEditSR = async(item: TExtendedService) => {
        await setEditingElement(item)
        onEditorOpen()
    }

    const onEditComplimentary = async (item: TExtendedComplimentary) => {
        await setEditingElement(item)
        onEditorOpen()
    }

    const onSave = () => {
        // todo request
    }

    return (
        <BaseModal open={open} onClose={onCancel}>
            <DialogTitle>Describe Maintenance Package's OPS Codes</DialogTitle>
            {isPackageLoading
                ? <Loading/>
                : <DialogContent>
                    <h3 className={classes.title}>Service Requests</h3>
                    <div className={classes.wrapper}>
                        <h4>Code</h4>
                        <h4>Title</h4>
                        <h4>Description</h4>
                        <h4 className={classes.title}>Edit</h4>
                    </div>
                    {currentPackage?.serviceRequests.map(item => <div className={classes.wrapper} key={item.id}>
                        <p>{item.code}</p>
                        <p>{item.description}</p>
                        <div>
                            {item.detailedDescription ?
                                item.detailedDescription?.split('\n').map(line => <p>{line}</p>)
                                : <h3>_</h3> }
                        </div>
                        <div className={classes.iconWrapper}>
                            <IconButton size="small" onClick={() => onEditSR(item)}><EditOutlined/></IconButton>
                        </div>
                    </div>)}
                    <Divider/>
                    <h3 className={classes.title}>Complimentary Services</h3>
                    <div className={classes.wrapper}>
                        <h4/>
                        <h4>Title</h4>
                        <h4>Description</h4>
                        <h4>Edit</h4>
                    </div>
                    {currentPackage?.complimentaryServices.map(item => <div className={classes.wrapper} key={item.id}>
                        <div/>
                        <p>{item.name}</p>
                        <div>
                            {item.detailedDescription
                                ? item.detailedDescription.split('\n').map(line => <p>{line}</p>)
                                : <h3>_</h3>}
                        </div>
                        <div className={classes.iconWrapper}>
                            <IconButton size="small" onClick={() => onEditComplimentary(item)}><EditOutlined/></IconButton>
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