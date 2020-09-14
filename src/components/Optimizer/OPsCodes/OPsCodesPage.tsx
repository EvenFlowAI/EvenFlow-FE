import React, {useEffect} from "react";
import {TitleContainer} from "../../Content/TitleContainer/TitleContainer";
import {optimizerRoot} from "../utils";
import {Button, IconButton} from "@material-ui/core";
import {OPsCodesListDialog} from "../../Modals/OPsCodesListDialog/OPsCodesListDialog";
import {useModal, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {loadAssignedServiceRequests} from "../../../store/reducers/serviceRequests/actions";
import {TableRowDataType} from "../../UI/types";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {Table} from "../../UI/Table";
import {MoreHoriz} from "@material-ui/icons";

const tableRow: TableRowDataType<IAssignedServiceRequest>[] = [
    {header: "Service Ops Code", val: el => el.serviceRequest.code},
    {
        header: "Description",
        val: el => <CellData
            data={el.serviceRequest.description}
            override={el.serviceRequestOverride?.description}
        />
    },
    {
        header: "Duration (hours)",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.durationInHours.toFixed(1)}
            override={el.serviceRequestOverride?.durationInHours.toFixed(1)}
        />
    },
    {
        header: "Number of technicians",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.countOfTechnicians.toString()}
            override={el.serviceRequestOverride?.countOfTechnicians.toString()}
        />
    },
    {
        header: "Skill level of technicians",
        align: "center",
        val: el => <CellData
            data={el.serviceRequest.skillLevelOfTechnicians.toString()}
            override={el.serviceRequestOverride?.skillLevelOfTechnicians.toString()}
        />
    },
    {
        header: "Warranty invoice",
        align: "center",
        val: el => <CellData
            data={"$" + el.serviceRequest.warrantyInvoiceAmount.toString()}
            override={"$" + el.serviceRequestOverride?.warrantyInvoiceAmount.toString()}
        />
    },
    {
        header: "Regular invoice",
        align: "center",
        val: el => <CellData
            data={"$" + el.serviceRequest.invoiceAmount.toString()}
            override={"$" + el.serviceRequestOverride?.invoiceAmount.toString()}
        />
    }
]

const CellData: React.FC<{data: string; override?: string}> = ({data, override}) => {
    return <span>{data}</span>;
}

export const OPsCodesPage = () => {
    const {isOpen, onOpen, onClose} = useModal();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const [serviceRequestsList, isLoading] = useSelector((state: RootState) => [
        state.serviceRequests.assignedList,
        state.serviceRequests.assignedLoading
    ]);

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id));
        }
    }, [selectedSC, dispatch]);
    const actions = (el: IAssignedServiceRequest) => {
        return <IconButton><MoreHoriz /></IconButton>
    }

    return <>
        <TitleContainer
            title="Service Requests"
            pad
            parent={optimizerRoot}
            actions={
                <Button
                    color="primary"
                    variant="contained"
                    onClick={onOpen}
                >
                    Add Ops Code
                </Button>
            }
        />
        <Table<IAssignedServiceRequest>
            data={serviceRequestsList}
            index="id"
            rowData={tableRow}
            actions={actions}
            isLoading={isLoading}
        />
        <OPsCodesListDialog open={isOpen} onClose={onClose} />
    </>;
}