import {TableRowDataTypeResp} from "../../../../types/types";
import {EPodSummaryOption, IPodSummary} from "../../../../store/reducers/pods/types";
import React from "react";
import {ReactComponent as Checked} from '../../../../assets/img/checkmark_checked.svg'
import {ReactComponent as Unchecked} from '../../../../assets/img/radiobutton_unchecked.svg'

export const rowData: TableRowDataTypeResp<IPodSummary>[] = [
    {
        header: "Service Book",
        val: el => el.serviceBookName ?? "",
        width: 190,
    },
    {
        header: "Ops Codes",
        val: el => el.options.includes(EPodSummaryOption.OpsCodes) ? <Checked/> : <Unchecked/>,
        align: 'center',
    },
    {
        header: "Service Type",
        val: el => el.options.includes(EPodSummaryOption.ServiceType) ? <Checked/> : <Unchecked/>,
        align: 'center',
    },
    {
        header: "Job Type",
        val: el => el.options.includes(EPodSummaryOption.JobType) ? <Checked/> : <Unchecked/>,
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