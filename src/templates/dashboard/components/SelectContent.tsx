import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PollRoundedIcon from '@mui/icons-material/PollRounded';
import { Divider, ListItemIcon } from '@mui/material';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select, { selectClasses } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../../localization/language';
import keys from '../../../util/keys';
import { setActiveProjectId, useUser } from '../../../util/user';
import { NewProjectDialog } from '../../../pages/project/NewProjectDialog';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
    width: 28,
    height: 28,
    backgroundColor: (theme.vars || theme).palette.background.paper,
    color: (theme.vars || theme).palette.text.secondary,
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
    minWidth: 0,
    marginRight: 12,
});

export default function SelectContent() {
    const l = useLanguage().sidemenu;
    const navigate = useNavigate();
    const { pid } = useParams();
    const user = useUser();
    const newProjectDialog = React.useRef(undefined);

    const selectProject = project => {
        setActiveProjectId(project.Id);
        navigate(keys.routes.ProjectOverview(project.Id));
    }

    const createNewProject = () => {
        newProjectDialog.current.open();
    }

    return (
        <>
            <Select
                id="project-select"
                labelId="project-select-label"
                value={pid || ""}
                displayEmpty
                inputProps={{ 'aria-label': 'Select company' }}
                fullWidth
                sx={{
                    maxHeight: 56,
                    width: 215,
                    '&.MuiList-root': {
                        p: '8px',
                    },
                    [`& .${selectClasses.select}`]: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        pl: 1,
                    },
                }}

            >

                <ListSubheader sx={{ pt: 0 }}>
                    {l.projects}
                </ListSubheader>
                {user.Projects.map(x => (
                    <MenuItem value={x.Id} onClick={() => selectProject(x)}>
                        <ListItemAvatar>
                            <Avatar alt={x.Name || l.defaultProject}>
                                <PollRoundedIcon sx={{ fontSize: '1rem' }} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={x.Name || l.defaultProject} secondary={x.Surveys.length + " surveys"} />
                    </MenuItem>
                ))}
                <Divider sx={{ mx: -1 }} />
                <MenuItem value={40} onClick={createNewProject}>
                    <ListItemIcon>
                        <AddRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary={l.createNewProject} />
                </MenuItem>
            </Select>
            <NewProjectDialog ref={newProjectDialog} />
        </>
    );
}
