import React, { useEffect, useState } from "react";
import {
  BaseModal,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "../../../../components/modals/BaseModal/BaseModal";
import { DialogProps } from "../../../../components/modals/BaseModal/types";
import { Divider, Button } from "@mui/material";
import {
  IContactPersonForm,
  IDealershipForm,
  IDealershipGroupForm,
} from "../../../../store/reducers/dealershipGroups/types";
import {
  createDealership,
  updateDealershipAvatar,
} from "../../../../store/reducers/dealershipGroups/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/rootReducer";
import { validatePhoneNumber } from "../../../../utils/utils";
import { FormElements } from "./FormElements/FormElements";
import {
  initialCPState,
  initialStateDealershipState,
  requiredFields,
  elementsGroup1,
  elementsGroup2,
} from "./constants";
import { DialogContentTitle } from "../DialogContentTitle/DialogContentTitle";
import { AvatarWrapper } from "../../../../components/wrappers/AvatarWrapper/AvatarWrapper";
import { LoadingButton } from "../../../../components/buttons/LoadingButton/LoadingButton";

import { useMessage } from "../../../../hooks/useMessage/useMessage";
import { useValidation } from "../../../../hooks/useValidation/useValidation";
import { useException } from "../../../../hooks/useException/useException";

type TError = {
  field: string;
  message: string;
};

export const CreateDealershipGroupModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps>>
> = (props) => {
  const [dealership, setDealership] = useState<IDealershipForm>({
    ...initialStateDealershipState,
  });
  const [contactPerson, setContactPerson] = useState<IContactPersonForm>({
    ...initialCPState,
  });
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<File | undefined>();

  const dispatch = useDispatch();
  const saving = useSelector(
    (state: RootState) => state.dealershipGroups.saving,
  );
  const showMessage = useMessage();
  const showError = useException();
  const validate = useValidation(requiredFields, {
    ...dealership,
    ...contactPerson,
  });

  useEffect(() => {
    setDealership({ ...initialStateDealershipState });
    setContactPerson({ ...initialCPState });
    setErrorFields([]);
  }, [props.open]);

  const handleChange =
    (v: "dealership" | "cp") =>
    ({ target: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
      setErrorFields([]);
      if (name === "phoneNumber") {
        value = validatePhoneNumber(value);
      }
      if (v === "dealership") {
        setDealership({ ...dealership, [name]: value });
      } else {
        setContactPerson({ ...contactPerson, [name]: value });
      }
    };

  const onCreate = () => {
    setErrorFields([]);
    showMessage("Dealership created");
    props.onClose();
  };

  const onSuccess = (id: number) => {
    if (avatar) {
      dispatch(updateDealershipAvatar(avatar, id, showError, onCreate));
    } else {
      onCreate();
    }
  };

  const onError = (err: any) => {
    if (err.response?.data?.errors?.length) {
      const list: string[] = [];
      err.response?.data?.errors.forEach((obj: TError) => {
        list.push(obj.field.split(".")[1].toLowerCase());
      });
      setErrorFields(list);
    }
    showError(err);
  };

  const handleCreate = () => {
    const errors = validate();
    if (errors.length) {
      setErrorFields(errors.map((el) => el.field));
      return;
    }
    const data: IDealershipGroupForm = { contactPerson, dealership };
    dispatch(createDealership(data, onError, onSuccess));
  };

  const onClose = () => {
    props.onClose();
  };

  return (
    <BaseModal {...props} onClose={onClose}>
      <DialogTitle onClose={onClose}>Add Dealership Group</DialogTitle>
      <DialogContent>
        <AvatarWrapper onChange={(f) => setAvatar(f)} />

        <DialogContentTitle title="Dealership group info" />
        <FormElements<IDealershipForm>
          elements={elementsGroup1}
          errors={errorFields}
          data={dealership}
          onChange={handleChange("dealership")}
        />

        <Divider />

        <DialogContentTitle title="Contact personal info" />
        <FormElements<IContactPersonForm>
          elements={elementsGroup2}
          data={contactPerson}
          errors={errorFields}
          onChange={handleChange("cp")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          onClick={handleCreate}
          loading={saving}
          color="primary"
          variant="contained"
        >
          Create
        </LoadingButton>
      </DialogActions>
    </BaseModal>
  );
};
