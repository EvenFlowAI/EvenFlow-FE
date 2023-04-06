import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../Modals/BaseModal";
import {IAppointmentByQuery, ICreateAppointment, IPackageAppointments, IPackageOptions,} from "../../../api/types";
import {Button, Divider, Grid,} from "@material-ui/core";
import {LoadingButton} from "../../UI/Button";
import {useException, useMessage, useSCs} from "../../../utils/hooks";
import {
    EAppointmentTimingType,
    IAppointmentSlot,
    IServiceValetAppointment,
    ISR,
    IVehicleData
} from "../../../store/reducers/appointment/types";
import {TextField} from "../../UI/TextField";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {API} from "../../../api/api";
import moment from "moment";
import {VIN_LENGTH} from "../../../config/constants";
import {Api} from "../../../config/requests";
import {getOptions, validatePhoneNumber} from "../../../utils/utils";
import {EDemandCategory} from "../../../store/reducers/pricingSettings/types";
import {loadMakes} from "../../../store/reducers/appointmentFrameReducer/actions";
import {loadEngineType, loadMileage} from "../../../store/reducers/vehicleDetails/actions";
import {useDispatch, useSelector} from "react-redux";
import VehicleInfo from "./parts/VehicleInfo";
import DriverInfo from "./parts/DriverInfo";
import ServicesSelection from "./parts/ServicesSelection";
import SlotSelection from "./parts/SlotSelection";
import Transportation from "./parts/Transportation";
import Reminders from "./parts/Reminders";
import {ICategory} from "../../../store/reducers/categories/types";
import {RootState} from "../../../store/rootReducer";
import {EJobType} from "../../../store/reducers/pods/types";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {IEngineType} from "../../../store/reducers/vehicleDetails/types";
import {EServiceType} from "../../../store/reducers/appointmentFrameReducer/types";
import {loadBookingFlowConfig} from "../../../store/reducers/bookingFlowConfig/actions";
import {EServiceTypeBookingFlow} from "../../../store/reducers/bookingFlowConfig/types";
import {loadFirstScreenOptionsByQuery} from "../../../store/reducers/serviceTypes/actions";
import {IFirstScreenOption} from "../../../store/reducers/serviceTypes/types";
import {TForm, TOption} from "./types";
import SVSlotSelection from "./parts/SVSlotSelection";

const initialForm: TForm = {
    date: "",
    slot: "",
    reminderTypes: [],
    driverName: "",
    driverPhoneNumber: "",
    driverEmail: "",
    transportationOption: null,
    vehicleVin: "",
    vehicleMake: "",
    vehicleYear: "",
    vehicleModel: "",
    vehicleMileage: "",
    vehicleTransmission: "",
    vehicleDriveType: "",
    isNeedCall: false,
    comment: "",
    serviceRequestIds: [],
    vehicleEngineTypeId: null,
};

const requiredFields = ['driverName', 'driverPhoneNumber', 'driverEmail', 'vehicleMake', 'vehicleYear', 'vehicleModel', 'vehicleMileage']

export const AppointmentDialog: React.FC<DialogProps<IAppointmentByQuery>> = ({onAction, payload, ...props}) => {
    const { packages } = useSelector((state: RootState) => state.appointments);
    const { config } = useSelector((state: RootState) => state.bookingFlowConfig);
    const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
    const { firstScreenOptions } = useSelector((state: RootState) => state.serviceTypes);
    const [form, setForm] = useState<TForm>(initialForm);
    const initialRef = useRef(false);
    const [vinLoading, setVinLoading] = useState<boolean>(false);
    const [filterDate, setDate] = useState<ParsableDate>("");
    const [srList, setSrList] = useState<ISR[]>([]);
    const [selectedSR, setSelectedSR] = useState<ISR[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<IPackageAppointments | null>(null);
    const [jobType, setJobType] = useState<TOption|null>(null);
    const [selectedPackageOption, setSelectedPackageOption] = useState<IPackageOptions | null>(null);
    const [srLoading, setSrLoading] = useState<boolean>(false);
    const [slots, setSlots] = useState<IAppointmentSlot[]>([]);
    const [serviceValetSlots, setServiceValetSlots] = useState<IServiceValetAppointment[]>([]);
    const [preloadedSlot, setPreloadedSlot] = useState<IAppointmentSlot|null>(null);
    const [preloadedSVSlot, setPreloadedSVSlot] = useState<IServiceValetAppointment|null>(null);
    const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<IAppointmentSlot|null>(null);
    const [selectedSVSlot, setSelectedSVSlot] = useState<IServiceValetAppointment|null>(null);
    const [selectedEngine, setSelectedEngine] = useState<IEngineType|null>(null);
    const [serviceTypeOption, setServiceTypeOption] = useState<IFirstScreenOption|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [address, setAddress] = useState<any>("");
    const [zipCode, setZipCode] = useState<string>("");
    const oldVin = useRef<string>("");
    const showError = useException();
    const showMessage = useMessage();
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    const isVehicleDataValid = useMemo(() => {
        return Boolean(form.vehicleMake) && Boolean(form.vehicleYear) && Boolean(form.vehicleModel) && Boolean(form.vehicleMileage)
    }, [form])
    const jobTypeOptions: TOption[] = useMemo(() => getOptions(Object.keys(EJobType).filter(key => Number.isNaN(+key))), []);
    const isMobileServiceOn = useMemo(()=> config.find(item => item.serviceType === EServiceTypeBookingFlow.MobileService && item.available), [config]);
    const isPickUpServiceOn = useMemo(()=> config.find(item => item.serviceType === EServiceTypeBookingFlow.PickUpDropOff && item.available), [config]);
    const otherServiceTypesAvailable = useMemo(() => Boolean(firstScreenOptions.length), [firstScreenOptions])

    const fillDataByVin = useCallback((d: IVehicleData) => {
        setForm(f => ({
            ...f,
            vehicleModel: d.model || f.vehicleModel,
            vehicleMake: d.make || f.vehicleMake,
            vehicleTransmission: d.transmission || f.vehicleTransmission,
            vehicleDriveType: d.driveType || f.vehicleDriveType,
            vehicleYear: d.year ? String(d.year) : f.vehicleYear,
            vehicleMileage: d.mileage ? String(d.mileage) : f.vehicleMileage
        }))
    }, []);

    const clearForm = () => {
        initialRef.current = false;
        setForm(initialForm);
        setSelectedSR([]);
        setSelectedPackage(null);
        setSelectedPackageOption(null);
        setSelectedCategories([]);
        setDate("");
        setSelectedSlot(null);
        setSelectedSVSlot(null);
        setJobType(null);
        setServiceTypeOption(null);
        setAddress(null);
        setZipCode("");
        setSelectedEngine(null);
        setPreloadedSVSlot(null);
        setPreloadedSlot(null);
    }

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadMakes(selectedSC.id));
            dispatch(loadMileage(selectedSC.id));
            dispatch(loadEngineType(selectedSC.id));
            dispatch(loadBookingFlowConfig(selectedSC.id))
            dispatch(loadFirstScreenOptionsByQuery(selectedSC.id))
        }
    }, [selectedSC]);

    useEffect(() => {
        if (props.open) {
            if (payload) {
                setForm({
                    date: String(payload.dateInUtc),
                    slot: payload.timeSlot,
                    vehicleMake: payload.vehicle.make,
                    vehicleModel: payload.vehicle.model,
                    vehicleVin: payload.vehicle.vin,
                    vehicleMileage: payload.vehicle.mileage ? String(payload.vehicle.mileage) : "",
                    vehicleDriveType: payload.vehicle.driveType,
                    vehicleTransmission: payload.vehicle.transmission,
                    vehicleYear: String(payload.vehicle.year),
                    driverName: payload.driver.fullName,
                    driverEmail: payload.driver.email,
                    driverPhoneNumber: payload.driver.phoneNumber,
                    isNeedCall: payload.isNeedCall,
                    reminderTypes: payload.reminderTypes,
                    comment: payload.comment,
                    transportationOption: payload.transportationOption,
                    serviceRequestIds: payload.serviceRequests.map(sr => sr.id),
                    vehicleEngineTypeId: payload.vehicle.engineTypeId ?? null,
                });
                const serviceOption = firstScreenOptions.find(item => item.id === payload.serviceTypeOption?.id)
                if (payload.serviceTypeOption && serviceOption) {
                    setServiceTypeOption(serviceOption)
                }
                if (payload.vehicle?.engineTypeId) {
                    const engine = engineTypes.find(item => item.id === payload.vehicle.engineTypeId)
                    engine && setSelectedEngine(engine);
                }
                if (payload.address) setAddress(payload.address);
                if (payload.zipCode) setZipCode(payload.zipCode);
                payload.serviceRequests && setSelectedSR(payload.serviceRequests);
                payload.serviceCategories && setSelectedCategories(payload.serviceCategories);
                if (typeof payload.jobType !== 'undefined') {
                    const selectedJobType = jobTypeOptions.find(item => item.value === payload.jobType);
                    selectedJobType && setJobType(selectedJobType);
                }
                setDate(payload.dateInUtc);
                if (payload.serviceTypeOption?.type !== EServiceType.PikUpDropOff) {
                    const slot: IAppointmentSlot = {
                        date: payload.dateInUtc,
                        time: payload.timeSlot,
                        price: {
                            value: payload.transactionValue,
                            category: EDemandCategory.Average,
                            ancillaryPrice: payload.ancillaryPrice,
                        },
                        isShorterWaitTime: false
                    }
                    setSelectedSlot(slot);
                    setPreloadedSlot(slot);
                } else {
                }
            }
        } else {
            clearForm();
        }
    }, [props.open, payload, engineTypes, firstScreenOptions]);

    useEffect(() => {
        const selectedPackage = packages.find(item => item.options.find(option => option.id === payload?.maintenancePackageOption?.id))
        if (selectedPackage) {
            const option = selectedPackage.options.find(option => option.id === payload?.maintenancePackageOption?.id);
            option && setSelectedPackageOption(option);
            setSelectedPackage(selectedPackage);
        }
    }, [packages, payload])

    useEffect(() => {
        if (props.open && selectedSC) {
            setSrLoading(true);
            API.serviceRequests.list(selectedSC.id, "")
                .then(({data: {result}}) => {
                    setSrList(result);
                })
                .catch(() => {
                    setSrList([]);
                })
                .finally(() => {
                    setSrLoading(false);
                });
        }
    }, [selectedSC, props.open, selectedSR]);

    useEffect(() => {
        let waiting = true;
        if (selectedSC && props.open && serviceTypeOption?.type === EServiceType.PikUpDropOff) {
            setSlotsLoading(true);
            if (!selectedSR.length && !selectedCategories.length && !selectedPackageOption) {
                setServiceValetSlots([]);
                setSlotsLoading(false);
            } else {
                API.serviceValetSlots.list({
                    appointmentTimingType: EAppointmentTimingType.FirstAvailable,
                    fromDate: moment().toISOString(),
                    serviceRequestIds: selectedSR.map(sr => sr.id),
                    maintenancePackageOptionId: selectedPackageOption?.id ?? null,
                    serviceCategoryIds: selectedCategories.map(item => item.id),
                    serviceCenterId: selectedSC.id,
                    maintenancePackageOption: null,
                    jobType: jobType?.value ?? null,
                    appointmentHashKey: payload?.hashKey ?? undefined,
                    serviceTypeOptionId: serviceTypeOption?.id ?? null,
                    address: address?.label ?? null,
                    zipCode: zipCode?.length ? zipCode : undefined,
                    // todo selected recalls
                    recalls:[],
                    vehicle: {
                        make: form.vehicleMake,
                        model: form.vehicleModel,
                        year: +form.vehicleYear,
                        mileage: +form.vehicleMileage,
                        vin: form.vehicleVin,
                    }
                })
                    .then(({data: {items}}) => {
                        if (waiting) {
                            if (preloadedSVSlot) {
                                items = [preloadedSVSlot, ...items];
                                initialRef.current = true;
                            } else {
                                setSelectedSVSlot(null);
                            }
                            setServiceValetSlots(items);
                        }

                    })
                    .catch((e) => {
                        if (waiting) {
                            showError(e);
                            if (preloadedSVSlot) {
                                setServiceValetSlots([preloadedSVSlot]);
                                initialRef.current = true;
                            } else {
                                setServiceValetSlots([]);
                                setSelectedSVSlot(null);
                            }
                        }
                    })
                    .finally(() => {
                        setSlotsLoading(false);
                    });
            }
        }
    }, [form, selectedSC, filterDate, selectedSR, showError,
        preloadedSVSlot, selectedPackageOption, selectedCategories, jobType, serviceTypeOption, address, zipCode, props.open])

    useEffect(() => {
        let waiting = true;
        if (selectedSC && props.open  && filterDate && serviceTypeOption?.type !== EServiceType.PikUpDropOff) {
            setSlotsLoading(true);
            if (!selectedSR.length && !selectedCategories.length && !selectedPackageOption) {
                setSlots([]);
                setSlotsLoading(false);
            } else {
                API.timeSlots.list({
                    appointmentTimingType: EAppointmentTimingType.PreferredDate,
                    fromDate: moment(filterDate).toISOString(),
                    serviceRequestIds: selectedSR.map(sr => sr.id),
                    maintenancePackageOptionId: selectedPackageOption?.id ?? null,
                    serviceCategoryIds: selectedCategories.map(item => item.id),
                    maintenancePackageOption: null,
                    serviceCenterId: selectedSC.id,
                    jobType: jobType?.value ?? null,
                    appointmentHashKey: payload?.hashKey ?? undefined,
                    serviceTypeOptionId: serviceTypeOption?.id ?? null,
                    address: address?.label ?? null,
                    zipCode: zipCode?.length ? zipCode : undefined,
                    // todo selected recalls
                    recalls: [],
                    vehicle: {
                        make: form.vehicleMake,
                        model: form.vehicleModel,
                        year: +form.vehicleYear,
                        mileage: +form.vehicleMileage,
                        vin: form.vehicleVin,
                    }
                })
                    .then(({data: {items}}) => {
                        if (waiting) {
                            if (preloadedSlot) {
                                items = [preloadedSlot, ...items];
                                initialRef.current = true;
                            } else {
                                setSelectedSlot(null);
                            }
                            setSlots(items);
                        }

                    })
                    .catch((e) => {
                        if (waiting) {
                            showError(e);
                            if (preloadedSlot) {
                                setSlots([preloadedSlot]);
                                initialRef.current = true;
                            } else {
                                setSlots([]);
                                setSelectedSlot(null);
                            }
                        }
                    })
                    .finally(() => {
                        setSlotsLoading(false);
                    });
            }
        }
        return () => {
            waiting = false;
        };
    }, [props.open, form, selectedSC, filterDate, selectedSR, showError,
        preloadedSlot, selectedPackageOption, selectedCategories, jobType, serviceTypeOption, address, zipCode]);

    useEffect(() => {
        if (preloadedSlot && initialRef.current) {
            setPreloadedSlot(null);
        }
        if (preloadedSVSlot && initialRef.current) {
            setPreloadedSVSlot(null);
        }
    }, [filterDate, selectedSR, preloadedSlot, preloadedSVSlot]);

    useEffect(() => {
        if (form.vehicleVin?.length === VIN_LENGTH && oldVin.current !== form.vehicleVin) {
            const t = setTimeout(() => {
                oldVin.current = form.vehicleVin;
                setVinLoading(true);
                Api.call<IVehicleData>(
                    Api.endpoints.Vehicles.GetByVIN,
                    {params: {vin: form.vehicleVin}}
                )
                    .then(r => fillDataByVin(r.data))
                    .catch(e => showError(e))
                    .finally(() => setVinLoading(false))
            }, 1000);
            return () => clearTimeout(t);
        }
    }, [form.vehicleVin, showError, fillDataByVin]);

    const checkIsValid = (): boolean => {
        let isValid = true;
        if (!selectedSR.length && !selectedCategories.length && !selectedPackageOption) {
            isValid = false;
            showError("Please choose at least one Service Request or Service Category or Package Option")
        }
        if (form.driverPhoneNumber.length < 11) {
            isValid = false;
            showError(`"Phone Number" ${form.driverPhoneNumber.length ? 'is not valid' : 'must not be empty'}`)
            setErrors(prev => [...prev, "driverPhoneNumber"])
        }
        if (serviceTypeOption && serviceTypeOption?.type as EServiceType !== EServiceType.VisitCenter) {
            if (!address){
                isValid = false;
                setErrors(prev => ([...prev, "address"]))
                showError('"Address" must not be empty')
            }
            if (!zipCode){
                isValid = false;
                setErrors(prev => ([...prev, "zipCode"]))
                showError('"Zip Code" must not be empty')
            }
        }
        for (let field in form) {
            if (field === "date" && serviceTypeOption?.type !== EServiceType.PikUpDropOff &&  !filterDate) {
                isValid = false;
                setErrors(prev => [...prev, "date"])
            }
            if (field === "slot") {
                const slot = serviceTypeOption?.type === EServiceType.PikUpDropOff ? selectedSVSlot : selectedSlot;
                if (!slot) {
                    isValid = false;
                    setErrors(prev => [...prev, "slot"])
                    showError('"Appointment Slot" must not be empty')
                }
            }
            // @ts-ignore
            if (requiredFields.includes(field) && !form[field]) {
                isValid = false;
                setErrors(prev => {
                    if (prev.includes(field)) return prev;
                    return [...prev, field]
                })
            }
        }
        return isValid;
    }

    const handleSave = async () => {
        const isValid = checkIsValid();
        if (!selectedSC || !isValid) {
            return;
        }
        setLoading(true);
        try {
            const data: ICreateAppointment = {
                serviceRequestIds: selectedSR.map(sr => sr.id),
                slot: selectedSlot?.time || "00:00:00",
                date: serviceTypeOption?.type === EServiceType.PikUpDropOff && selectedSVSlot
                    ? selectedSVSlot?.date
                    : selectedSlot?.date,
                vehicle: {
                    make: form.vehicleMake,
                    model: form.vehicleModel,
                    year: form.vehicleYear,
                    driveType: form.vehicleDriveType,
                    engineTypeId: form.vehicleEngineTypeId,
                    mileage: form.vehicleMileage ? String(form.vehicleMileage) : "",
                    transmission: form.vehicleTransmission,
                    vin: form.vehicleVin,
                    dmsId: null,
                },
                serviceCenterId: selectedSC.id,
                isNeedCall: form.isNeedCall,
                gmt: moment().utcOffset(),
                // todo for service valet slots
                offerId: selectedSlot?.offer?.id || null,
                serviceCategoryIds: selectedCategories.map(item => item.id),
                maintenancePackageOptionId: selectedPackageOption?.id ?? null,
                driver: {
                    email: form.driverEmail,
                    phoneNumber: form.driverPhoneNumber,
                    fullName: form.driverName
                },
                comment: form.comment,
                reminderTypes: form.reminderTypes,
                appointmentTimingType: EAppointmentTimingType.PreferredDate,
                transportationType: form.transportationOption?.type,
                serviceTypeOptionId: serviceTypeOption?.id ?? null,
            }
            if (zipCode) data.zipCode = zipCode;
            if (address) data.address = typeof address === 'string' ? address : address.label;
            if (jobType) data.jobType = jobType.value;
            if (selectedEngine) data.vehicle.engineTypeId = selectedEngine.id;
            if (payload) {
                data.id = payload.id;
                // todo search term
                data.searchTerm = '';
                await API.appointment.update(data);
            } else {
                await API.appointment.create(data);
            }
            showMessage("Saved");
            onAction && onAction();
            props.onClose();
        } catch (e) {
            showError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (payload?.serviceTypeOption?.type === EServiceType.PikUpDropOff) {
            const slot = serviceValetSlots.find(item => moment(item.date).isSame(moment(payload?.dateInUtc), 'date'));
            if (slot) setSelectedSVSlot(slot);
        }
    }, [payload, serviceValetSlots])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({target: {name, value}}) => {
        setErrors(prev => prev.filter(item => item !== name));
        if (name === "driverPhoneNumber") {
            value = validatePhoneNumber(value);
        }
        setForm({...form, [name]: value});
    }

    const handleSRChange = (e: any, value: ISR[]) => {
        setSelectedSR(value);
        setSelectedSlot(null);
    }

    const handleCategoryChange = (e: ChangeEvent<{}>, value: ICategory[]) => {
        setSelectedCategories(value);
        setSelectedSlot(null);
    }

    const handlePackageChange = (e: ChangeEvent<{}>, value: IPackageAppointments | null) => {
        setSelectedPackage(value);
        setSelectedSlot(null);
    }

    const handlePackageOptionChange = (e: ChangeEvent<{}>, value: IPackageOptions | null) => {
        setSelectedPackageOption(value);
        setSelectedSlot(null);
    }

    const onVehicleDetailsChange = () => {
        setSelectedPackage(null);
        setSelectedPackageOption(null);
    }

    const onJobTypeChange = useCallback((e: ChangeEvent<{}>, value: TOption|null) => {
        setSelectedSlot(null);
        setJobType(value)
    }, [])

    const onServiceTypeChange = useCallback((e: ChangeEvent<{}>, value: IFirstScreenOption|null) => {
        setAddress("");
        setZipCode("");
        setSelectedSlot(null);
        setServiceTypeOption(value)
    }, [])

    const getFirstScreenOptionDisabled = (o: IFirstScreenOption) => {
        if (o.type as EServiceType === EServiceType.General) return true;
        if (o.type as EServiceType === EServiceType.MobileService && !isMobileServiceOn) return true;
        return o.type as EServiceType === EServiceType.PikUpDropOff && !isPickUpServiceOn;
    }

    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>{!payload ? "Add" : "Update"} Appointment</DialogTitle>
        <DialogContent>
            <Grid alignItems="center" container spacing={2}>

                {otherServiceTypesAvailable ? <Grid item xs={12}>
                    <Autocomplete
                        options={firstScreenOptions}
                        getOptionLabel={i => i.name}
                        getOptionDisabled={getFirstScreenOptionDisabled}
                        value={serviceTypeOption}
                        onChange={onServiceTypeChange}
                        renderInput={autocompleteRender({
                            label: "First Screen Option",
                            placeholder: 'Select First Screen Option'
                        })}
                    />
                </Grid> : null}

                {otherServiceTypesAvailable ? <Grid item xs={12}>
                    <Divider/>
                </Grid> : null}

                <DriverInfo
                    form={form}
                    handleChange={handleChange}
                    errors={errors}
                    serviceType={serviceTypeOption}
                    setAddress={setAddress}
                    address={address}
                    zipCode={zipCode}
                    otherServiceTypesAvailable={Boolean(otherServiceTypesAvailable)}
                    setZipCode={setZipCode}
                />

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <VehicleInfo
                    form={form}
                    setForm={setForm}
                    handleChange={handleChange}
                    setErrors={setErrors}
                    errors={errors}
                    isDataValid={isVehicleDataValid}
                    vinLoading={vinLoading}
                    onVehicleDetailsChange={onVehicleDetailsChange}
                    selectedEngine={selectedEngine}
                    setSelectedEngine={setSelectedEngine}
                />

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <ServicesSelection
                    selectedSR={selectedSR}
                    handleSRChange={handleSRChange}
                    selectedCategories={selectedCategories}
                    handleCategoryChange={handleCategoryChange}
                    handlePackageChange={handlePackageChange}
                    selectedPackage={selectedPackage}
                    handlePackageOptionChange={handlePackageOptionChange}
                    disabled={!isVehicleDataValid}
                    selectedPackageOption={selectedPackageOption}
                    srList={srList}
                    srLoading={srLoading}
                />

                <Grid item xs={12}>
                    <Autocomplete
                        options={jobTypeOptions}
                        getOptionLabel={i => i.name}
                        value={jobType}
                        onChange={onJobTypeChange}
                        renderInput={autocompleteRender({
                            label: "Job Type",
                            placeholder: 'Job Type'
                        })}
                    />
                </Grid>

                {serviceTypeOption?.type === EServiceType.PikUpDropOff
                    ? <SVSlotSelection
                        selectedSlot={selectedSVSlot}
                        setSelectedSlot={setSelectedSVSlot}
                        slots={serviceValetSlots}
                        slotsLoading={slotsLoading}
                        errors={errors}
                        setErrors={setErrors}
                    />
                    : <SlotSelection
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                    filterDate={filterDate}
                    setDate={setDate}
                    slots={slots}
                    slotsLoading={slotsLoading}
                    errors={errors}
                    setErrors={setErrors}
                />}

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                {serviceTypeOption?.type !== EServiceType.PikUpDropOff && serviceTypeOption?.type !== EServiceType.MobileService
                    ? <Transportation
                        payload={payload}
                        form={form}
                        setForm={setForm}
                        selectedSR={selectedSR}
                        slot={selectedSlot}
                        open={props.open}
                        serviceCategoryIds={selectedCategories.map(item => item.id)}
                        maintenancePackageOptionId={selectedPackageOption?.id || payload?.maintenancePackageOptionId || undefined}
                    />
                    : null}

                <Reminders setForm={setForm} form={form} />

                <Grid item xs={12}>
                    <TextField
                        label="Comment"
                        value={form.comment}
                        id="comment"
                        name="comment"
                        rows={3}
                        multiline
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

            </Grid>
        </DialogContent>

        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>

            <LoadingButton
                loading={loading}
                onClick={handleSave}
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};