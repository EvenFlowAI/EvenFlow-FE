import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {TAssignedRequest} from "../../../../../store/reducers/packages/types";
import {MaintenanceOptions} from "../../../../Optimizer/MaintenancePackages/OptionsTable/OptionsTable";
import {makeStyles} from "@material-ui/core/styles";

type TAssignedOpsCodesProps = {
    codes: TAssignedRequest[];
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'start',
        background: '#7898FF',
        color: 'white',
        borderRadius: 4,
        fontWeight: 'bold',
        margin: 4,
        padding: 4,
    },
}))

const AssignedOpsCodes:React.FC<TAssignedOpsCodesProps> = ({codes}) => {
    const {currentPackage} = useSelector((state: RootState) => state.packages);
    const classes = useStyles();

    const getOptionName = (codeId: number) => {
        const option = codes.find(item => item.serviceRequestId === codeId);
        if (option) {
            const optionType = Number(option.type);
            const optionInPackage = currentPackage?.options.find(opt => opt.type === optionType)
            return optionInPackage ? optionInPackage.name : Object.values(MaintenanceOptions)[optionType];
        } else {
            return ''
        }
    }

    return (
        <>
            {codes.slice().sort((a, b) => +a.type - +b.type).map(item => {
                return <div className={classes.wrapper}>Option {getOptionName(item.serviceRequestId)} - {item.code}</div>
            })}
        </>
    );
};

export default AssignedOpsCodes;