import {Avatar, Grid, TextField, Button, Select, FormHelperText } from "@mui/material"
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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const useStyles = makeStyles({
    root:{width :"auto", height:"100%", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})

export default function WaiterInterface(){
var classes = useStyles()
var admin = JSON.parse(localStorage.getItem('ADMIN'))

const[restaurantid, setRestaurantid] = useState('')
const[waiterName, setWaiteName] = useState('')
const[gender, setGender] = useState('')
const[dob, setDob] = useState('')
const[mobileNo, setMobileNo] = useState('')
const[emailid, setEmailid] = useState('')
const[address, setAddress] = useState('')
const[picture, setPicture]= useState({url:'', bytes:''})
const[waiterError, setWaiterError]= useState({})

const handleReset=()=>{
    setWaiteName('')
    setGender('')
     setDob('')
     setMobileNo('')
    setEmailid('')
     setAddress('')
     setPicture({url:'', bytes:''})
}

const handleError=(error, input, message)=>{
    setWaiterError(prevState =>({...prevState, [input]:{'error':error, 'message':message}}))
}
const validation =()=>{
    var submitRecord = true
    if(restaurantid.length==0)
    {
        handleError(true, 'restaurantid', 'Please enter Restaurant ID')
        submitRecord = false
    }
    if(waiterName.length==0)
    {
        handleError(true, 'waiterName', 'Please enter Waiter Name')
        submitRecord = false
    }
    if(gender.trim().length==0)
    {
        handleError(true, 'gender', 'Please enter Number of Gender')
        submitRecord = false
    }
   
    if(emailid.trim().length==0)
    {
        handleError(true, 'emailid', 'Please enter Emailid')
        submitRecord = false
    }
    if(mobileNo.trim().length==0)
    {
        handleError(true, 'mobileNo', 'Please enter Mobile Number')
        submitRecord = false
    }
    if(address.trim().length==0)
    {
        handleError(true, 'address', 'Please enter Address')
        submitRecord = false
    }
    if(!picture.url)
        {
            handleError(true, 'picture', 'Please Upload picture')
            submitRecord = false
        }
   
    return submitRecord
}

useEffect(function(){
    setRestaurantid(admin.restaurantid)
},[])


const handlePicture=(event)=>{
    setPicture({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
 }

 const handleSubmit =async()=>{

    var error = validation()
    if(error){
    var formData = new FormData()
    formData.append('restaurantid', restaurantid)
    formData.append('waitername', waiterName)
    formData.append('gender', gender)
    formData.append('dob', dob)
    formData.append('mobileno', mobileNo)
    formData.append('emailid', emailid)
    formData.append('address', address)
    formData.append('picture', picture.bytes)

    var result = await postData('waiter/waiter_submit', formData)
    if(result.status){
        Swal.fire({
            icon: 'success',
            title: 'Waiter Registeration',
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


 const handleDate=(event)=>{
    const m=String(Number(event.$M)+1);
    const d=String(event.$D);
    const y=String(event.$y);
    setDob(y+"-"+m+"-"+d);   
  }

    return(
        <div className={classes.root}>
            <div  className={classes.box}>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Heading title={"Waiter Registeration"}  myroute={'/admindashboard/displayallwaiters'}/>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                        
                        label="Restaurant ID" value={restaurantid} fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                        onFocus={()=>handleError(false,'waiterName','')}
                        error={waiterError?.waiterName?.error}
                        helperText={waiterError?.waiterName?.message}
                        label="Waiter Name"  onChange={(event)=>setWaiteName(event.target.value)} value={waiterName} fullWidth/>
                    </Grid>
                    {/* <Grid item xs={4}>
                        <TextField
                        onFocus={()=>handleError(false,'gender','')}
                        error={waiterError?.gender?.error}
                        helperText={waiterError?.gender?.message}
                        label="Gender"  onChange={(event)=>setGender(event.target.value)} fullWidth />
                    </Grid> */}

                        <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                             <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                    label="Date of Birth"
                                     format="DD-MM-YYYY"  onChange={handleDate}/>
                                </DemoContainer>
                        </LocalizationProvider>
                        </Grid>     

                    <Grid item xs={8}>
                        <FormControl>
                            <FormLabel style={{fontWeight:'bold'}} >Gender</FormLabel>
                                <RadioGroup row  >
                                    <FormControlLabel  value={'Male'} label={"Male"} onChange={(event)=>setGender(event.target.value)} control={<Radio/>}/>
                                    <FormControlLabel value={'Female'} label={"Female"} onChange={(event)=>setGender(event.target.value)} control={<Radio/>} />
                                </RadioGroup>    
                        </FormControl>
                     </Grid>
                     

                    {/* <Grid item xs={4}>
                        <TextField 
                         onFocus={()=>handleError(false,'dob','')}
                         error={waiterError?.dob?.error}
                         helperText={waiterError?.dob?.message}
                         label="DOB"
                         type="date"
                         defaultValue=" "
                          onChange={(event)=>setDob(event.target.value)} fullWidth />
                        
                    </Grid> */}

                    <Grid item xs={4}>
                        <TextField 
                         onFocus={()=>handleError(false,'mobileNo','')}
                         error={waiterError?.mobileNo?.error}
                         helperText={waiterError?.mobileNo?.message}
                        label="Mobile Number"  onChange={(event)=>setMobileNo(event.target.value)}  value={mobileNo} fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                        onFocus={()=>handleError(false,'emailid','')}
                        error={waiterError?.emailid?.error}
                        helperText={waiterError?.emailid?.message}
                        label="Email ID"  onChange={(event)=>setEmailid(event.target.value)} value={emailid} fullWidth />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField 
                        onFocus={()=>handleError(false,'address','')}
                        error={waiterError?.address?.error}
                        helperText={waiterError?.address?.message}
                        label="Address"  onChange={(event)=>setAddress(event.target.value)} value={address}  fullWidth />
                    </Grid>

                    <Grid item xs={8} >
                    <Button component="label" variant="contained" endIcon={<UploadFile/>}fullWidth >
                    <input
                    onFocus={()=>handleError(false,'picture','')}
                    multiple type="file" onChange={handlePicture} hidden accept="image/*"></input>
                        Upload Picture
                        </Button>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{waiterError?.picture?.message}</div>
                    </Grid>
                    <Grid item xs={4} className={classes.center}>
                         <Avatar
                            alt="Remy Sharp"
                            src={picture.url}
                            sx={{ width: 56, height: 56 }}
                            />
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