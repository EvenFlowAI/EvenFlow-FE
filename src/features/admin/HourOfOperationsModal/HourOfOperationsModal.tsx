import React, { useEffect, useState } from "react";
import {
  DialogProps,
  TViewMode,
} from "../../../components/modals/BaseModal/types";
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../../../components/modals/BaseModal/BaseModal";
import { Button } from "@mui/material";
import { IHOODataForm } from "../../../store/reducers/serviceCenters/types";
import { timeSpanString } from "../../../utils/constants";
import { THOOForm } from "./types";
import { initialForm } from "./constants";
import { HourOfOperationForm } from "./HourOfOperationForm/HourOfOperationForm";
import { LoadingButton } from "../../../components/buttons/LoadingButton/LoadingButton";

import { useMessage } from "../../../hooks/useMessage/useMessage";
import { useException } from "../../../hooks/useException/useException";
import { useSCs } from "../../../hooks/useSCs/useSCs";
import { Api } from "../../../api/ApiEndpoints/ApiEndpoints";
import dayjs from "dayjs";
import { TParsableDate } from "../../../types/types";

export const HourOfOperationsModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps & TViewMode>>
> = ({ viewMode, ...props }) => {
  const { selectedSC } = useSCs();
  const [form, setForm] = useState<THOOForm[]>(initialForm);
  const [saving, setSaving] = useState<boolean>(false);
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const showError = useException();
  const showMessage = useMessage();
  useEffect(() => {
    if (selectedSC) {
      Api.call<IHOODataForm[]>(Api.endpoints.ServiceCenters.GetHOO, {
        urlParams: { id: selectedSC.id },
      }).then((r) => {
        setForm(
          initialForm.map((ie) => {
            const element = r.data.find((e) => e.dayOfWeek === ie.dayOfWeek);
            if (element) {
              return {
                dayOfWeek: element.dayOfWeek,
                checked: true,
                from: dayjs(element.from, timeSpanString),
                to: dayjs(element.to, timeSpanString),
              };
            }
            return ie;
          }),
        );
      });
    }
  }, [selectedSC, setForm, props.open]);

  const handleChange =
    (day: number, t: "from" | "to") => (date: TParsableDate) => {
      setFormIsChecked(false);
      const idx = form.findIndex((v) => v.dayOfWeek === day);
      form[idx] = { ...form[idx], [t]: date };
      setForm([...form]);
    };
  const handleApplyToAll = (): void => {
    setFormIsChecked(false);
    const el = form[0];
    setForm(form.map((_, idx) => ({ ...el, dayOfWeek: idx })));
  };
  const handleCheck =
    (day: number) =>
    (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setFormIsChecked(false);
      const idx = form.findIndex((v) => v.dayOfWeek === day);
      form[idx] = { ...form[idx], checked };
      setForm([...form]);
    };

  const isValid = () => {
    const emptyFields = form.find(
      (item) => item.checked && (!item.from || !item.to),
    );
    if (emptyFields) showError('"Hours of Operation" must not be empty');
    return !emptyFields;
  };
  const handleUpdate = async () => {
    setFormIsChecked(true);
    if (isValid()) {
      if (!selectedSC) {
        showError("Service center is not selected");
      } else {
        setSaving(true);
        const fd: IHOODataForm[] = form
          .filter((e) => e.checked)
          .map((e) => ({
            ...e,
            from: dayjs(e.from).format(timeSpanString),
            to: dayjs(e.to).format(timeSpanString),
          })) as IHOODataForm[];
        try {
          await Api.call(Api.endpoints.ServiceCenters.SetHOO, {
            data: { hoursOfOperations: fd },
            urlParams: { id: selectedSC.id },
          });
          setSaving(false);
          showMessage("Hours of Operation updated");
          showMessage(
            "The Unplanned Demand Settings for edited days were reset",
            "warning",
          );
          props.onClose();
        } catch (e) {
          showError(e);
          setSaving(false);
        }
      }
    }
  };

  const onClose = () => {
    props.onClose();
    setFormIsChecked(false);
  };

  return (
    <BaseModal {...props} maxWidth="sm" onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {viewMode ? "View" : "Edit"} Hours of Operation
      </DialogTitle>
      <DialogContent>
        <HourOfOperationForm
          formIsChecked={formIsChecked}
          viewMode={viewMode}
          onApply={handleApplyToAll}
          onCheck={handleCheck}
          form={form}
          isLoading={saving}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          Close
        </Button>
        {!viewMode ? (
          <LoadingButton
            variant="contained"
            color="primary"
            loading={saving}
            onClick={handleUpdate}
          >
            Save
          </LoadingButton>
        ) : null}
      </DialogActions>
    </BaseModal>
  );
};
