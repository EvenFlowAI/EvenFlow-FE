import React, {useEffect, useState} from 'react';
import {Loading} from "../../../../components/wrappers/Loading/Loading";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button, IconButton, Menu, MenuItem, Switch} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {MoreHoriz} from "@mui/icons-material";
import {ICustomerConsent} from "../../../../store/reducers/screenSettings/types";
import {useStyles} from "./styles";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {TableRowDataType} from "../../../../types/types";
import {Table} from "../../../../components/tables/Table/Table";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";
import {useModal} from "../../../../hooks/useModal/useModal";

export const EditCustomerConsentModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = ({onClose, ...props}) => {
    const {consentsList, isConsentLoading} = useSelector((state: RootState) => state.screenSettingsBooking);
    const [data, setData] = useState<ICustomerConsent[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentConsent, setCurrentConsent] = useState<ICustomerConsent|null>(null)
    const {selectedSC} = useSCs();
    const { classes  } = useStyles();
    const {askConfirm} = useConfirm();
    const {isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose} = useModal();
    const {isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose} = useModal();

    useEffect(() => {
        setData(consentsList.sort((a, b) => a.name.localeCompare(b.name)))
    }, [consentsList])

    const onCancel = () => {
        onClose();
    }

    const handleSwitch = (el: ICustomerConsent) => (e: any, value: boolean) => {
        setData(prev => {
            const itemToUpdate = prev.find(item => item.id === el.id)
            if (itemToUpdate) {
                const updated = {...itemToUpdate, isEnabled: value}
                const filtered = prev.filter(item => item.id !== el.id)
                return [...filtered, updated].sort((a, b) => a.name.localeCompare(b.name))
            }
            return prev
        })
    }

    const handleRemove = async () => {
        if (selectedSC) {
        }
    }

    const openMenu = (el: ICustomerConsent) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentConsent(el)
        setAnchorEl(e.currentTarget);
    }


    const tableActions = (el: ICustomerConsent) => {
        return (
            <IconButton onClick={openMenu(el)} size="large">
                <MoreHoriz />
            </IconButton>
        );
    }

    const rowData: TableRowDataType<ICustomerConsent>[] = [
        {
            header: 'Name',
            val: (el) => el.name,
            width: 430
        },
        {
            header: 'Status',
            val: (el) => (
                <Switch
                    onChange={handleSwitch(el)}
                    checked={el.isEnabled}
                    color="primary"
                />
            ),
            width: 430
        }
    ]

    const askRemove = () => {
        setAnchorEl(null);
        if (currentConsent) {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove Customer Consent ${currentConsent?.name}?`,
                onConfirm: handleRemove
            });
        }
    }


    return (
        <BaseModal {...props} width={700} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>
                Customer Consent
            </DialogTitle>
            <DialogContent>
                <div className={classes.topBtnWrapper}>
                    <Button variant="contained" onClick={onAddOpen}>Add Consent</Button>
                </div>
                {isConsentLoading
                    ? <Loading/>
                    : <Table
                        data={data}
                        index={"id"}
                        rowData={rowData}
                        actions={tableActions}
                        hidePagination/>}
                <Menu
                    open={Boolean(anchorEl)}
                    onClose={() => {setAnchorEl(null);}}
                    anchorEl={anchorEl}
                >
                    <MenuItem onClick={() => onEditOpen()}>Edit</MenuItem>
                    <MenuItem onClick={askRemove}>Remove</MenuItem>
                </Menu>
            </DialogContent>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            disabled={isConsentLoading}
                            color="info"
                            onClick={onCancel}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};