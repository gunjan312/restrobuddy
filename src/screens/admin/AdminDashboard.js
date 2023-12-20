import { useState } from "react"
import {Avatar,AppBar, Toolbar, Typography, Box, Grid, Paper} from '@mui/material';
import { makeStyles } from "@mui/styles"
import DashboardIcon from '@mui/icons-material/Dashboard';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import PersonIcon from '@mui/icons-material/Person';
import BoyIcon from '@mui/icons-material/Boy';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import RestaurantInterface from "../restaurant/RestaurantInterface"
import DisplayAllRestaurant from "../restaurant/DisplayAllRestaurant"
import CategoryInterface from "../category/CategoryInterface"
import DisplayAllCategory from "../category/DisplayAllCategory"
import FoodItemInterface from "../foodItems/FoodItemInterface"
import DisplayAllFoodItems from "../foodItems/DisplayAllFoodItems"
import TableBookingInterface from "../tablebooking/TableBookingInterface"
import DisplayAllTableBooking from "../tablebooking/DisplayAllTableBooking"
import WaiterInterface from "../waiters/WaiterInterface"
import DisplayAllWaiters from "../waiters/DisplayAllWaiters"
import WaiterTableInterface from "../waitertable/WaiterTableInterface"
import DisplayAllWaiterTable from "../waitertable/DisplayAllWaiterTable";
import FoodBooking from "../FoodBooking/FoodBooking"
import BillReport from "../BillReport/BillReport";
import { serverURL } from "../../Services/FetchNodeServices";
import Summary from "./Summary";



const useStyles = makeStyles({
    root:{width :"100vw", height:"100%", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'},
    leftBarStyle :{padding:5, display:'flex', justifyContent:'center', alignItems:'center', margin:10, flexDirection:'column', position:'fixed' },
    nameStyle:{ fontFamily:'Kanit', fontWeight:'bold', fontSize:18, marginTop:5, marginBottom:2},
    emailStyle:{ fontFamily:'Kanit', fontWeight:'bold', fontSize:12,  color:'#95a5a6', margin:2},
    phoneStyle:{ fontFamily:'Kanit', fontWeight:'bold', fontSize:12, color:'#95a5a6', margin:2},
    menuStyle:{fontFamily:'Kanit', fontWeight:'bold', fontSize:18, display:'flex', justifyContent:'left',width:200},
    menuItemStyle :{fontFamily:'Kanit', fontWeight:'bold', fontSize:13, }
    
})

export default function AdminDashboard(props){
    var classes = useStyles()
    var navigate = useNavigate()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const handleLogout=()=>{
        //////// Code for logout from dashboard/////
        localStorage.clear()
        navigate('/adminlogin')
        //////////////////////////////////
    }

    return(
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          
          <Typography variant="h6" color="inherit" component="div">
            {admin.restaurantname}
          </Typography>
        </Toolbar>
      </AppBar>
        <Grid container spacing={2} >
            <Grid item xs={2} style={{marginTop:45}}>
                <Paper className={classes.leftBarStyle} >
                    <Avatar src={`${serverURL}/images/${admin.filelogo}`} variant="circular" style={{width:80, height:85}} />
                    <div className={classes.nameStyle}>{admin.ownername}</div>
                    <div className={classes.emailStyle}>{admin.emailid}</div>
                    <div className={classes.phoneStyle}>+91{admin.mobilenumber}</div>

                    <div className={classes.menuStyle}>
                    <List>


                                 <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/summary')}>
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Dashboard</span>} />
                                    </ListItemButton>
                                </ListItem> 

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/displayallcategory')}>
                                    <ListItemIcon>
                                        <FoodBankIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Category List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                {/* <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/fooditeminterface')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Add Food Items</span>} />
                                    </ListItemButton>
                                </ListItem> */}

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/displayallfooditems')}>
                                    <ListItemIcon>
                                        <FastfoodIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Food Item List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                {/* <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/tablebookinginterface')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Book Table</span>} />
                                    </ListItemButton>
                                </ListItem> */}

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/displayalltablebooking')}>
                                    <ListItemIcon>
                                        <TableRestaurantIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Table Booking List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                {/* <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/waiterinterface')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Add Waiter</span>} />
                                    </ListItemButton>
                                </ListItem> */}

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/displayallwaiters')}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Waiters List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                {/* <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/waitertableinterface')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Add waiter and Table</span>} />
                                    </ListItemButton>
                                </ListItem> */}

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/displayallwaitertable')}>
                                    <ListItemIcon>
                                        <BoyIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Waiter and Table List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/foodbooking')}>
                                    <ListItemIcon>
                                        <BorderColorIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Order and Billing</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/admindashboard/billreport')}>
                                    <ListItemIcon>
                                        <CurrencyRupeeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Sales</span>} />
                                    </ListItemButton>
                                </ListItem>

                                     <Divider variant="middle" />
                                <ListItem disablePadding>
                                    <ListItemButton onClick={handleLogout}>
                                    <ListItemIcon>
                                        <PowerSettingsNewIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Logout</span>} />
                                    </ListItemButton>
                                </ListItem>
                                
                                </List>
                           
                    </div>
                </Paper>

            </Grid>

            <Grid item xs={10}  style={{display:'flex', justifyContent:'center', padding:25, background:"#808e9b", marginTop:70, marginBottom:10, height:"100vh"}}>
                <div>
            <Routes>
            <Route path="/"  element={<Navigate to="/admindashboard/Summary" replace={true} />}/>
          <Route element={<CategoryInterface/>} path="/categoryinterface" />
          <Route element={<DisplayAllCategory/>} path="/displayallcategory" />

          <Route element={<FoodItemInterface/>} path="/fooditeminterface" />
          <Route element={<DisplayAllFoodItems/>} path="/displayallfooditems" />

          <Route element={<TableBookingInterface/>} path="/tablebookinginterface" />
          <Route element={<DisplayAllTableBooking/>} path="/displayalltablebooking" />

          <Route element={<WaiterInterface/>} path="/waiterinterface" />
          <Route element={<DisplayAllWaiters/>} path="/displayallwaiters" />

          <Route element={<WaiterTableInterface/>} path="/waitertableinterface" />
          <Route element={<DisplayAllWaiterTable/>} path="/displayallwaitertable" />

          <Route element={<FoodBooking/>} path="/foodbooking" />
          <Route element={<BillReport/>} path="/billreport" />
          <Route element={<Summary/>} path="/summary" />

          </Routes>
          </div>
            </Grid>

        </Grid>
    </Box>
    )
}