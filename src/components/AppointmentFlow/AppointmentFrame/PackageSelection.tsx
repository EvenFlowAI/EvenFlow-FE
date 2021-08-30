import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled} from "@material-ui/core";
import {CheckBoxOutlined} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {setPackage} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useParams} from "react-router-dom";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {IComplimentaryService, IPackage} from "../../../api/types";
import {IServiceRequest} from "../../../store/reducers/serviceRequests/types";

const border = '1px solid #DADADA';

type TWithPackages = {
    packages: number[];
}

type TService = TWithPackages & IServiceRequest;
type TComplimentary = TWithPackages & IComplimentaryService;
type TPackage = {
    id: number;
    name: string;
    lastIdx?: number;
    moreIdx?: number[];
    price: number;
};

const complimentary: TComplimentary[] = [
    {
        id: 1,
        price: 2,
        durationInHours: 0,
        name: "Top Off Fluids",
        packages: [1, 2, 3],
    },
    {
        id: 1,
        price: 2,
        durationInHours: 0,
        name: "Courtesy Car Wash",
        packages: [1, 2, 3]
    },
    {
        id: 1,
        price: 2,
        durationInHours: 0,
        name: "Courtesy Spray Wax",
        packages: [2, 3]
    }
]

const Wrapper = styled('div')({
    display: "grid",
    marginTop: 12,
    gap: "0 20px",
    gridTemplateColumns: "2fr repeat(3, 1fr)",
    width: "100%",
    alignItems: "stretch",
    "& .currentWrp": {
        display: "flex",
        alignItems: "center",
        justifyContent: "stretch"
    },
    "&>div": {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: border,
        padding: '2px 8px',
        fontWeight: "bold",
        borderLeft: border,
        borderRight: border,
        cursor: "pointer",
        transition: "all .2s",
        "&.selected": {
            borderLeftColor: "#000000",
            borderRightColor: "#000000",
            "&.top": {
                borderTopColor: "#000000"
            },
            "&.end": {
                borderBottomColor: "#000000"
            },
            "&.title": {
                background: "#000000",
                color: "#FFFFFF"
            },
            "& .triangle": {
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: "10px solid #000000",
            },
            "& .current": {
                background: "#000000",
                color: "#FFFFFF",
            }
        },
        '&.top': {
            borderTop: border,
        },
        '&:nth-child(4n+1)': {
            textAlign: "right",
            justifyContent: "flex-end",
            cursor: "default",
        },
        "&.gray": {
            background: "#DADADA"
        },
        "&.title": {
            padding: 20,
            fontSize: 20,
            textTransform: "uppercase"
        },
        "&.subtitle": {
            textTransform: "uppercase"
        },
        "&.service": {
            padding: "6px 8px"
        },
        "&.green": {
            background: "#E6FCEC"
        },
        "&.lgray": {
            background: "#EFEFEF",
        },
        "&.green.subtitle": {
            background: "#89E5AB"
        },
        "&.last": {
            borderBottomColor: "#000000",
        },
        "&.totalComplimentary": {
            padding: "16px 8px",
            color: "#008331"
        },
        "&.total": {
            padding: 8,
            "&.price": {
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                alignItems: "center",
                justifyContent: "center",
                "&>.before": {
                    textDecoration: "line-through",
                    fontWeight: "normal",
                    color: "#142EA1"
                },
                "& .current": {
                    flexGrow: 1
                }
            },
            "&>.info": {
                display: "inline-block",
                marginLeft: 4,
                textTransform: "none",
                fontWeight: "normal"
            }
        }
    }
});

export const PackageSelection: React.FC<TActionProps> = ({onBack, onNext}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const selectedPackage = useSelector((state: RootState) => state.appointmentFrame.selectedPackage);
    const selectedVehicle = useSelector((state: RootState) => state.appointmentFrame.selectedVehicle);
    const maintenanceDetails = useSelector((state: RootState) => state.appointmentFrame.maintenanceDetails);

    const [loadedPackages, setPackages] = useState<IPackage[]>([]);

    const [packages, services]: [TPackage[], TService[]] = useMemo(() => {
        if (loadedPackages.length) {
            const loadedPackage = loadedPackages[0];
            const services: TService[] = [];
            const packages: TPackage[] = [];

            for (let option of loadedPackage.options) {
                packages.push({
                    id: option.id,
                    price: option.price,
                    name: option.name,
                    moreIdx: []
                })
                for (let service of option.serviceRequests) {
                    const pushedService = services.find(s => s.id === service.id);
                    if (!pushedService) {
                        services.push({
                            ...service, packages: [option.id]
                        })
                    } else if (!pushedService.packages.includes(option.id)) {
                        pushedService.packages = [...pushedService.packages, option.id];
                    }
                }
            }

            return [packages, services];
        }
        return [[], []];
    }, [loadedPackages]);

    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        setLoading(true);
        Api.call<IPackage[]>(
            Api.endpoints.MaintenancePackages.ByVehicle,
            {
                data: {
                    serviceCenterId: decodeSCID(id),
                    vehicle: {
                        ...selectedVehicle,
                        mileage: maintenanceDetails.serviceInterval
                    }
                }
            }
        )
            .then(({data}) => {
                setPackages(data);
            })
            .catch(() => {
                setPackages([]);
            })
            .finally(() => {setLoading(false)})

    }, [id, selectedVehicle, maintenanceDetails]);

    const setClasses = (id: number, cls: string) => {
        if (id === selectedPackage) {
            return `${cls} selected`;
        }
        return cls;
    }

    const handleClick = (id: number) => () => {
        dispatch(setPackage(id));
    }

    return (
        <StepWrapper>
            <NoItemsLoading
                wrapperStyles={{marginTop: 20}}
                items={packages}
                loading={loading}
                label={"There are no packages available"} />
            {packages.length ? <Wrapper>
                <div className='top'/>
                {packages.map(p => <div
                    className={setClasses(p.id, "top title")}
                    onClick={handleClick(p.id)}
                    key={p.id}>
                    {p.name}
                </div>)}
                <div className="gray subtitle">Included in package</div>
                {packages.map(p => <div className={setClasses(p.id, "gray subtitle")} key={p.id}/>)}
                {services.map((s, idx) => {
                    const isLast = idx + 1 === services.length;
                    const cls = `service${isLast ? ' last' : ''}`;
                    return <React.Fragment key={s.id}>
                        <div className={cls}>{s.description}</div>
                        {packages.map(p => {
                                const clsx = p.lastIdx === idx ? 'service last' : cls;
                                const wMoreClsx = p.moreIdx?.includes(idx) ? `${clsx} lgray` : clsx;
                                return <div
                                    key={p.id}
                                    onClick={handleClick(p.id)}
                                    className={setClasses(p.id, wMoreClsx)}>
                                    {s.packages.includes(p.id) ? <CheckBoxOutlined/> : ""}
                                </div>;
                            }
                        )}
                    </React.Fragment>;
                })}
                <div className="green subtitle">Complimentary</div>
                {packages.map(p =>
                    <div
                        key={p.id}
                        onClick={handleClick(p.id)}
                        className={setClasses(p.id, "green subtitle")}/>
                )}
                {complimentary.map(c => <React.Fragment key={c.name}>
                    <div className="service">{c.name}</div>
                    {packages.map(p =>
                        <div
                            key={p.id}
                            onClick={handleClick(p.id)}
                            className={setClasses(p.id, "service green")}>
                            {c.packages.includes(p.id) ? <CheckBoxOutlined/> : ""}
                        </div>
                    )}
                </React.Fragment>)}
                <div className="totalComplimentary last">Total Complimentary Value</div>
                {packages.map(p =>
                    <div
                        onClick={handleClick(p.id)}
                        className={setClasses(p.id, "totalComplimentary last")}
                        key={p.id}>$50</div>
                )}
                <div className="total end">
                    Total <span className="info">(excluding taxes)</span>
                </div>
                {packages.map(p =>
                    <div
                        onClick={handleClick(p.id)}
                        className={setClasses(p.id, "total price end")}
                        key={p.id}>
                        <div className="before">$115</div>
                        <div className="currentWrp">
                            <div className="triangle"/>
                            <div className="current">$65</div>
                        </div>
                    </div>
                )}
            </Wrapper> : null}
            <Actions
                onBack={onBack}
                nextDisabled={!selectedPackage}
                onNext={onNext} />
        </StepWrapper>
    );
};