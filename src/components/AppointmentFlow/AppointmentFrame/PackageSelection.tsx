import React, {useEffect, useMemo, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from "./StepWrapper";
import {Actions} from "./Actions";
import {styled, useMediaQuery, useTheme} from "@material-ui/core";
import {CheckBoxOutlined} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {
    setAdditionalServicesChosen,
    setPackage,
    setPackageIsSelected
} from "../../../store/reducers/appointmentFrameReducer/actions";
import {useParams} from "react-router-dom";
import {Api} from "../../../config/requests";
import {decodeSCID} from "../../../utils/utils";
import {NoItemsLoading} from "../../UI/NoItemsLoading";
import {
    EServiceCenterName,
    IPackage,
    IPackageOptions, TExtendedComplimentary,
    TExtendedService
} from "../../../api/types";
import { ReactComponent as CheckboxCircle } from "../../../assets/img/done_icon_black.svg";
import PackageSelectionMobile from "./PackageSelectionMobile";
import ReactGA from "react-ga";
import {useConfirm, useModal} from "../../../utils/hooks";
import ConfirmChangeOption from "../../Modals/ConfirmChangeOption/ConfirmChangeOption";

const border = '1px solid #DADADA';

type TWithPackages = {
    packages: number[];
}

export type TService = TWithPackages & TExtendedService;
export type TComplimentary = TWithPackages & TExtendedComplimentary;
export type TPackage = {
    lastIdx?: number;
    moreIdx?: number[];
} & IPackageOptions;

const Wrapper = styled('div')(({theme}) => ({
    display: "grid",
    marginTop: 12,
    gap: "0 20px",
    gridTemplateColumns: "2fr repeat(3, 1fr)",
    width: "100%",
    alignItems: "stretch",
    [theme.breakpoints.down('sm')]: {
        overflowX: "auto"
    },

    "& .currentWrp": {
        flexBasis: "50%",
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
        [theme.breakpoints.down("xs")]: {
            minWidth: "180px"
        },
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
        "&.totalMaintenance": {
            fontWeight: 'bold',
            borderTop: border,
            paddingBottom: 10,
            fontSize: 14,
        },
        "&.last": {
            borderBottomColor: "#000000",
        },
        "&.totalComplimentary": {
            padding: "16px 8px",
            color: "#008331",
        },
        "&.total": {
            padding: 8,
            "&.price": {
                display: "grid",
                gridTemplateColumns: "repeat(1, 1fr)",
                alignItems: "center",
                justifyContent: "center",
                "& .current": {
                    flexGrow: 1,
                    fontSize: 20
                }
            },
            '&.priceWithBefore': {
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                alignItems: "center",
                justifyContent: "center",
                "&>.before": {
                    textDecoration: "line-through",
                    fontWeight: "bold",
                    color: "#142EA1",
                    fontSize: 20,
                },
                "& .current": {
                    flexGrow: 1,
                    fontSize: 20
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
}));

const Info = styled("p")({
    color: "#808080",
    fontSize: 14,
    gridColumnStart: 1,
    gridColumnEnd: 5,
    marginTop: 18,
})

export const PackageSelection: React.FC<TActionProps> = ({onBack, onNext, onAddServices}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadedPackages, setPackages] = useState<IPackage[]>([]);
    const {selectedPackage, selectedVehicle, maintenanceDetails, packageIsSelected, service, subService} = useSelector((state: RootState) => state.appointmentFrame);
    const {selectedSR, scProfile} = useSelector((state: RootState) => state.appointment);

    const theme = useTheme();
    const { isOpen, onOpen, onClose } = useModal();
    const {askConfirm} = useConfirm();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));

    const isBmWService = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.BMWSchererville
        || scProfile?.serviceCenterFlag === EServiceCenterName.DealertrackTest, [scProfile]);
    const isSanfordInfinity = useMemo(() => scProfile?.serviceCenterFlag === EServiceCenterName.SanfordInfinity,[scProfile]);
    const isRiverviewFord = useMemo(() => scProfile?.id === 2 ||  scProfile?.id === 19 ||  scProfile?.id === 29, [scProfile])

    const [packages, services, complimentary]: [TPackage[], TService[], TComplimentary[]]
        = useMemo(() => {
        if (loadedPackages.length) {
            const loadedPackage = loadedPackages[0];
            const services: TService[] = [];
            const packages: TPackage[] = [];
            const complimentary: TComplimentary[] = [];

            for (let option of loadedPackage.options.sort((a, b) => a.type - b.type)) {
                packages.push({
                    ...option,
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
                for (let comp of option.complimentaryServices) {
                    const present = complimentary.find(c => c.id === comp.id);
                    if (!present) {
                        complimentary.push({
                            ...comp,
                            packages: [option.id]
                        })
                    } else if (!present.packages.includes(option.id)) {
                        present.packages = [...present.packages, option.id];
                    }
                }
                services.reduce((acc, s, idx) => {
                    if (acc.pck.length > s.packages.length) {
                        const lastPackageId = acc.pck[0];
                        const p = packages.find(p => p.id === lastPackageId);
                        if (p) {
                            p.lastIdx = idx-1;
                            if (acc.moreIdx) {
                                const np = packages.find(el => el.id === acc.moreIdx);
                                if (np) {
                                    np.moreIdx = [...acc.more];
                                }
                            }
                            acc.moreIdx = s.packages[0];
                            acc.more = [idx];
                        }
                    } else if (acc.more.length) {
                        acc.more.push(idx);
                    }
                    if (idx === (services.length - 1) && acc.moreIdx) {
                        const np = packages.find(el => el.id === acc.moreIdx);
                        if (np) {
                            np.moreIdx = [...acc.more];
                        }
                    }
                    return {...acc, pck: s.packages};
                }, {pck: [], more: [], moreIdx: 0} as {pck: number[], more: number[], moreIdx: number});
            }

            return [packages, services, complimentary];
        }
        return [[], [], []];
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
                        mileage: selectedVehicle?.serviceInterval ?? maintenanceDetails.serviceInterval
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
        if (id === selectedPackage?.id) {
            return `${cls} selected`;
        }
        return cls;
    }

    const handleClick = (p: IPackageOptions) => () => {
        dispatch(setPackage(p));
    }

    const handleBack = (): void => {
        ReactGA.event({
            category: 'EvenFlow User',
            action: 'Went back',
            label: 'From Selection Package Page',
        })
        onBack();
    }

    const addServices = () => {
        dispatch(setAdditionalServicesChosen(true));
        if (onAddServices) onAddServices();
    }

    const askAdditionalServices = () => {
        const categoryChosen = service?.type === 0 || subService?.type === 0;
        if (!categoryChosen || !selectedSR.length) {
            askConfirm({
                title: "Would you like additional services?",
                confirmContent: "Yes",
                cancelContent: "No",
                onConfirm: addServices,
                onCancel: onNext,
            })
        } else {
            onNext();
        }
    }

    const handleNext = (): void => {
        if (selectedPackage) {
            dispatch(setPackageIsSelected(true));
            const packageOptions = ['Good', 'Better', 'Best'];
            ReactGA.event({
                category: 'EvenFlow User',
                action: `Selected Package`,
                label: `With ${packageOptions[selectedPackage.type]} Option`,
            })
            if (packageIsSelected) {
                onOpen();
            } else {
                askAdditionalServices()
            }
        }
    }

    return (
        <StepWrapper>
            <NoItemsLoading
                wrapperStyles={{marginTop: 20}}
                items={packages}
                loading={loading}
                label={"There are no packages available"}
            />
            {packages.length ? <React.Fragment>
                {isXs
                    ? <PackageSelectionMobile
                        data={packages}
                        isBmWService={isBmWService}
                        isSanfordInfinity={isSanfordInfinity}
                        />
                    : <Wrapper>
                        <div className='top'/>
                        {packages.map(p => <div
                            className={setClasses(p.id, "top title")}
                            onClick={handleClick(p)}
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
                                            onClick={handleClick(p)}
                                            className={setClasses(p.id, wMoreClsx)}>
                                            {s.packages.includes(p.id) ?  isRiverviewFord ? <CheckboxCircle/> : <CheckBoxOutlined/> : ""}
                                        </div>;
                                    }
                                )}
                            </React.Fragment>;
                        })}
                        {(isSanfordInfinity || isBmWService) && <React.Fragment key="maintenance">
                            <div className="totalMaintenance">Total Maintenance Value:</div>
                            {packages.map(p => <div className={setClasses(p.id, '')}>
                                <span style={{ fontSize: 20 }}>${p.price}</span>
                            </div>)}
                        </React.Fragment>
                        }
                        <div className="green subtitle">Complimentary</div>
                        {packages.map(p =>
                            <div
                                key={p.id}
                                onClick={handleClick(p)}
                                className={setClasses(p.id, "green subtitle")}/>
                        )}
                        {complimentary.map(c => <React.Fragment key={c.name}>
                            <div className="service">{c.name}</div>
                            {packages.map(p =>
                                <div
                                    key={p.id}
                                    onClick={handleClick(p)}
                                    className={setClasses(p.id, "service green")}>
                                    {c.packages.includes(p.id) ? isRiverviewFord ? <CheckboxCircle/> : <CheckBoxOutlined/> : ""}
                                </div>
                            )}
                        </React.Fragment>)}
                        <div className="totalComplimentary last">Total Complimentary Value</div>
                        {isBmWService|| isSanfordInfinity
                            ? packages.map(p => {
                            return <div
                                onClick={handleClick(p)}
                                className={setClasses(p.id, "totalComplimentary last")}
                                key={p.id}>
                                <span style={{ fontSize: 20 }}>{p.marketPriceComplimentaryServices ? `$${p.marketPriceComplimentaryServices}` : ''}</span>
                            </div>;
                        })
                        : packages.map(p => {
                                const price = p.complimentaryServices.reduce(
                                    (acc, el) => acc + el.price, 0
                                );
                                return <div
                                    onClick={handleClick(p)}
                                    className={setClasses(p.id, "totalComplimentary last")}
                                    key={p.id}>
                                    <span style={{ fontSize: 20 }}>{price ? `$${price}` : ''}</span>
                                </div>;
                            })}
                        <div className="total end">
                            Total <span className="info">(excluding taxes)</span>
                        </div>
                        {packages.map(p =>
                            <div
                                onClick={handleClick(p)}
                                className={setClasses(p.id, `total ${isBmWService || isSanfordInfinity ? 'priceWithBefore' : 'price'} end`)}
                                key={p.id}>
                                {(isBmWService || isSanfordInfinity) &&
                                <div className="before">
                                    ${p.marketPriceComplimentaryServices + p.price}
                                </div>}
                                <div className="currentWrp">
                                    <div className="triangle"/>
                                    <div
                                        className="current">${p.price}</div>
                                </div>
                            </div>
                        )}
                        <Info>
                            {isBmWService
                                ? 'Note: Please ask your service advisor regarding factory covered maintenance services.'
                                : 'Note: The maintenance packages may not be available for all vehicle types. Please speak with your Service Advisor to understand where restrictions apply.'
                            }
                        </Info>
                    </Wrapper>
                }
            </React.Fragment> : null}
            <Actions
                onBack={handleBack}
                nextDisabled={!selectedPackage}
                onNext={handleNext} />
            <ConfirmChangeOption open={isOpen} onClose={onClose} onSave={askAdditionalServices}/>
        </StepWrapper>
    );
};