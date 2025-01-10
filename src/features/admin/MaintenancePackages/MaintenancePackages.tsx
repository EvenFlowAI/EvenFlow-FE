import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Switch, TablePagination } from "@mui/material";
import { ContentTitle } from "../../../components/wrappers/ContentTitle/ContentTitle";
import { RootState } from "../../../store/rootReducer";
import { PackageAccordion } from "./PackageAccordion/PackageAccordion";
import { IPackageByQuery } from "../../../api/types";
import { loadPackages } from "../../../store/reducers/packages/actions";
import {
  updateAvailablePackageOptions,
  updatePackagePriceDetails,
} from "../../../store/reducers/serviceCenters/actions";
import AddPackageModal from "./AddPackageModal/AddPackageModal";
import Disclaimer from "./Disclaimer/Disclaimer";
import { Loading } from "../../../components/wrappers/Loading/Loading";
import { autocompleteRender } from "../../../utils/autocompleteRenders";
import { Autocomplete } from "@mui/material";
import { useMaintenancePackagesStyles } from "./styles";
import { MaintenanceOptionTypes } from "./constants";
import { TExpandedState, TOption } from "./types";
import { useAutocompleteStyles } from "../../../hooks/styling/useAutocompleteStyles";
import { useModal } from "../../../hooks/useModal/useModal";
import { useConfirm } from "../../../hooks/useConfirm/useConfirm";
import { useException } from "../../../hooks/useException/useException";
import { useSCs } from "../../../hooks/useSCs/useSCs";
import { usePagination } from "../../../hooks/usePaginations/usePaginations";
import { changePageData } from "../../../store/reducers/packages/actions";

export const MaintenancePackages = () => {
  const {
    packages: allPackages,
    packagesPaging,
    packagesPageData,
    allPackagesLoading,
  } = useSelector((state: RootState) => state.packages);
  const { loading, packagesOptionsLoading } = useSelector(
    (state: RootState) => state.serviceCenters,
  );
  const [packages, setPackages] = useState<IPackageByQuery[]>([]);
  const [expanded, setExpanded] = useState<TExpandedState>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDisclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const [presentedOptions, setPresentedOptions] = useState<TOption[]>([]);
  const { classes } = useMaintenancePackagesStyles();
  const { classes: autocompleteClasses } = useAutocompleteStyles();
  const dispatch = useDispatch();
  const showError = useException();
  const { onOpen, onClose, isOpen } = useModal();
  const {
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
    isOpen: isOpenEdit,
  } = useModal();
  const { askConfirm } = useConfirm();
  const { selectedSC } = useSCs();
  const { changeRowsPerPage, changePage } = usePagination(
    (s: RootState) => s.packages.packagesPageData,
    changePageData,
  );

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadPackages(selectedSC.id));
      const options = MaintenanceOptionTypes.filter((item) =>
        selectedSC.maintenancePackageOptionTypes?.includes(item.value),
      );
      setPresentedOptions(options);
    }
  }, [selectedSC, packagesPageData]);

  useEffect(() => {
    if (allPackages) setPackages(allPackages);
  }, [allPackages]);

  const handleAddPackage = () => {
    onOpen();
  };

  const onAccordionChange = (id: number) => {
    if (id === expanded.id) {
      setExpanded((expanded) => ({ id, isOpen: !expanded.isOpen }));
    } else {
      setExpanded(() => ({ id, isOpen: true }));
    }
  };

  const onEditModalClose = () => {
    setIsEditing(false);
    onCloseEdit();
  };

  const handleAddDisclaimer = () => setDisclaimerOpen(!isDisclaimerOpen);

  const handleSwitch = (e: any, value: boolean) => {
    if (selectedSC) {
      dispatch(updatePackagePriceDetails(selectedSC.id, value, showError));
    }
  };

  const askRemove = useCallback(
    (value: TOption[], packagesNeededConfig: IPackageByQuery[]) => {
      if (selectedSC) {
        const newOption = value.find(
          (item) => !presentedOptions.find((el) => +el.value === +item.value),
        );
        const packagesString = packagesNeededConfig.map((pack, index) =>
          index === packagesNeededConfig.length - 1
            ? `"${pack.name}"`
            : `"${pack.name}", `,
        );
        askConfirm({
          isRemove: false,
          title: `Please configure "${newOption?.name ?? "this"}" option for next Maintenance Packages: ${packagesString} in order for it to display`,
          onConfirm: () =>
            dispatch(
              updateAvailablePackageOptions(
                selectedSC.id,
                value.map((item) => item.value),
                showError,
              ),
            ),
        });
      }
    },
    [selectedSC, askConfirm, showError, presentedOptions],
  );

  const onPresentedOptionsChange = useCallback(
    (e: ChangeEvent<{}>, value: TOption[]) => {
      if (selectedSC) {
        if (value.length > presentedOptions.length) {
          const newOption = value.find(
            (item) => !presentedOptions.find((el) => +el.value === +item.value),
          );
          let packagesNeededConfig: IPackageByQuery[] = [];
          if (newOption) {
            packagesNeededConfig = allPackages.filter((pack) =>
              pack.serviceRequestsAssigned.find(
                (item) =>
                  +item.type === +newOption.value &&
                  item.serviceRequestId === 0,
              ),
            );
          }
          if (packagesNeededConfig.length) {
            askRemove(value, packagesNeededConfig);
          } else {
            dispatch(
              updateAvailablePackageOptions(
                selectedSC.id,
                value.map((item) => item.value),
                showError,
              ),
            );
          }
        } else {
          dispatch(
            updateAvailablePackageOptions(
              selectedSC.id,
              value.map((item) => item.value),
              showError,
            ),
          );
        }
      }
    },
    [selectedSC, presentedOptions, askRemove, showError, allPackages],
  );

  const handleChangePage = async (
    e: React.MouseEvent<Element, MouseEvent> | null,
    pageNumber: number,
  ) => {
    await changePage(e, pageNumber);
  };
  const handleChangeRows = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await changeRowsPerPage(e);
  };

  return (
    <>
      <AddPackageModal
        onClose={isEditing ? onEditModalClose : onClose}
        open={isOpen || isOpenEdit}
        isEditing={isEditing}
      />
      <div className={classes.topLineWrapper}>
        <div className={classes.toggleWrapper}>
          {loading ? (
            <Loading />
          ) : (
            <React.Fragment>
              <p className={classes.showPriceLabel}>Show Price Details</p>
              <Switch
                onChange={handleSwitch}
                checked={selectedSC?.isShowPriceDetails}
                color="primary"
              />
            </React.Fragment>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            style={{ marginLeft: 16 }}
            color="primary"
            variant="contained"
            onClick={handleAddDisclaimer}
          >
            {isDisclaimerOpen ? "Close" : "Open"} Disclaimer
          </Button>
          <Button
            style={{ marginLeft: 16 }}
            color="primary"
            variant="contained"
            onClick={handleAddPackage}
          >
            Add Package
          </Button>
        </div>
      </div>
      <div className={classes.selectWrapper}>
        <div style={{ display: "flex", alignItems: "flex-end", width: "50%" }}>
          {packagesOptionsLoading ? (
            <Loading />
          ) : (
            <React.Fragment>
              <Autocomplete
                fullWidth
                multiple
                disableClearable
                classes={autocompleteClasses}
                options={MaintenanceOptionTypes}
                disableCloseOnSelect
                getOptionLabel={(o) => o.name}
                isOptionEqualToValue={(o, v) => o.value === v.value}
                value={presentedOptions}
                onChange={onPresentedOptionsChange}
                renderInput={autocompleteRender({
                  label: "Available Package Options",
                  placeholder: "Select Available Package Options",
                })}
              />
            </React.Fragment>
          )}
        </div>
      </div>
      {isDisclaimerOpen ? (
        <Disclaimer setDisclaimerOpen={setDisclaimerOpen} />
      ) : null}
      <div className={classes.titleWrapper}>
        <ContentTitle title="Maintenance Package Pricing" />
      </div>
      <>
        {allPackagesLoading ? (
          <Loading />
        ) : (
          packages.map((item: IPackageByQuery, index) => {
            return (
              <PackageAccordion
                setIsEditing={setIsEditing}
                onOpenEdit={onOpenEdit}
                key={item.id}
                title={item.name}
                defaultExpanded={index === 0}
                id={item.id}
                expanded={expanded.id === item.id && expanded.isOpen}
                onExpandIconClick={() => onAccordionChange(item.id)}
              />
            );
          })
        )}
      </>

      {packagesPaging?.numberOfRecords > 5 ? (
        <TablePagination
          className={classes.pagination}
          component="div"
          count={packagesPaging.numberOfRecords}
          page={packagesPageData.pageIndex}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 20, 50]}
          onRowsPerPageChange={handleChangeRows}
          rowsPerPage={packagesPageData.pageSize}
        />
      ) : null}
    </>
  );
};
