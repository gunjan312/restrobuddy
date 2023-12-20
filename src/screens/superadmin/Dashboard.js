import { useState } from "react"
import {Avatar,AppBar, Toolbar, Typography, Box, Grid, Paper} from '@mui/material';
import { makeStyles } from "@mui/styles"

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { Route, Routes, useNavigate } from "react-router-dom";
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
import { serverURL } from "../../Services/FetchNodeServices";



const useStyles = makeStyles({
    root:{width :"100vw", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'},
    leftBarStyle :{padding:5, display:'flex', justifyContent:'center', alignItems:'center', margin:10, flexDirection:'column', position:'fixed' },
    nameStyle:{ fontFamily:'Kanit', fontWeight:'bold', fontSize:18, marginTop:5, marginBottom:2},
    emailStyle:{ fontFamily:'Kanit', fontWeight:'bold', fontSize:12,  color:'#95a5a6', margin:2},
    phoneStyle:{ fontFamily:'Kanit', fontWeight:'bold', fontSize:12, color:'#95a5a6', margin:2},
    menuStyle:{fontFamily:'Kanit', fontWeight:'bold', fontSize:18, display:'flex', justifyContent:'left',width:200},
    menuItemStyle :{fontFamily:'Kanit', fontWeight:'bold', fontSize:16, }
    
})

export default function Dashboard(props){
    var classes = useStyles()
    var navigate = useNavigate()
    var sa = JSON.parse(localStorage.getItem('SUPER'))
    const handleLogout=()=>{
        //////// Code for logout from dashboard/////
        localStorage.clear()
        navigate('/loginpage')
        //////////////////////////////////
    }

    return(
        <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          
          <Typography variant="h6" color="inherit" component="div">
            Super Admin
          </Typography>
        </Toolbar>
      </AppBar>
        <Grid container spacing={2}>
            <Grid item xs={2} style={{marginTop:45}}>
                <Paper className={classes.leftBarStyle}>
                    <Avatar src={`${serverURL}/images/${sa.picture}`} variant="circular" style={{width:80, height:85}} />
                    <div className={classes.nameStyle}>{sa.superadminname}</div>
                    <div className={classes.emailStyle}>{sa.emailid}</div>
                    <div className={classes.phoneStyle}>+917566978984</div>

                    <div className={classes.menuStyle}>
                    <List>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/restaurantinterface')}> 
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary= {<span className={classes.menuItemStyle}>Add restaurant</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/displayallrestaurant')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Restaurant List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                {/* <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/categoryinterface')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Add Category</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/displayallcategory')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Category List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/fooditeminterface')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Add Food Items</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/displayallfooditems')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Food Item List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/tablebookinginterface')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Book Table</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/displayalltablebooking')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Table Booking List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/waiterinterface')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Add Waiter</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/displayallwaiters')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Waiters List</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/waitertableinterface')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Add waiter and Table</span>} />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={()=>navigate('/dashboard/displayallwaitertable')}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Waiter and Table List</span>} />
                                    </ListItemButton>
                                </ListItem> */}

                                     <Divider variant="middle" />
                                <ListItem disablePadding>
                                    <ListItemButton onClick={handleLogout}>
                                    <ListItemIcon>
                                        <DraftsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={<span className={classes.menuItemStyle}>Logout</span>} />
                                    </ListItemButton>
                                </ListItem>
                                
                                </List>
                           
                    </div>
                </Paper>

            </Grid>
            <Grid item xs={10}  style={{display:'flex', justifyContent:'center', padding:25, background:"#808e9b", marginTop:70, marginBottom:10, height:"100vh"}}>
            <Routes>
          <Route element={<RestaurantInterface/>} path="/restaurantinterface" />
          <Route element={<DisplayAllRestaurant/>} path="/displayallrestaurant" />

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

          </Routes>
            </Grid>

        </Grid>
    </Box>
    )
}