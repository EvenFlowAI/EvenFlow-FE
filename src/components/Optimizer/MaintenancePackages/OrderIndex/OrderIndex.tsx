import React, {useEffect, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../Modals/BaseModal";
import {TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Button} from "@material-ui/core";
import {Loading} from "../../../UI/Loading";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import {makeStyles} from "@material-ui/core/styles";
import {TExtendedComplimentary, TExtendedService} from "../../../../api/types";
import {LoadingButton} from "../../../UI/Button";
import {updateComplimentaryOrderIndex, updateSROrderIndex} from "../../../../store/reducers/packages/actions";
import {useException} from "../../../../utils/hooks";
import {TextField} from "../../../UI/TextField";

type TOrderIndex = {
    onClose: () => void;
    open: boolean;
}
const baseCellStyles = {
    backgroundColor: 'white',
    border: "none",
}

const useStyles = makeStyles(() => ({
    title: {
        textAlign: "center"
    },
    headerCell: {
        ...baseCellStyles,
        color: "#9DA8B5",
        fontWeight: 'bold',
        justifyContent: 'left',
    }
}))

const OrderIndex: React.FC<TOrderIndex> = ({onClose, open}) => {
    const {isPackageLoading, currentPackage} = useSelector((state: RootState) => state.packages);
    const [serviceRequests, setServiceRequests] = useState<TExtendedService[]>([]);
    const [complimentary, setComplimentary] = useState<TExtendedComplimentary[]>([]);
    const classes = useStyles();
    const dispatch = useDispatch();
    const showError = useException();

    useEffect(() => {
        if (open && currentPackage) {
            setServiceRequests(currentPackage.serviceRequests);
            setComplimentary(currentPackage.complimentaryServices);
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

    const onCancel = () => {
        onClose();
    }

    const onSubmit = () => {
        if (currentPackage) {
            dispatch(updateComplimentaryOrderIndex(
                currentPackage.id,
                complimentary.map(item => ({id: item.id, orderIndex: item.orderIndex})),
                showError))
            dispatch(updateSROrderIndex(
                currentPackage.id,
                serviceRequests.map(item => ({id: item.id, orderIndex: item.orderIndex})),
                showError))
        }
    }

    return (
        <BaseModal open={open} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Describe Maintenance Package's OPS Codes</DialogTitle>
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
                                            <TableCell key="3">
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

                    <h3 className={classes.title}>Complimentary Services</h3>
                    <TableContainer style={{ overflowX: 'unset' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.headerCell} key="1">
                                        Order
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
                                            <TableCell key="3">
                                                <TextField
                                                    type="number"
                                                    inputProps={{min: 1, step: 1, max: complimentary.length + 1}}
                                                    name={item.id.toString()}
                                                    value={item.orderIndex}
                                                    onChange={onComplimentaryOrderChange(item.id)}
                                                />
                                            </TableCell>
                                            <TableCell key="2">{item.name}</TableCell>
                                        </TableRow>
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
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

export default OrderIndex;