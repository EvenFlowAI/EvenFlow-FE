import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../components/modals/BaseModal/BaseModal";
import {LoadingButton} from "../../../components/buttons/LoadingButton/LoadingButton";
import {useActionButtonsStyles} from "../../../hooks/styling/useActionButtonsStyles";
import {DialogProps} from "../../../components/modals/BaseModal/types";
import {ICapacitySetting} from "../../../store/reducers/capacityManagement/types";

type TProps = DialogProps & {editingItem: ICapacitySetting};

const ServiceBookModal: React.FC<TProps> = ({open, onClose, editingItem}) => {
    const {classes} = useActionButtonsStyles();
    const onCancel = () => {}
    const onSave = () => {}
    return (
        <BaseModal open={open} onClose={onCancel} width={780}>
            <DialogTitle onClose={onCancel}>Employee Time Schedule Set Up</DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogActions>
                <div className={classes.wrapper}>
                    <div className={classes.buttonsWrapper}>
                        <LoadingButton
                            // loading={loading || employeesLoading}
                            onClick={onCancel}
                            variant="text"
                            style={{marginRight: 20}}
                            color="info">
                            Close
                        </LoadingButton>
                        <LoadingButton
                            // loading={loading || employeesLoading}
                            onClick={onSave}
                            className={classes.saveButton}>
                            Save
                        </LoadingButton>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};

export default ServiceBookModal;