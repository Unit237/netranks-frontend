import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Avatar, Box, Typography } from '@mui/material';
import Divider, { dividerClasses } from '@mui/material/Divider';
import { listClasses } from '@mui/material/List';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { styled, useColorScheme } from '@mui/material/styles';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../../localization/language';
import connection from '../../../util/connection';
import keys from '../../../util/keys';
import token from '../../../util/token';
import { useUser } from '../../../util/user';
import MenuButton from './MenuButton';
import VersionInfo from '../../../components/VersionInfo';

const MenuItem = styled(MuiMenuItem)({
  margin: '2px 0',
});

export default function OptionsMenu() {
  const l = useLanguage().header.optionsMenu;
  const user = useUser();
  const navigate = useNavigate();
  const { pid } = useParams();
  const { mode, systemMode, setMode } = useColorScheme();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMode = (targetMode: 'system' | 'light' | 'dark') => () => {
    setMode(targetMode);
    handleClose();
  };

  const logout = async () => {
    await connection().get("api/Logout");
    token.clear();
    navigate(keys.routes.SignIn);
  }

  return !!user && (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: 'transparent', borderWidth: 0 }}
      >
        {/* <MoreVertRoundedIcon /> */}
        <Avatar
          sizes="small"
          alt={user.EMail}
          src={user.PhotoUrl}
          sx={{ width: 36, height: 36 }}
        />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: '4px',
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: '4px -4px',
          },
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        {/* <Divider /> */}
        {/* <MenuItem onClick={handleClose}>Add another account</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>Settings</MenuItem> */}

        <Typography variant='caption' color='textSecondary' sx={{ m: 1 }}>
          {l.profile}
        </Typography>
        <Box sx={{ pl: 2 }}>
          <MenuItem onClick={() => navigate(keys.routes.Profile(pid))}>
            <ListItemText>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                {user.Name || user.EMail}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user.Name ? user.EMail : ""}
              </Typography>
            </ListItemText>
          </MenuItem>
        </Box>

        <Divider />

        <Typography variant='caption' color='textSecondary' sx={{ m: 1 }}>
          {l.theme}
        </Typography>
        <Box sx={{ pl: 2 }}>
          <MenuItem selected={mode === 'system'} onClick={handleMode('system')}>
            {l.system}
          </MenuItem>
          <MenuItem selected={mode === 'light'} onClick={handleMode('light')}>
            {l.light}
          </MenuItem>
          <MenuItem selected={mode === 'dark'} onClick={handleMode('dark')}>
            {l.dark}
          </MenuItem>
        </Box>

        <Divider />

        <Typography variant='caption' color='textSecondary' sx={{ m: 1 }}>
          {l.account}
        </Typography>
        <Box sx={{ pl: 2 }}>
          <MenuItem
            onClick={logout}
            sx={{
              [`& .${listItemIconClasses.root}`]: {
                ml: 'auto',
                minWidth: 0,
              },
              minWidth: 150
            }}
          >
            <ListItemText>{l.logout}</ListItemText>
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
          </MenuItem>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <VersionInfo />
        </Box>
      </Menu>
    </React.Fragment>
  );
}
