import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../../components/modals/BaseModal/BaseModal";
import {TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Button} from "@mui/material";
import {Loading} from "../../../../../components/wrappers/Loading/Loading";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {TExtendedComplimentary, TExtendedService, TIntervalUpsellForPackage} from "../../../../../api/types";
import {
    updateComplimentaryOrderIndex,
    updateSROrderIndex,
    updateUpsellOrderIndex
} from "../../../../../store/reducers/packages/actions";
import {TextField} from "../../../../../components/formControls/TextFieldStyled/TextField";
import {useStyles} from "./styles";
import {LoadingButton} from "../../../../../components/buttons/LoadingButton/LoadingButton";
import {useException} from "../../../../../hooks/useException/useException";

type TOrderIndexProps = {
    onClose: () => void;
    open: boolean;
}

const OrderIndexModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<TOrderIndexProps>>> = ({onClose, open}) => {
    const {isPackageLoading, currentPackage} = useSelector((state: RootState) => state.packages);
    const [serviceRequests, setServiceRequests] = useState<TExtendedService[]>([]);
    const [complimentary, setComplimentary] = useState<TExtendedComplimentary[]>([]);
    const [upsell, setUpsell] = useState<TIntervalUpsellForPackage[]>([]);
    const { classes  } = useStyles();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        if (open && currentPackage) {
            setServiceRequests(currentPackage.serviceRequests);
            setComplimentary(currentPackage.complimentaryServices);
            setUpsell(currentPackage.intervalUpsells);
        }
    }, [currentPackage, open])

    const onSROrderChange = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()
        setServiceRequests(prev => {
            let itemToUpdate = prev.find(el => el.id === id);
            if (itemToUpdate && e?.target?.value) {
                itemToUpdate = {...itemToUpdate, orderIndex: +e.target.value};
                return prev
                    .filter(el => el.id !== id)
                    .concat(itemToUpdate)
                    .sort((a, b) => a.id - b.id)
            }
            return prev;
        })
    }

    const onComplimentaryOrderChange = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()
        setComplimentary(prev => {
            let itemToUpdate = prev.find(el => el.id === id);
            if (itemToUpdate && e?.target?.value) {
                itemToUpdate = {...itemToUpdate, orderIndex: +e.target.value};
                return prev
                    .filter(el => el.id !== id)
                    .concat(itemToUpdate)
                    .sort((a, b) => a.id - b.id)
            }
            return prev;
        })
    }

    const onUpsellOrderChange = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()
        setUpsell(prev => {
            let itemToUpdate = prev.find(el => el.id === id);
            if (itemToUpdate && e?.target?.value) {
                itemToUpdate = {...itemToUpdate, orderIndex: +e.target.value};
                return prev
                    .filter(el => el.id !== id)
                    .concat(itemToUpdate)
                    .sort((a, b) => a.id - b.id)
            }
            return prev;
        })
    }

    const onCancel = () => {
        onClose();
    }

    const onSubmit = () => {
        if (currentPackage) {
            if (complimentary.length) {
                dispatch(updateComplimentaryOrderIndex(
                    currentPackage.id,
                    complimentary.map(item => ({id: item.id, orderIndex: item.orderIndex})),
                    showError))
            }
            if (serviceRequests.length) {
                dispatch(updateSROrderIndex(
                    currentPackage.id,
                    serviceRequests.map(item => ({id: item.id, orderIndex: item.orderIndex})),
                    showError))
            }
            if (upsell.length) {
                dispatch(updateUpsellOrderIndex(
                    currentPackage.id,
                    upsell.map(item => ({id: item.id, orderIndex: item.orderIndex})),
                    showError))
            }
        }
    }

    return (
        <BaseModal open={open} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Add Index To Maintenance Package's Ops Codes</DialogTitle>
            {isPackageLoading
                ? <Loading/>
                : <DialogContent>
                    <h3 className={classes.title}>Service Requests</h3>
                    <TableContainer style={{ overflowX: 'unset' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.headerCell} key="2">
                                        Order Index
                                    </TableCell>
                                    <TableCell className={classes.headerCell} key="1">
                                        Included in Package
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {serviceRequests
                                    .slice()
                                    .sort((a, b) => a.id - b.id)
                                    .map(item => {
                                        return <TableRow key={item.id}>
                                            <TableCell key="3" width={110}>
                                                <TextField
                                                    type="number"
                                                    inputProps={{min: 1, step: 1, max: serviceRequests.length + 1}}
                                                    name={item.id.toString()}
                                                    value={item.orderIndex}
                                                    onChange={onSROrderChange(item.id)}
                                                />
                                            </TableCell>
                                            <TableCell key="2">{item.description}</TableCell>
                                        </TableRow>
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {upsell?.length
                        ? <React.Fragment>
                        <h3 className={classes.title}>Interval Upsell</h3>
                        <TableContainer style={{ overflowX: 'unset' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.headerCell} key="1">
                                            Order Index
                                        </TableCell>
                                        <TableCell className={classes.headerCell} key="2">
                                            Included in Package
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {upsell
                                        .slice()
                                        .sort((a, b) => a.id - b.id)
                                        .map(item => {
                                            return <TableRow key={item.id}>
                                                <TableCell key="3" width={110}>
                                                    <TextField
                                                        type="number"
                                                        inputProps={{min: 1, step: 1, max: upsell.length + 1}}
                                                        name={item.id.toString()}
                                                        value={item.orderIndex}
                                                        onChange={onUpsellOrderChange(item.id)}
                                                    />
                                                </TableCell>
                                                <TableCell key="2" align="left">{item.description}</TableCell>
                                            </TableRow>
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </React.Fragment>
                        : null}

                    {complimentary?.length
                        ? <React.Fragment>
                            <h3 className={classes.title}>Complimentary Services</h3>
                            <TableContainer style={{ overflowX: 'unset' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.headerCell} key="1">
                                                Order Index
                                            </TableCell>
                                            <TableCell className={classes.headerCell} key="2">
                                                Included in Package
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {complimentary
                                            .slice()
                                            .sort((a, b) => a.id - b.id)
                                            .map(item => {
                                                return <TableRow key={item.id}>
                                                    <TableCell key="3" width={110}>
                                                        <TextField
                                                            type="number"
                                                            inputProps={{min: 1, step: 1, max: complimentary.length + 1}}
                                                            name={item.id.toString()}
                                                            value={item.orderIndex}
                                                            onChange={onComplimentaryOrderChange(item.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell key="2" align="left">{item.name}</TableCell>
                                                </TableRow>
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </React.Fragment>
                        : null}
                </DialogContent>}
            <DialogActions>
                <Button variant="outlined" onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <LoadingButton variant="contained" onClick={onSubmit} loading={isPackageLoading}>
                    Save
                </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default OrderIndexModal;