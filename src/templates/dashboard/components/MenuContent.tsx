import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { CircularProgress, Divider, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { NavigateOptions, To, useLocation, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useLanguage } from '../../../localization/language';
import keys from '../../../util/keys';
import { useActiveProject, useSurveys } from '../../../util/user';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export default function MenuContent({ closeMobileMenu }) {
  const pendingPathName = useNavigation().location?.pathname;
  const l = useLanguage().sidemenu;
  const navigate = useNavigate();
  const location = useLocation();
  const { pid, sid } = useParams();
  const activeProject = useActiveProject();
  const surveys = useSurveys();

  const handleNavigate = (to: To, options?: NavigateOptions) => {
    closeMobileMenu?.();
    return navigate(to, options);
  }

  const secondaryListItems = React.useMemo(() => !activeProject.IsOwner ? [] : [
    { text: l.overview, icon: <AccountTreeIcon />, route: keys.routes.ProjectOverview(pid) },
    { text: l.members, icon: <PeopleAltIcon />, route: keys.routes.Members(pid) },
    { text: l.billing, icon: <MonetizationOnIcon />, route: keys.routes.Billing(pid) },
    // { text: 'Feedback', icon: <HelpRoundedIcon /> },
  ], [l, pid, activeProject]);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List>
        {surveys.length > 0 && (
          <>
            {surveys.map((item, index) => (
              <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                <ListItemButton selected={item.Id == sid} onClick={() => handleNavigate(keys.routes.Survey(pid, item.Id))}>
                  <ListItemIcon sx={{ alignSelf: "flex-start", mt: 1 }}>
                    {pendingPathName == keys.routes.Survey(pid, item.Id)
                      ? <CircularProgress color='inherit' size={16} />
                      : item.Id == sid ? (
                        <RadioButtonCheckedIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                  </ListItemIcon>
                  <ListItemText primary={item.Name ?? item.DescriptionShort} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
          </>
        )}
        {(activeProject.IsOwner || activeProject.IsEditor) && (

          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={location.pathname.endsWith("new-survey")} onClick={() => handleNavigate(keys.routes.NewSurvey(pid))}>
              <ListItemIcon>
                {pendingPathName == keys.routes.NewSurvey(pid)
                  ? <CircularProgress color='inherit' size={16} />
                  : <AddRoundedIcon />
                }
              </ListItemIcon>
              <ListItemText primary={l.createNewSurvey} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <List>
        {!!secondaryListItems.length && (
          <Typography variant='caption' color='textSecondary' sx={{ m: 1 }}>
            {l.projectSettings}
          </Typography>
        )}
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleNavigate(item.route)}>
              <ListItemIcon>
                {pendingPathName == item.route
                  ? <CircularProgress color='inherit' size={16} />
                  : item.icon
                }
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
