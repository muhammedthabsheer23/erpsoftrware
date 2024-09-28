import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useNavigate } from 'react-router-dom';
import { useAppstore } from '../appStore';
import LogoutIcon from '@mui/icons-material/Logout';
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:650px)'); // Check if screen is <= 400px
  const open = useAppstore((state) => state.dopen);
  const [drawerOpen, setDrawerOpen] = React.useState(open);

  React.useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false); // Automatically close drawer on small screens
    } else {
      setDrawerOpen(open); // Keep it as per original state on larger screens
    }
  }, [isMobile, open]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box height={30} />
      <Drawer variant="permanent" open={drawerOpen}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
         
         <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate('/home')}}>
           <ListItemButton
             sx={{
               
               minHeight: 48,
               justifyContent: open ? 'initial' : 'center',
               px: 2.5,
             }}
           >
             <ListItemIcon
               sx={{
                 minWidth: 0,
                 mr: open ? 3 : 'auto',
                 justifyContent: 'center',
               }}
             >
             <InboxIcon />
             </ListItemIcon>
             <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
           </ListItemButton>
         </ListItem>
    
     </List>
     <List>
      
      <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate('/dayreport')}} >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
          <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Day Report" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
 
  </List>   
  {/* <List>
      
      <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate('/dayend')}} >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
          <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Day End Report" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
 
  </List>   */}
       <List>
      
      <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate('/purchase')}} >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
          <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Purchase Report" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
 
  </List>
  <List>
      
      <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate('/productsummary')}}>
        <ListItemButton
          sx={{
            
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
          <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Product Summary" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
 
  </List>
  <List>
      
      <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate('/dayendreport')}} >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
          <LogoutIcon/>
          </ListItemIcon>
          <ListItemText primary="Day End Report" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
 
  </List>
  <List>
      
      <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate('/monthendreport')}} >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
          <LogoutIcon/>
          </ListItemIcon>
          <ListItemText primary="Monthly Report" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
 
  </List>
  <List>
      
      <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate('/')}} >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
          <LogoutIcon/>
          </ListItemIcon>
          <ListItemText primary="LOGOUT" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
 
  </List>
   </Drawer>
  
 </Box>
);
}