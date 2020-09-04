import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Divider, Grid} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {AvatarUpload} from "../../UI/AvatarUpload";

const useStyles = makeStyles({
    editButtonContainer: {
        textAlign: "right"
    },
    title: {
        marginLeft: 10,
        display: "block"
    },
    avatarContainer: {
        display: "flex",
        alignItems: "center"
    },
    divider: {
        margin: "0 20px"
    }
});

export const DealershipGroupProfile = () => {
    const [nameEdit, setNameEdit] = useState<boolean>(false);

    const handleChange = () => {

    }

    const classes = useStyles();
    return <>
        <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={5}>
                <div className={classes.avatarContainer}>
                    <AvatarUpload />
                    <span className={classes.title}>Name</span>
                </div>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    label="Dealership Group Name"
                    name="name"
                    id="name"
                    disabled={!nameEdit}
                    value="string"
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={3} className={classes.editButtonContainer}>
                <Button
                    variant="contained"
                    color="primary"
                    value={"test"}
                    id="dealershipName"
                    name="name"
                    onClick={() => setNameEdit(true)}>
                    Edit
                </Button>
            </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid container spacing={2}>

        </Grid>
    </>;
}