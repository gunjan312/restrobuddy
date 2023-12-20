import {Avatar, Grid, TextField, Button, Select, FormHelperText } from "@mui/material"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import UploadFile from '@mui/icons-material/UploadFile'
import { useState, useEffect } from "react";
import { serverURL, getData, postData } from "../../Services/FetchNodeServices";
import {useStyles} from "./FoodBookingCss"
import TableComponent from "../../components/TableComponent/TableComponent";
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent";
import TableCart from "../../components/TableCart/TableCart";




export default function FoodBooking(props){
    var classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    
    const[currentDate, setCurrentDate] = useState('')
    const[waiterid, setWaiterid] = useState('')
    const[waiterName, setWaiterName] = useState([])
    const[waiter, setWaiter] = useState('')
    const[floorNo, setFloorNo] = useState('')
    const[tableNo, setTableNo] = useState('')
    const[refresh, setRefresh] = useState(false)



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const getCurrentDate=()=>{
        var date = new Date()
        var cd = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
        return cd
    }

    const getCurrentTime=()=>{
        var time = new Date()
        var ct = time.getHours()+":"+time.getMinutes()
        return ct
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fetchAllWaiters = async()=>{
        var result = await postData('waitertable/fetch_waiter',{restaurantid:admin.restaurantid})
        setWaiterName(result.data)
    }

    const handleWaiterChange=(event,value)=>{
       setWaiterid(event.target.value)
       setWaiter(value.props.children)
    }

    const fillWaiterId=()=>{
       return waiterName.map((item)=>{
           return <MenuItem value={item.waiterid}>{item.waitername}</MenuItem>
       })
   }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(function(){
        setCurrentDate(getCurrentDate()+" "+getCurrentTime())
        fetchAllWaiters()
    },[])

    return(
        <div className={classes.root}>
            <div className={classes.box}>
                        
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                    <img src={`${serverURL}/images/${admin.filelogo}`}  width="100" height="60" />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="Current Date" value={currentDate}/>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Waiter</InputLabel>
                            <Select
                            
                            label="Waiter" onChange={handleWaiterChange} value={waiterid} >
                                <MenuItem>-Select Waiter-</MenuItem>
                                {fillWaiterId()}
                            </Select>
                        </FormControl>
                    
                    </Grid>
                    <Grid item xs={4} style={{fontFamily:'kanit', fontWeight:'bold', fontSize:42, textAlign:'right', color:'#273c75'}}>
                        {floorNo}   {tableNo.length!=1?<>Table {tableNo}</>:''}
                    </Grid>

                </Grid>
                
            </div>
            <div className={classes.box}>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <CategoryComponent  floorNo={floorNo} tableNo={tableNo} refresh={refresh} setRefresh={setRefresh} />
                    </Grid>
                    <Grid item xs={4}>
                <TableComponent floorNo={floorNo} tableNo={tableNo} setFloorNo={setFloorNo} setTableNo={setTableNo}  />
                </Grid>
                <Grid item xs={5}>
                    <TableCart waiter={waiter}  tableNo={`#${floorNo}${tableNo}`}  refresh={refresh} setRefresh={setRefresh} />
                </Grid>
                </Grid>
            </div>
        </div>
    )
}