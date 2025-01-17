/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Cube from "examples/Icons/Cube";
import CreditCard from "examples/Icons/CreditCard";
// Soft UI Dashboard React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import 'bootstrap-icons/font/bootstrap-icons.css';
import MyCircle from "layouts/tables/circle/mycircle";
import JoinCircle from "layouts/tables/circle/joincircle";
import EventMyCircle from "layouts/tables/event/MyEvent";
import InviteCircle from "layouts/tables/circle/invitecircle";
import MemberCircle from "layouts/tables/circle/member";
import DetailEventMyCircle from "layouts/tables/event/DetailEventMyCircle";
import EventJoin from "layouts/tables/event/EventJoin";
import FaQ from "layouts/tables/faq/faq";
import Notification from "layouts/tables/notificationn/notif";
import Bill from "layouts/tables/bill/bill";
import Chat from "layouts/tables/forum/forum";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "My Circle",
    key: "MyCircle",
    route: "/MyCircle",
    icon: <Office size="12px" />,
    component: <MyCircle />,
    noCollapse: true,
  },
  {
    key: "Invite",
    route: "/InviteCircle/:id_circle/:circle_name",
    icon: <Office size="12px" />,
    component: <InviteCircle />,
    noCollapse: true,
  },
  {
    key: "Member",
    route: "/MemberCircle/:id_circle/:circle_name",
    icon: <Office size="12px" />,
    component: <MemberCircle />,
    noCollapse: true,
  },
  {
    key: "Event",
    route: "/EventMyCircle/:id_circle/:circle_name",
    icon: <Office size="12px" />,
    component: <EventMyCircle />,
    noCollapse: true,
  },
  {
    key: "Detail event My Circle",
    route: "/DetailEventMyCircle/:id_circle/:id_event",
    icon: <Office size="12px" />,
    component: <DetailEventMyCircle />,
    noCollapse: true,
  },
  {
    key: "Event Join",
    route: "/EventJoin/:id_circle/:circle_name",
    icon: <Office size="12px" />,
    component: <EventJoin />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Join Circle",
    key: "JoinCircle",
    route: "/JoinCircle",
    icon: <Office size="12px" />,
    component: <JoinCircle />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Notification",
    key: "Notification",
    route: "/Notification",
    icon: <Cube size="12px" />,
    component: <Notification />,
    noCollapse: true,
  },
  {
    // type: "collapse",
    // name: "Bill",
    key: "Bill",
    route: "/Bill/:id_circle/:id_event",
    icon: <CreditCard size="12px" />,
    component: <Bill />,
    noCollapse: true,
  },
  {
    // type: "collapse",
    // name: "Chat",
    key: "Chat",
    route: "/Chat/:circleId/:circle_name",
    icon: <Cube size="12px" />,
    component: <Chat />,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "FaQ",
    key: "FaQ",
    route: "/FaQ",
    icon: <Settings size="12px" />,
    component: <FaQ />,
    noCollapse: true,
  },
  {
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
  
];

export default routes;
