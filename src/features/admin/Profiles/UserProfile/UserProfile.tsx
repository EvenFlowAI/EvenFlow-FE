import React, {useEffect, useState} from "react";
import {Button, Divider, Grid, useMediaQuery, useTheme} from "@material-ui/core";
import {AvatarUpload} from "../../../../components/formControls/AvatarUpload/AvatarUpload";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {useDispatch} from "react-redux";
import {saveEmployeeAvatar, updateUser} from "../../../../store/reducers/users/actions";
import {validatePhoneNumber} from "../../../../utils/utils";
import {useStyles} from "./styles";
import {TForm, TPasswordForm} from "./types";
import {LoadingButton} from "../../../../components/buttons/LoadingButton/LoadingButton";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {useException} from "../../../../hooks/useException/useException";
import {useCurrentUser} from "../../../../hooks/useCurrentUser/useCurrentUser";
import {Api} from "../../../../api/ApiEndpoints/ApiEndpoints";
import {blankProfile, initialPasswordForm} from "./constants";

export const UserProfile = () => {
    const [saving, setSaving] = useState<boolean>(false);
    const [isEditPassword, setEditPassword] = useState<boolean>(false);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>(blankProfile);
    const [passwordForm, setPasswordForm] = useState<TPasswordForm>(initialPasswordForm);
    const currentUser = useCurrentUser();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();
    const classes = useStyles();
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (currentUser) {
            setForm({
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                phoneNumber: currentUser.phoneNumber
            })
        }
    }, [currentUser]);

    const handleCancel = () => {
        setEdit(false);
        setForm({...currentUser} as TForm || blankProfile);
    }

    const cancelPasswordEdit = () => {
        setPasswordForm(initialPasswordForm);
        setEditPassword(false);
    }

    const handleChange = ({target: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
        if (name === "phoneNumber") {
            value = validatePhoneNumber(value);
        }
        setForm({...form, [name]: value});
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({...passwordForm, [e.target.name]: e.target.value});
    }

    const handleChangeAvatar = async (f: File) => {
        if (!currentUser) {
            showError("Profile is not loaded");
        } else {
            try {
                await dispatch(saveEmployeeAvatar(f, currentUser.id));
                showMessage("Avatar updated");
            } catch (e) {
                showError(e);
            }
        }
    }

    const handleSave = async () => {
        if (currentUser) {
            setSaving(true);
            try {
                await dispatch(updateUser({
                    ...currentUser,
                    ...form
                }, currentUser.id));
                showMessage("Profile updated");
                setEdit(false);
                setSaving(false);
            } catch (e) {
                showError(e);
                setSaving(false);
            }
        } else {
            showError("Profile is not loaded");
        }
    }

    const handlePasswordSave = async () => {
        if (!passwordForm.oldPassword) {
            showError("Please type old password");
        } else if (!passwordForm.newPassword) {
            showError("Please type new password");
        } else if (passwordForm.newPassword !== passwordForm.repeatPassword) {
            showError("Passwords do not match");
        } else {
            setSaving(true);
            try {
                await Api.call(Api.endpoints.Accounts.Change, {data: passwordForm});
                setSaving(false);
                setPasswordForm(initialPasswordForm);
                setEditPassword(false);
                showMessage("Password saved")
            } catch (e) {
                showError(e);
                setSaving(false);
            }
        }
    }

    if (!currentUser) {
        return null;
    }

    return <div className={classes.container}>
        {currentUser?.role === "Owner"
            ? <React.Fragment>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={12} md={3}>
                    <div className={classes.avatarContainer}>
                        <AvatarUpload onChange={handleChangeAvatar} dataUrl={currentUser.avatarPath} />
                        <span className={classes.title}>{currentUser.fullName}</span>
                    </div>
                </Grid>
                <Grid item xs={1} hidden={isSM} />
                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        label="Role"
                        name="role"
                        id="role"
                        disabled
                        value={currentUser.role}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        id="email"
                        disabled
                        value={currentUser.email}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={3} className={classes.editButtonContainer}>
                    {!isEdit ? <Button
                        className={classes.centerButton}
                        variant="contained"
                        color="primary"
                        onClick={() => setEdit(true)}>
                        Edit
                    </Button> : <>
                        <Button
                            style={{marginRight: 10}}
                            className={classes.centerButton}
                            onClick={handleCancel}>
                            Cancel
                        </Button>
                        <LoadingButton
                            fullWidth={false}
                            loading={saving}
                            className={classes.centerButton}
                            color="primary"
                            onClick={handleSave}
                            variant="contained">
                            Save
                        </LoadingButton>
                    </>}
                </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="First name"
                        name="firstName"
                        id="firstName"
                        disabled={!isEdit}
                        value={form.firstName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={1} hidden={isSM} />
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Last name"
                        name="lastName"
                        id="lastName"
                        disabled={!isEdit}
                        value={form.lastName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Phone number"
                        name="phoneNumber"
                        id="phoneNumber"
                        disabled={!isEdit}
                        value={form.phoneNumber}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
            <Divider className={classes.divider} />
        </React.Fragment>
            : null}

        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4}>
                {!isEditPassword
                    ? <TextField
                        disabled
                        value="12345678"
                        name="oldPasswordB"
                        type="password"
                        id="oldPasswordB"
                        label="Current Password"
                        fullWidth
                    />
                    : <TextField
                        label="Current Password"
                        fullWidth
                        value={passwordForm.oldPassword}
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        onChange={handlePasswordChange}
                    />
                }
            </Grid>
            <Grid item xs={1} hidden={isSM} />
            <Grid item xs={12} sm={12} md={7} className={classes.editButtonContainer}>
                {!isEditPassword ? <Button
                    color="primary"
                    className={classes.centerButton}
                    onClick={(() => setEditPassword(true))}
                    variant="contained">
                    Change Password
                </Button> : <>
                    <Button
                        style={{marginRight: 10}}
                        className={classes.centerButton}
                        onClick={cancelPasswordEdit}>
                        Cancel
                    </Button>
                    <LoadingButton
                        fullWidth={false}
                        className={classes.centerButton}
                        color="primary"
                        variant="contained"
                        onClick={handlePasswordSave}
                        loading={saving}>
                        Save
                    </LoadingButton>
                </>}
            </Grid>
            {isEditPassword ? <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="New Password"
                    fullWidth
                    value={passwordForm.newPassword}
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    onChange={handlePasswordChange}
                />
            </Grid> : null}
            <Grid item xs={1} hidden={isSM} />
            {isEditPassword ? <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Repeat Password"
                    fullWidth
                    value={passwordForm.repeatPassword}
                    type="password"
                    id="repeatPassword"
                    name="repeatPassword"
                    onChange={handlePasswordChange}
                />
            </Grid> : null}
        </Grid>
    </div>
}