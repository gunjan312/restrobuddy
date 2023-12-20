import {Avatar, Grid, TextField, Button, Select, FormHelperText, } from "@mui/material"
import{ FormLabel,RadioGroup, FormControlLabel, Radio} from "@mui/material"

import { makeStyles } from "@mui/styles"
import Heading from "../../components/heading/Heading"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import UploadFile from '@mui/icons-material/UploadFile'
import { useState, useEffect } from "react";
import { serverURL, getData, postData } from "../../Services/FetchNodeServices";
import Swal from "sweetalert2";
const useStyles = makeStyles({
    root:{width :"auto", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})

export default function TableBookingInterface(){
    var classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[restaurantId, setRestaurantId] = useState('')
    const[tableNo, setTableNo] = useState('')
    const[noOfChairs, setNoOfChairs] = useState('')
    const[floor, setFloor] = useState('')
    const[tableBookingError, setTableBookingError]= useState({})

    const handleError=(error, input, message)=>{
        setTableBookingError(prevState =>({...prevState, [input]:{'error':error, 'message':message}}))
    }
    const validation =()=>{
        var submitRecord = true
        if(restaurantId.length==0)
        {
            handleError(true, 'restaurantId', 'Please enter Restaurant ID')
            submitRecord = false
        }
        if(tableNo.length==0)
        {
            handleError(true, 'tableNo', 'Please enter Table Number')
            submitRecord = false
        }
        if(noOfChairs.trim().length==0)
        {
            handleError(true, 'noOfChairs', 'Please enter Number of chairs')
            submitRecord = false
        }
        if(floor.trim().length==0)
        {
            handleError(true, 'floor', 'Please select floor')
            submitRecord = false
        }
       
        return submitRecord
    }

    const handleReset=()=>{
        setRestaurantId('')
        setTableNo('')
        setNoOfChairs('')
         setFloor('')
    }

    useEffect(function(){
        setRestaurantId(admin.restaurantid)
    },[])


    const handleTableBookingSubmit=async()=>{
        var error = validation()
        if(error){
        var body = {'restaurantid': restaurantId, 'tableno': tableNo, 'noofchairs': noOfChairs, 'floor': floor }
        var result = await postData('tablebooking/tablebooking_submit', body)
        if(result.status){
            Swal.fire({
                icon: 'success',
                title: 'Table Booking Registeration',
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


    return(
        <div className={classes.root}>
            <div className={classes.box}>
                    <Grid container spacing={4}>

                        <Grid item xs={12}>
                            <Heading title={"Table Booking"}  myroute={'/admindashboard/displayalltablebooking'} fullWidth/>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField 
                            disabled
                            label="Restaurant ID" value={restaurantId} fullWidth/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                             onFocus={()=>handleError(false,'tableNo','')}
                             error={tableBookingError?.tableNo?.error}
                             helperText={tableBookingError?.tableNo?.message}
                            label="Table Number"  onChange={(event)=>setTableNo(event.target.value)} value={tableNo} fullWidth />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField 
                             onFocus={()=>handleError(false,'noOfChairs','')}
                             error={tableBookingError?.noOfChairs?.error}
                             helperText={tableBookingError?.noOfChairs?.message}
                            label="Number of Chairs"  onChange={(event)=>setNoOfChairs(event.target.value)} value={noOfChairs} fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Floor</InputLabel>
                            <Select 
                            onFocus={()=>handleError(false,'floor','')}
                            error={tableBookingError?.floor?.error}
                            label="Floor" onChange={(event)=>setFloor(event.target.value)} value={floor} >
                                <MenuItem>-Select Floor-</MenuItem>
                                <MenuItem value="Floor 0">Floor 0</MenuItem>
                                <MenuItem value="Floor 1">Floor 1</MenuItem>
                                <MenuItem value="Floor 2">Floor 2</MenuItem>
                                <MenuItem value="Floor 3">Floor 3</MenuItem>
                                <MenuItem value="Floor 4">Floor 4</MenuItem>
                                <MenuItem value="Floor 5">Floor 5</MenuItem>
                                <MenuItem value="Floor 6">Floor 6</MenuItem>
                                <MenuItem value="Floor 7">Floor 7</MenuItem>
                                <MenuItem value="Floor 8">Floor 8</MenuItem>
                                <MenuItem value="Floor 9">Floor 9</MenuItem>
                                <MenuItem value="Floor 10">Floor 10</MenuItem>
                                <MenuItem value="Roof Top">Roof Top</MenuItem>
 
                               
                            </Select>
                        </FormControl>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{tableBookingError?.floor?.message}</div>
                    </Grid>

                        <Grid item xs={6} >
                        <Button variant="contained"fullWidth onClick={handleTableBookingSubmit}>Submit</Button>
                
                    </Grid>
                    <Grid item xs={6} >
                        <Button variant="contained" onClick={handleReset} fullWidth>Reset</Button>
                    </Grid>  


                    </Grid>
            </div>
        </div>
    )
}