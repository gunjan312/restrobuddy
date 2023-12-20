import {Avatar, Grid, TextField, Button, Select, FormHelperText } from "@mui/material"


import { makeStyles } from "@mui/styles"
import Heading from "../../components/heading/Heading"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import UploadFile from '@mui/icons-material/UploadFile'
import { useState, useEffect } from "react";
import { serverURL, getData, postData } from "../../Services/FetchNodeServices";
import Swal from "sweetalert2";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const useStyles = makeStyles({
    root:{width :"auto", height:"100%", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})



export default function WaiterTableInterface(){
    var classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[restaurantid, setRestaurantid] = useState('')
    const[waiterid, setWaiterid] = useState('')
    const[waiterName, setWaiterName] = useState([])
    const[tableno, setTableno] = useState([])
    const[tableid, setTableid] = useState('')
    const[floor, setFloor] = useState([])
    const[floorNo, setFloorNo] = useState('')
    const[currentDate, setCurrentDate] = useState('')
    const[waiterTableError, setWaiterTableError]= useState({})

    const handleReset=()=>{
        setWaiterid('')
    //setWaiterName([])
    //setTableno([])
    setFloorNo('')
    setTableid('')
     setCurrentDate('')
    }

const handleError=(error, input, message)=>{
    setWaiterTableError(prevState =>({...prevState, [input]:{'error':error, 'message':message}}))
}
const validation =()=>{
    var submitRecord = true
    if(restaurantid.length==0)
    {
        handleError(true, 'restaurantid', 'Please enter Restaurant ID')
        submitRecord = false
    }
    if(!waiterid)
    {
        handleError(true, 'waiterid', 'Please select Waiter ID')
        submitRecord = false
    }
    if(!tableid)
    {
        handleError(true, 'tableid', 'Please select tableid')
        submitRecord = false
    }
   
    return submitRecord
}


    



    const handleSubmit =async()=>{
        var error=validation()
        if(error){
        var d = new Date()
        var cd = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
        var body = {'restaurantid':restaurantid, 'waiterid':waiterid, 'tablenoid':tableid,'currentdate':currentDate}
        var result = await postData('waitertable/waitertable_submit', body)
        if(result.status){
            Swal.fire({
                icon: 'success',
                title: 'Assigning Waiter and Table',
                text: result.message,
                position:'center',
                timer:5000,
                showConfirmButton:false,
                toast:true
                
              })
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    position:'center',
                    timer:5000,
                    showConfirmButton:false,
                    toast:true
                  })
            }
        }
    }

    ///////////////////////////////////////////// Fetch Waiter Name and id //////////////////////////////////////////////
    const fetchAllWaiters = async()=>{
         var result = await postData('waitertable/fetch_waiter',{restaurantid:admin.restaurantid})
         setWaiterName(result.data)
     }

     const handleWaiterChange=(event)=>{
        setWaiterid(event.target.value)
     }

     const fillWaiterId=()=>{
        return waiterName.map((item)=>{
            return <MenuItem value={item.waiterid}>{item.waitername}</MenuItem>
        })
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////// Fetch Table Number and id //////////////////////////////////////////////
    const fetchAllTables = async(fn)=>{
         var result = await postData('waitertable/fetch_table_by_floor', {restaurantid:admin.restaurantid, floor:fn})
         setTableno(result.data)
     }

     const handleTableChange=(event)=>{
        setTableid(event.target.value)
     }

     const fillTableid=()=>{
        return tableno.map((item)=>{
            return <MenuItem value={item.tableid}>{item.tableno}</MenuItem>
        })
    }


    const fetchAllFloor = async()=>{
        var result = await postData('waitertable/fetch_all_floor', {'restaurantid':admin.restaurantid})
        setFloor(result.data)
    }

    const fillFloor=()=>{
       return floor.map((item)=>{
           return <MenuItem value={item.floor}>{item.floor}</MenuItem>
       })
    }

    const handleFloorChange=(event)=>{
        setFloorNo(event.target.value)
        fetchAllTables(event.target.value)
    }


    useEffect(function(){
    
        fetchAllWaiters()
        fetchAllTables()
        fetchAllFloor()
        setRestaurantid(admin.restaurantid)
        
       
    },[])
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // const handleRestaurantId =(event)=>{
    //     setRestaurantid(event.target.value)
    //     fetchAllWaiters(event.target.value)
    //     fetchAllTables(event.target.value)
    // }

    const handleDate=(event)=>{
        const m=String(Number(event.$M)+1);
        const d=String(event.$D);
        const y=String(event.$y);
        setCurrentDate(y+"-"+m+"-"+d);   
      }

    return(
        <div className={classes.root} >
            <div className={classes.box}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Heading title={"Assign Waiter Table"}  myroute={'/admindashboard/displayallwaitertable'}/>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                        
                        label="Restaurant ID" value={restaurantid}  fullWidth/>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Waiter</InputLabel>
                            <Select
                            onFocus={()=>handleError(false,'waiterid','')}
                            error={waiterTableError?.waiterid?.error} 
                            label="Waiter" onChange={handleWaiterChange} value={waiterid} >
                                <MenuItem>-Select Waiter-</MenuItem>
                                {fillWaiterId()}
                            </Select>
                        </FormControl>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{waiterTableError?.waiterid?.message}</div>
                    </Grid>


                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Floor No</InputLabel>
                            <Select 
                            onFocus={()=>handleError(false,'tableid','')}
                            error={waiterTableError?.tableid?.error} 
                            label="Floor No" onChange={handleFloorChange} value={floorNo} >
                                <MenuItem>-Select Floor No-</MenuItem>
                                {fillFloor()}
                            </Select>
                        </FormControl>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{waiterTableError?.tableid?.message}</div>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Table Number</InputLabel>
                            <Select 
                            onFocus={()=>handleError(false,'tableid','')}
                            error={waiterTableError?.tableid?.error} 
                            label="Table Number" onChange={handleTableChange} value={tableid} >
                                <MenuItem>-Select Table-</MenuItem>
                                {fillTableid()}
                            </Select>
                        </FormControl>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{waiterTableError?.tableid?.message}</div>
                    </Grid>    


                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                             <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Current Date"
                                     format="DD-MM-YYYY"  onChange={handleDate}/>
                                </DemoContainer>
                        </LocalizationProvider>
                        </Grid>                  
                    

                    <Grid item xs={6}>
                        <Button variant="contained" onClick={handleSubmit} fullWidth>Submit</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" onClick={handleReset} fullWidth>Reset</Button>
                    </Grid>

                </Grid>
            </div>
        </div>
    )
}