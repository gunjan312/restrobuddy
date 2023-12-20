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
const useStyles = makeStyles({
    root:{width :"auto", height:"100%", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})
export default function RestaurantInterface(){
    var classes = useStyles()
    const[states, setStates]= useState([])
    const[stateid, setStateid]= useState('')
    const[city, setCity]= useState([])
    const[cityid, setCityid]= useState('')
    const[restaurantName, setRestaurantName]= useState('')
    const[ownerName, setOwnerName]= useState('')
    const[phoneNumber, setPhoneNumber]= useState('')
    const[mobileNumber, setMobileNumber]= useState('')
    const[emailAddress, setEmailAddress]= useState('')
    const[address, setAddress]= useState('')
    const[fssaiNumber, setFssaiNumber]= useState('')
    const[gstNumber, setGstNumber]= useState('')
    const[gstType, setGstType]= useState('')
    const[url, setUrl]= useState('')
    const[fileFssai, setFileFssai]= useState({url:'', bytes:''})
    const[fileShopAct, setFileShopAct]= useState({url:'', bytes:''})
    const[fileLogo, setFileLogo]= useState({url:'', bytes:''})
    const[resError, setResError]= useState({})
    const[password, setPassword] = useState('')

    const generatePassword=()=>{
        var pwd = parseInt((Math.random()*8999)+1000)
        return pwd
    }

    const handleReset=()=>{
        setStates([])
        setStateid('')
        setCity([])
        setRestaurantName('')
        setOwnerName('')
        setPhoneNumber('')
        setMobileNumber('')
        setEmailAddress('')
        setAddress('')
        setFssaiNumber('')
        setGstNumber('')
        setGstType('')
        setUrl('')
        setFileFssai({url:'', bytes:''})
        setFileShopAct({url:'', bytes:''})
        setFileLogo({url:'', bytes:''})


    }

    const handleError=(error, input, message)=>{
        setResError(prevState =>({...prevState, [input]:{'error':error, 'message':message}}))
    }

    const validation =()=>{
        var submitRecord = true
        if(restaurantName.trim().length==0)
        {
            handleError(true, 'restaurantName', 'Please enter Restaurant name')
            submitRecord = false
        }
        if(ownerName.trim().length==0)
        {
            handleError(true, 'ownerName', 'Please enter Owner name')
            submitRecord = false
        }
        if(mobileNumber.length==0 || !(/^[0-9]{10}$/.test(mobileNumber)))
        {
            handleError(true, 'mobileNumber', 'Please enter correct Mobile number')
            submitRecord = false
        }
        if(!stateid)
        {
            handleError(true, 'stateid', 'Please select state')
            submitRecord = false
        }
        if(!address)
        {
            handleError(true, 'address', 'Please enter address')
            submitRecord = false
        }
        if(!cityid)
        {
            handleError(true, 'cityid', 'Please select city')
            submitRecord = false
        }
        if(!emailAddress || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)))
        {
            handleError(true, 'emailAddress', 'Please enter correct email')
            submitRecord = false
        }
        if(fssaiNumber.length==0 || !(/^[0-9]{14}$/.test(fssaiNumber)))
        {
            handleError(true, 'fssaiNumber', 'Please enter correct Fssai number')
            submitRecord = false
        }
        if(!gstNumber || !(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)))
        {
            handleError(true, 'gstNumber', 'Please enter correct GST Number')
            submitRecord = false
        }
        if(!fileFssai.url)
        {
            handleError(true, 'fileFssai', 'Please Upload Fssai')
            submitRecord = false
        }
        if(!fileShopAct.url)
        {
            handleError(true, 'fileShopAct', 'Please Upload ShopAct')
            submitRecord = false
        }
        if(!fileLogo.url)
        {
            handleError(true, 'fileLogo', 'Please Upload Logo')
            submitRecord = false
        }
        return submitRecord
    }

    const fetchAllStates = async()=>{
        var result = await getData('statecity/fetch_all_states')
        console.log(result.data)
        setStates(result.data)
    }


    useEffect(function(){
       fetchAllStates() 
    },[])

    const fillStates=()=>{
        return states.map((item)=>{
            return <MenuItem value={item.stateid}>{item.statename}</MenuItem>
        })
    }

    const fetchAllCities = async(stateid)=>{
        var  body ={stateid:stateid}
         var result = await postData('statecity/fetch_all_cities', body)
         console.log(result.data)
         setCity(result.data)
     }

     const handleCityChange = (event)=>{
        setCityid(event.target.value)
     }

    const handleStateChange=(event)=>{
        setStateid(event.target.value)
        fetchAllCities(event.target.value)
    }

    
     const fillCity=()=>{
        return city.map((item)=>{
            return <MenuItem value={item.cityid}>{item.cityname}</MenuItem>
        })
     }

     const handleFssai=(event)=>{
        setFileFssai({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
     }
     const handleShopAct=(event)=>{
        setFileShopAct({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
     }
     const handlelogo=(event)=>{
        setFileLogo({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
     }

     const handleSubmit=async()=>{
        var error = validation()
        if(error){
        var formData = new FormData()
        formData.append('restaurantname', restaurantName)
        formData.append('ownername', ownerName)
        formData.append('stateid', stateid)
        formData.append('cityid', cityid)
        formData.append('phonenumber', phoneNumber)
        formData.append('mobilenumber', mobileNumber)
        formData.append('emailid', emailAddress)
        formData.append('address', address)
        formData.append('fssainumber', fssaiNumber)
        formData.append('gstnumber', gstNumber)
        formData.append('gsttype', gstType)
        formData.append('url',url)
        formData.append('filefssai', fileFssai.bytes)
        formData.append('fileshopact', fileShopAct.bytes)
        formData.append('filelogo', fileLogo.bytes)
        formData.append('password', generatePassword())
        var d = new Date()
        var cd = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
        formData.append('createdat', cd)
        formData.append('updatedat', cd)
        var result = await postData('restaurant/restaurant_submit', formData)
        

        if(result.status){
        Swal.fire({
            icon: 'success',
            title: 'Restaurant Registeration',
            text: result.message,
            position:'center',
            timer:2000,
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
                timer:2000,
                showConfirmButton:false,
                toast:true
              })
        }
    }  
     }

    

    return(
        <div className={classes.root}>
            <div className={classes.box}>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <Heading title={"Restaurant Register"}/>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField 
                        onFocus={()=>handleError(false,'restaurantName','')}
                        error={resError?.restaurantName?.error}
                        helperText={resError?.restaurantName?.message}
                        label="Restaurant Name" fullWidth onChange={(event)=>setRestaurantName(event.target.value)}/>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                        onFocus={()=>handleError(false,'ownerName','')}
                        error={resError?.ownerName?.error}
                        helperText={resError?.ownerName?.message}
                        label="Owner Name" fullWidth onChange={(event)=>setOwnerName(event.target.value)} />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField label="Phone Number" fullWidth onChange={(event)=>setPhoneNumber(event.target.value)} />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                         onFocus={()=>handleError(false,'mobileNumber','')}
                         error={resError?.mobileNumber?.error}
                         helperText={resError?.mobileNumber?.message}
                        label="Mobile Number" fullWidth onChange={(event)=>setMobileNumber(event.target.value)} />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                        onFocus={()=>handleError(false,'emailAddress','')}
                        error={resError?.emailAddress?.error}
                        helperText={resError?.emailAddress?.message}
                        label="Email Address" fullWidth onChange={(event)=>setEmailAddress(event.target.value)} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                        onFocus={()=>handleError(false,'address','')}
                        error={resError?.address?.error}
                        helperText={resError?.address?.message}
                        label="Address" fullWidth onChange={(event)=>setAddress(event.target.value)} />
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>States</InputLabel>
                            <Select 
                            onFocus={()=>handleError(false,'stateid','')}
                            error={resError?.stateid?.error}
                            label="States" value={stateid} onChange={handleStateChange}>
                                <MenuItem>-Select States-</MenuItem>
                                {fillStates()}
                            </Select>
                        </FormControl>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{resError?.stateid?.message}</div>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>City</InputLabel>
                            <Select
                            onFocus={()=>handleError(false,'cityid','')}
                            error={resError?.cityid?.error}
                            label="City" onChange={handleCityChange}>
                                <MenuItem>-Select City-</MenuItem>
                                {fillCity()}
                            </Select>
                        </FormControl>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{resError?.cityid?.message}</div>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="URL" fullWidth onChange={(event)=>setUrl(event.target.value)} />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                        onFocus={()=>handleError(false,'fssaiNumber','')}
                        error={resError?.fssaiNumber?.error}
                        helperText={resError?.fssaiNumber?.message}
                        label="Fssai Number" fullWidth onChange={(event)=>setFssaiNumber(event.target.value)} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                         onFocus={()=>handleError(false,'gstNumber','')}
                         error={resError?.gstNumber?.error}
                         helperText={resError?.gstNumber?.message}
                        label="GST Number" fullWidth onChange={(event)=>setGstNumber(event.target.value)} />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>GST Type</InputLabel>
                            <Select label="GST Type" onChange={(event)=>setGstType(event.target.value)}>
                                <MenuItem value="5 star">5 Star</MenuItem>
                                <MenuItem value="Others">Others</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                    <Button component="label" variant="contained" endIcon={<UploadFile/>} fullWidth>
                    <input
                    onFocus={()=>handleError(false,'fileFssai','')}
                    multiple type="file" onChange={handleFssai} hidden accept="image/*"></input>
                        Upload Fssai
                        </Button>
                       {resError?.fileFssai?.error?<div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{resError?.fileFssai?.message}</div>:<></>}
                    </Grid>

                    <Grid item xs={4} >
                    <Button component="label" variant="contained" endIcon={<UploadFile/>}fullWidth >
                    <input
                     onFocus={()=>handleError(false,'fileShopAct','')}
                    multiple type="file" onChange={handleShopAct} hidden accept="image/*"></input>
                        Upload Shop Act
                        </Button>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{resError?.fileShopAct?.message}</div>
                    </Grid>

                    <Grid item xs={4} >
                    <Button component="label" variant="contained" endIcon={<UploadFile/>}fullWidth >
                    <input
                    onFocus={()=>handleError(false,'fileLogo','')}
                    multiple type="file" onChange={handlelogo} hidden accept="image/*"></input>
                        Upload Logo
                        </Button>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{resError?.fileLogo?.message}</div>
                    </Grid>

                     <Grid item xs={4} className={classes.center}>
                         <Avatar
                            alt="Remy Sharp"
                            src={fileFssai.url}
                            sx={{ width: 56, height: 56 }}
                        />
                    </Grid>
                    <Grid item xs={4} className={classes.center}>
                         <Avatar
                            alt="Remy Sharp"
                            src={fileShopAct.url}
                            sx={{ width: 56, height: 56 }}
                        />     
                    </Grid>
                    <Grid item xs={4} className={classes.center}>
                          <Avatar
                            alt="Remy Sharp"
                            src={fileLogo.url}
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