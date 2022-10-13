import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../../../store/rootReducer";
import {TAssignedRequest} from "../../../../../store/reducers/packages/types";
import {TExtendedService} from "../../../../../api/types";
import {IServiceRequest} from "../../../../../store/reducers/serviceRequests/types";
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
    const {nonSelectedList} = useSelector((state: RootState) => state.serviceRequests);
    const {currentPackage} = useSelector((state: RootState) => state.packages);
    const classes = useStyles();

    const selectedCodes: IServiceRequest[]|TExtendedService[] = useMemo(() => {
        const codesIds = codes.map(item => item.serviceRequestId);
        return nonSelectedList.filter(item => codesIds.includes(item.id))
    }, [nonSelectedList, codes])

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
            {selectedCodes.map(item => {
                return <div className={classes.wrapper}>Option {getOptionName(item.id)} - {item.code}</div>
            })}
        </>
    );
};

export default AssignedOpsCodes;