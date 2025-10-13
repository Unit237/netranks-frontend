import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import SitemarkIcon from '../../../components/SitemarkIcon';
import MenuContent from './MenuContent';
import SelectContent from './SelectContent';
import { useParams } from 'react-router-dom';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {

  const { pid } = useParams();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          pl: 1.5, pt: 1.5,
        }}
      >
        <SitemarkIcon />
      </Box>

      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      {!!pid && (
        <>
          {/* <Divider /> */}
          <Box
            sx={{
              overflow: 'auto',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MenuContent closeMobileMenu={null} />
          </Box>
        </>
      )}
    </Drawer>
  );
}
