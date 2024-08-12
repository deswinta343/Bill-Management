import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar'; // Import Avatar
import SoftBox from "components/SoftBox";
import Breadcrumbs from "examples/Breadcrumbs";
import ItemNotif from "layouts/tables/notificationn/item";
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Ganti ini dengan user ID yang sesuai
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get(`http://152.42.188.210:8080/api/auth/notifications/${userId}`);
        setNotificationCount(response.data.count);
      } catch (error) {
        console.error('Error fetching notification count', error);
      }
    };

    fetchNotificationCount();
  }, [userId]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
    setOpenMenu(false);
  };

  const renderMenu = () => (
    <Menu
      anchorEl={notificationAnchorEl}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleNotificationClose}
    >
      <ItemNotif />
    </Menu>
  );

  const notificationCountStyle = {
    fontSize: '12px',
    color: 'red',
    marginLeft: '8px',
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SoftBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </SoftBox>
        {isMini ? null : (
          <SoftBox sx={(theme) => navbarRow(theme, { isMini })}>
            <SoftBox pr={1}>
            </SoftBox>
            <SoftBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  alt={username} 
                  src="/path/to/default/avatar.png" 
                  sx={{ width: 35, height: 35 }} // Mengatur ukuran avatar menjadi lebih kecil
                />
                <span style={{ marginLeft: '5px', color: light ? 'white' : 'inherit', fontSize: '0.875rem' }}>Hi, {username}</span>
                <IconButton
                  size="small"
                  color="inherit"
                  aria-controls="notification-menu"
                  aria-haspopup="true"
                  onClick={handleNotificationClick}
                  sx={{ marginLeft: '10px' }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <Icon sx={{ fontSize: '1.5rem' }}>notifications</Icon> 
                  </Badge>
                </IconButton>
              </div>
              {renderMenu()}
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
