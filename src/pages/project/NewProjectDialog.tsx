import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../localization/language';
import connection from '../../util/connection';
import keys from '../../util/keys';
import { loadUser } from '../../util/user';

export const NewProjectDialog = React.forwardRef(({ }, ref) => {
    const l = useLanguage().sidemenu;
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
        open: () => {
            setName("");
            setOpen(true);
        },
    }));

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const newProjectId = await connection().post("api/CreateNewProject", name);
            await loadUser(newProjectId);
            navigate(keys.routes.ProjectOverview(newProjectId));
            handleClose();
        } catch (error) {
            console.error("Failed to create project", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{l.createNewProject}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {l.createNewProjectDescription}
                </DialogContentText>
                <form onSubmit={handleSubmit} id="subscription-form">
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label={l.projectName}
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name} onChange={e => setName(e.target.value)}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    {l.cancel}
                </Button>
                <Button type="submit" form="subscription-form" endIcon={isSubmitting && <CircularProgress color='inherit' size={20} />}>
                    {l.create}
                </Button>
            </DialogActions>
        </Dialog>
    );
});