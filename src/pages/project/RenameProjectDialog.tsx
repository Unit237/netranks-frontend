import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../localization/language';
import connection from '../../util/connection';
import keys from '../../util/keys';
import { loadUser, useActiveProject } from '../../util/user';

export const RenameProjectDialog = React.forwardRef(({ }, ref) => {
    const l = useLanguage().sidemenu;
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const activeProject = useActiveProject();

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
            await connection().patch(activeProject.Id, "api/RenameProject", name);
            await loadUser(activeProject.Id);
            navigate(keys.routes.ProjectOverview(activeProject.Id));
            handleClose();
        } catch (error) {
            console.error("Failed to rename project", error);
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{l.renameProject}</DialogTitle>
            <DialogContent>
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
                    {l.rename}
                </Button>
            </DialogActions>
        </Dialog>
    );
});