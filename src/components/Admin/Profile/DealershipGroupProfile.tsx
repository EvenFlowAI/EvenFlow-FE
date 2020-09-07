import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Divider, Grid} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {AvatarUpload} from "../../UI/AvatarUpload";
import {useDealershipProfile, useException, useMessage} from "../../../utils/hooks";
import {LoadingButton} from "../../UI/Button";
import {updateDealership} from "../../../store/reducers/dealershipGroups/actions";
import {useDispatch} from "react-redux";

const useStyles = makeStyles({
    container: {
        "& input": {
            backgroundColor: "#fff"
        }
    },
    editButtonContainer: {
        textAlign: "right",
        marginTop: 15,
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
    avatarContainer: {
        display: "flex",
        alignItems: "center"
    },
    divider: {
        margin: "30px 0"
    }
});
type TForm = {
    name: string;
    phoneNumber: string;
    fullAddress: string;
}
export const DealershipGroupProfile = () => {
    const [nameEdit, setNameEdit] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<File|null>(null);
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        name: "", mainAddress: "", phoneNumber: ""
    });
    const profile = useDealershipProfile();
    const showError = useException();
    const showMessage = useMessage();

    useEffect(() => {
        if (profile) {
            setForm({
                phoneNumber: profile.phoneNumber,
                name: profile.name,
                mainAddress: profile.mainAddress
            });
        }
    }, [profile]);

    const handleCancel = () => {
        setForm({
            name: profile?.name || '',
            phoneNumber: profile?.phoneNumber || '',
            mainAddress: profile?.mainAddress || ''
        });
        setNameEdit(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }
    const handleChangeAvatar = (f: File) => {
        setAvatar(f);
    }
    const handleSave = async () => {
        if (profile) {
            setSaving(true)
            try {
                await dispatch(updateDealership(form, profile.id));
                setSaving(false);
                setNameEdit(false);
                showMessage("Profile updated.")
            } catch (e) {
                showError(e);
                setSaving(false);
            }
        } else {
            showError("Profile is not loaded");
        }
    }

    const classes = useStyles();

    if (!profile) {
        return null;
    }
    return <div className={classes.container}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
                <div className={classes.avatarContainer}>
                    <AvatarUpload onChange={handleChangeAvatar} dataUrl={profile.avatarPath} />
                    <span className={classes.title}>{profile.name}</span>
                </div>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    label="Dealership Group Name"
                    name="name"
                    id="name"
                    disabled={!nameEdit}
                    value={form.name}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={3} className={classes.editButtonContainer}>
                {!nameEdit ? <Button
                    className={classes.centerButton}
                    variant="contained"
                    color="primary"
                    onClick={() => setNameEdit(true)}>
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
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    label="Phone number"
                    name="phoneNumber"
                    id="phoneNumber"
                    disabled={!nameEdit}
                    value={form.phoneNumber}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    label="Main Address"
                    name="mainAddress"
                    id="mainAddress"
                    disabled={!nameEdit}
                    value={form.mainAddress}
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
    </div>;
}