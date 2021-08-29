import React, {useEffect, useState} from 'react';
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

const border = '1px solid #DADADA';


type TService = {
    name: string;
    description?: string;
    packages: number[];
}
type TPackage = {
    id: number;
    name: string;
    lastIdx?: number;
    moreIdx?: number[];
};

const mockPackages: TPackage[] = [
    {id: 1, name: "Factory", lastIdx: 2, moreIdx: []},
    {id: 2, name: "Value", lastIdx: 4, moreIdx: [3,4]},
    {id: 3, name: "Premium", moreIdx: [5,6]},
];
const complimentary: TService[] = [
    {
        name: "Top Off Fluids",
        packages: [1, 2, 3]
    },
    {
        name: "Courtesy Car Wash",
        packages: [1, 2, 3]
    },
    {
        name: "Courtesy Spray Wax",
        packages: [2, 3]
    }
]
const services: TService[] = [
    {
        name: "Replace Engine Oil & Filter",
        description: "Mobil 1 Synthetic Oil (Up to 6 Quarts)",
        packages: [1, 2, 3]
    },
    {
        name: "Rotate & Balance Tires",
        packages: [1, 2, 3]
    },
    {
        name: "Perform Multi-Point Inspection",
        packages: [1, 2, 3]
    },
    {
        name: "Replace Front Wiper Blades",
        packages: [2, 3]
    },
    {
        name: "Replace Cabin Air Filter",
        packages: [2, 3]
    },
    {
        name: "Perform Wheel Alignment",
        packages: [3]
    },
    {
        name: "Replace Engine Air Filter",
        packages: [3]
    }
];

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

    const [packages, setPackages] = useState([]);

    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        setLoading(true);
        Api.call(
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
                {mockPackages.map(p => <div
                    className={setClasses(p.id, "top title")}
                    onClick={handleClick(p.id)}
                    key={p.id}>
                    {p.name}
                </div>)}
                <div className="gray subtitle">Included in package</div>
                {mockPackages.map(p => <div className={setClasses(p.id, "gray subtitle")} key={p.id}/>)}
                {services.map((s, idx) => {
                    const isLast = idx + 1 === services.length;
                    const cls = `service${isLast ? ' last' : ''}`;
                    return <React.Fragment key={s.name}>
                        <div className={cls}>{s.name}</div>
                        {mockPackages.map(p => {
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
                {mockPackages.map(p =>
                    <div
                        key={p.id}
                        onClick={handleClick(p.id)}
                        className={setClasses(p.id, "green subtitle")}/>
                )}
                {complimentary.map(c => <React.Fragment key={c.name}>
                    <div className="service">{c.name}</div>
                    {mockPackages.map(p =>
                        <div
                            key={p.id}
                            onClick={handleClick(p.id)}
                            className={setClasses(p.id, "service green")}>
                            {c.packages.includes(p.id) ? <CheckBoxOutlined/> : ""}
                        </div>
                    )}
                </React.Fragment>)}
                <div className="totalComplimentary last">Total Complimentary Value</div>
                {mockPackages.map(p =>
                    <div
                        onClick={handleClick(p.id)}
                        className={setClasses(p.id, "totalComplimentary last")}
                        key={p.id}>$50</div>
                )}
                <div className="total end">
                    Total <span className="info">(excluding taxes)</span>
                </div>
                {mockPackages.map(p =>
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