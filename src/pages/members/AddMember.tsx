import React, { useRef, useState } from "react";
import { Box, Button, CircularProgress, Input, InputAdornment, InputLabel } from "@mui/material";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import connection from "../../util/connection";
import { Toast } from "../../components/Toast";
import { useParams } from "react-router-dom";
import Hub, { HubType } from "../../util/Hub";

export default function AddMember() {
    const toast = useRef(undefined);

    const pid = useParams().pid;

    const [open, setOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");


    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await connection().post("api/AddMember", {
                ProjectId: pid,
                FullName: name,
                EMail: email,
                IsOwner: role == "owner",
                IsEditor: role == "editor",
            });
            toast.current.show("success", "Successfully added new member to the project");
            setOpen(false);
            setIsSubmitting(false);
            setName("");
            setEmail("");
            setRole("viewer");
            Hub.dispatch(HubType.MemberAdded);
        } catch (error) {
            toast.current.show("error", error.data);
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <Button variant="contained" onClick={() => setOpen(true)}>
                Add New Member
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogContent sx={{ flexDirection: "column", minWidth: 400 }}>
                    <FormControl fullWidth variant="standard">
                        <InputLabel htmlFor="txtName">
                            Name
                        </InputLabel>
                        <Input
                            id="txtName"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            }
                            autoComplete="name"
                        />
                    </FormControl>

                    <Box sx={{ py: 2 }} />

                    <FormControl fullWidth variant="standard">
                        <InputLabel htmlFor="txtEmail">
                            E-Mail Address
                        </InputLabel>
                        <Input
                            id="txtEmail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <AlternateEmailIcon />
                                </InputAdornment>
                            }
                            autoComplete="email"
                        />
                    </FormControl>

                    <Box sx={{ py: 2 }} />

                    <FormControl fullWidth>
                        <FormLabel id="radio-buttons-group-label">Role</FormLabel>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        >
                            <FormControlLabel value="owner" control={<Radio />} label="Owner" />
                            <FormControlLabel value="editor" control={<Radio />} label="Editor" />
                            <FormControlLabel value="viewer" control={<Radio />} label="Viewer" />
                        </RadioGroup>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} endIcon={isSubmitting && <CircularProgress color="inherit" size={20} />}>
                        {isSubmitting ? "Adding Member" : "Add Member"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
