import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Divider, Grid, useMediaQuery, useTheme} from "@material-ui/core";
import {AvatarUpload} from "../../UI/AvatarUpload";
import {TextField} from "../../UI/TextField";
import {LoadingButton} from "../../UI/Button";
import {useCurrentUser, useException, useMessage} from "../../../utils/hooks";
import {useDispatch} from "react-redux";
import {saveEmployeeAvatar, updateUser} from "../../../store/reducers/users/actions";
import {Api} from "../../../config/requests";

const useStyles = makeStyles(theme => ({
    container: {
        "& input": {
            backgroundColor: "#fff"
        }
    },
    avatarContainer: {
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
            marginBottom: theme.spacing(1)
        }
    },
    divider: {
        margin: "30px 0"
    },
    editButtonContainer: {
        textAlign: "right",
        marginTop: 15,
        [theme.breakpoints.down("sm")]: {
            textAlign: "center",
            order: 1
        }
    },
    title: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        display: "block"
    },
    centerButton: {
        minWidth: 80
    },
}));
type TForm = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
};
const blankProfile: TForm = {
    firstName: "",
    lastName: "",
    phoneNumber: ""
}
type TPasswordForm = {
    oldPassword: string;
    newPassword: string;
    repeatPassword: string;
}
const initialPasswordForm: TPasswordForm = {
    oldPassword: "",
    newPassword: "",
    repeatPassword: ""
}
export const UserProfile = () => {
    const [saving, setSaving] = useState<boolean>(false);
    const [isEditPassword, setEditPassword] = useState<boolean>(false);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [form, setForm] = useState<TForm>(blankProfile);
    const [passwordForm, setPasswordForm] = useState<TPasswordForm>(initialPasswordForm);
    const profile = useCurrentUser();
    const dispatch = useDispatch();
    const showError = useException();
    const showMessage = useMessage();

    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (profile) {
            setForm({
                firstName: profile.firstName,
                lastName: profile.lastName,
                phoneNumber: profile.phoneNumber
            })
        }
    }, [profile]);

    const handleCancel = () => {
        setEdit(false);
        setForm({...profile} as TForm || blankProfile);
    }
    const cancelPasswordEdit = () => {
        setPasswordForm(initialPasswordForm);
        setEditPassword(false);
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({...passwordForm, [e.target.name]: e.target.value});
    }

    const handleChangeAvatar = async (f: File) => {
        if (!profile) {
            showError("Profile is not loaded");
        } else {
            try {
                await dispatch(saveEmployeeAvatar(f, profile.id));
                showMessage("Avatar updated");
            } catch (e) {
                showError(e);
            }
        }
    }

    const handleSave = async () => {
        if (profile) {
            setSaving(true);
            try {
                await dispatch(updateUser({
                    ...profile,
                    ...form
                }, profile.id));
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
        } else if (!(passwordForm.newPassword === passwordForm.repeatPassword)) {
            showError("Passwords do not match");
        } else {
            setSaving(true);
            try {
                await Api.call(Api.endpoints.Accounts.Change, {data: passwordForm});
                setSaving(false);
                setPasswordForm(initialPasswordForm);
                setEditPassword(false);
                showMessage("Password saved.")
            } catch (e) {
                showError(e);
                setSaving(false);
            }
        }
    }

    const classes = useStyles();
    if (!profile) {
        return null;
    }

    return <div className={classes.container}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12} md={3}>
                <div className={classes.avatarContainer}>
                    <AvatarUpload onChange={handleChangeAvatar} dataUrl={profile.avatarPath} />
                    <span className={classes.title}>{profile.fullName}</span>
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
                    value={profile.role}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    id="email"
                    disabled
                    value={profile.email}
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