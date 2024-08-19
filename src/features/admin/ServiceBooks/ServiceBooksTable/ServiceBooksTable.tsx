import React, {useEffect, useState} from 'react';
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import {useDispatch, useSelector} from "react-redux";
import {loadPodsSummary, removePod, setPodById, setPodsOrderIndex} from "../../../../store/reducers/pods/actions";
import {Table} from "../../../../components/tables/Table/Table";
import {RootState} from "../../../../store/rootReducer";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import {EPodSummaryOption, IPodSummary, IPodSummaryLocal, TPodOrder} from "../../../../store/reducers/pods/types";
import {useException} from "../../../../hooks/useException/useException";
import {useConfirm} from "../../../../hooks/useConfirm/useConfirm";
import {useModal} from "../../../../hooks/useModal/useModal";
import {ServiceBookModal} from "../../ServiceBookModal/ServiceBookModal";
import {TableRowDataTypeResp} from "../../../../types/types";
import {ReactComponent as Checked} from '../../../../assets/img/checkmark_checked.svg'
import {ReactComponent as Unchecked} from '../../../../assets/img/radiobutton_unchecked.svg'
import ButtonsRow from "../ButtonsRow/ButtonsRow";
import {findMissingNumbers} from "../../ServiceCategories/AddServiceCategoryModal/utils";
import {StyledField} from "./styles";
import {EOrderError} from "../../ServiceCategories/AddServiceCategoryModal/types";

const ServiceBooksTable = () => {
    const {summary, podsLoading} = useSelector((state: RootState) => state.pods);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    const [currentItem, setCurrentItem] = useState<IPodSummary | null>(null);
    const [currentData, setCurrentData] = useState<IPodSummaryLocal[]>([]);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [isChecked, setChecked] = useState<boolean>(false);
    const [wrongOrderIndexes, setWrongOrderIndexes] = useState<number[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const showError = useException();
    const {askConfirm} = useConfirm();
    const {isOpen, onClose, onOpen} = useModal();

    useEffect(() => {
        setEdit(false);
        setWrongOrderIndexes([])
    }, [selectedSC])

    const handleErrors = (errors: EOrderError[]) => {
        if (errors.includes(EOrderError.MissingNumber)) {
            showError("An order value was skipped while assigning. Please adjust so there are no missing values.")
        }
        if (errors.includes(EOrderError.SameNumber)) {
            showError("Two or more service books have the same order value. Please adjust so each service book has a unique value.")
        }
        if (!currentData.every(el => el.orderIndex)) {
            showError("A service book(s) is missing an order value. Please assign a value for all service books.")
        }
    }

    const clearState = () => {
        setEdit(false)
        setChecked(false)
        setWrongOrderIndexes([]);
    }

    const onSave = () => {
        setChecked(true)
        const indexes: number[] = currentData.map(el => el.orderIndex ?? 0)
        const {wrongNumbers, errors} = findMissingNumbers(indexes, currentData.length)
        if (!wrongNumbers.length) {
            const data: TPodOrder[] = currentData.map(el => ({id: el.serviceBookId, orderIndex: el.orderIndex ?? 0}))
            selectedSC && dispatch(setPodsOrderIndex(selectedSC?.id, data, showError, clearState))
        } else {
            setWrongOrderIndexes(wrongNumbers)
            handleErrors(errors)
        }
    }

    const onCancel = () => {
        clearState()
        setCurrentData(summary.map(el => ({...el, prevOrder: el.orderIndex ?? 0})))
    }

    useEffect(() => {
        if (selectedSC) dispatch(loadPodsSummary(selectedSC.id))
    }, [selectedSC])

    useEffect(()=> {
        setCurrentData(summary.map(el => ({...el, prevOrder: el.orderIndex ?? 0})))
    }, [summary])

    const onChangeOrder = (serviceBookId: number|null) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChecked(false)
        if (Number.isInteger(+e.target.value)) {
            setCurrentData(prev => {
                const itemToUpdate = prev.find(el => el.serviceBookId === serviceBookId)
                if (itemToUpdate) {
                    const updated = {...itemToUpdate, orderIndex: +e.target.value}
                    return [...prev.filter(item => item.serviceBookId !== serviceBookId), updated]
                        .sort((a, b) => a.prevOrder - b.prevOrder)
                }
                return prev
            })
        }
    }

    const rowData: TableRowDataTypeResp<IPodSummary>[] = [
        {
            header: "Order",
            align: 'center',
            val: el =>  isEdit
                ? <StyledField
                    type="tel"
                    error={isChecked && (el.orderIndex ? wrongOrderIndexes.includes(el.orderIndex) : !el.orderIndex)}
                    inputProps={{min: 1, step: 1, max: summary.length}}
                    value={el.orderIndex ?? ""}
                    onChange={onChangeOrder(el.serviceBookId)}/>
                : el.orderIndex
                    ? el.orderIndex.toString()
                    : "",
            width: 80,
        },
        {
            header: "Service Book",
            val: el => el.serviceBookName ?? "",
            width: 190,
        },
        {
            header: "Op Codes",
            val: el => el.options.includes(EPodSummaryOption.OpsCodes) ? <Checked/> : <Unchecked/>,
            align: 'center',
        },
        {
            header: "Make",
            val: el => el.options.includes(EPodSummaryOption.Make) ? <Checked/> : <Unchecked/>,
            align: 'center',
        },
        {
            header: "Model",
            val: el => el.options.includes(EPodSummaryOption.Model) ? <Checked/> : <Unchecked/>,
            align: 'center',
        },
        {
            header: "Mileage",
            val: el => el.options.includes(EPodSummaryOption.Mileage) ? <Checked/> : <Unchecked/>,
            align: 'center',
        },
        {
            header: "Engine Type",
            val: el => el.options.includes(EPodSummaryOption.EngineType) ? <Checked/> : <Unchecked/>,
            align: 'center',
        },
        {
            header: "Service Valet",
            val: el => el.options.includes(EPodSummaryOption.ServiceValet) ? <Checked/> : <Unchecked/>,
            align: 'center',
        },
        {
            header: "Mobile Service",
            val: el => el.options.includes(EPodSummaryOption.MobileService) ? <Checked/> : <Unchecked/>,
            align: 'center',
        },
        {
            header: "Transport Options",
            val: el => el.options.includes(EPodSummaryOption.TransportOptions) ? <Checked/> : <Unchecked/>,
            align: 'center',
        },
        {
            header: "Advisors",
            val: el => el.options.includes(EPodSummaryOption.Advisors) ? <Checked/> : <Unchecked/>,
            align: 'center',
        },
    ]

    const openMenu = (el: IPodSummary) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentItem(el);
        setAnchorEl(e.currentTarget);
    }

    const tableActions = (el: IPodSummary) => {
        return (
            <IconButton onClick={openMenu(el)} size="large">
                <MoreHoriz />
            </IconButton>
        );
    }

    const openEdit = () => {
        onOpen()
        setAnchorEl(null);
    }

    const handleRemove = async () => {
        if (!currentItem) {
            showError("Service Book not specified");
        } else {
            try {
                await dispatch(removePod(currentItem.serviceBookId, selectedSC?.id, showError));
                setCurrentItem(null);
            } catch (e) {
                showError(e);
            }
        }
    }

    const askRemove = () => {
        setAnchorEl(null);
        if (!currentItem) {
            showError("Service Book is not chosen");
        } else {
            askConfirm({
                isRemove: true,
                title: `Please confirm you want to remove Service Book ${currentItem.serviceBookName ?? "-"}?`,
                onConfirm: handleRemove
            });
        }
    }

    const onEditClose = () => {
        setCurrentItem(null);
        dispatch(setPodById(null));
        onClose()
    }

    return (
        <>
        <ButtonsRow setEdit={setEdit} isEdit={isEdit} onSave={onSave} onCancel={onCancel}/>
        <div style={{paddingTop: 32}}>
            <Table
                data={currentData}
                index="serviceBookId"
                rowData={rowData}
                actions={tableActions}
                hidePagination
                verticalAlign="bottom"
                isLoading={podsLoading}/>
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => {setAnchorEl(null);}}
                anchorEl={anchorEl}
            >
                <MenuItem onClick={openEdit} disabled={podsLoading}>Edit</MenuItem>
                <MenuItem onClick={askRemove} disabled={podsLoading}>Remove</MenuItem>
            </Menu>
            <ServiceBookModal open={isOpen} onClose={onEditClose} editingItemId={currentItem?.serviceBookId}/>
        </div>
        </>
    );
};

export default ServiceBooksTable;