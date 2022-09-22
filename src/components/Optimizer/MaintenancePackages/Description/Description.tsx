import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../Modals/BaseModal";
import {DialogProps} from "../../../Modals/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {makeStyles} from "@material-ui/core/styles";
import {EditOutlined} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import {useModal} from "../../../../utils/hooks";

type TDescriptionProps = DialogProps;

const useStyles = makeStyles({
    wrapper: {
        display: "grid",
        gap: 10,
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
    const classes = useStyles();
    const {onOpen: onEditorOpen, isOpen: isEditorOpen, onClose: onEditorClose} = useModal();

    const onCancel = () => {
        onClose();
    }

    const onEditSR = (id: number) => {

    }

    const onEditComplimentary = (id: number) => {

    }

    return (
        <BaseModal open={open} onClose={onCancel}>
            <DialogTitle>Describe Maintenance Package's OPS Codes</DialogTitle>
            <DialogContent>
                <h3 className={classes.title}>Service Requests</h3>
                {currentPackage?.serviceRequests.map(item => <div className={classes.wrapper}>
                    <p>{item.code}</p>
                    <p>{item.description}</p>
                    <div>{item.detailedDescription?.split('\n').map(line => <p>{line}</p>)}</div>
                    <div className={classes.iconWrapper}>
                        <IconButton size="small" onClick={() => onEditSR(item.id)}><EditOutlined/></IconButton>
                    </div>
                </div>)}
                <h3 className={classes.title}>Complimentary Services</h3>
                {currentPackage?.complimentaryServices.map(item => <div className={classes.wrapper}>
                    <div/>
                    <p>{item.name}</p>
                    <div>{item.description?.split('\n').map(line => <p>{line}</p>)}</div>
                    <div className={classes.iconWrapper}>
                        <IconButton size="small" onClick={() => onEditComplimentary(item.id)}><EditOutlined/></IconButton>
                    </div>
                </div>)}
            </DialogContent>
        </BaseModal>
    );
};

export default Description;