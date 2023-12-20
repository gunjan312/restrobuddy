import { useState,useEffect } from "react"
import MaterialTable from "@material-table/core"
import { makeStyles } from "@mui/styles"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Avatar, Grid, TextField, Button, Select, FormHelperText } from "@mui/material"
import Heading from "../../components/heading/Heading"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import UploadFile from '@mui/icons-material/UploadFile'
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { getData, serverURL, postData } from "../../Services/FetchNodeServices"


const useStyles = makeStyles({
    rootdisplay:{width :"auto", height:"100%", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    boxdisplay: {width:"80%", height:"auto", background:"#d2dae2", borderRadius:10, padding:15},
    root:{width :"100vw", height:"auto", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
    
})

export default function DisplayAllRestaurant()
    { var classes = useStyles()
      var navigate = useNavigate()

        const[listRestaurant, setListRestaurant]= useState([])
        const[open, setOpen]= useState(false)

        ///////////////////////// Restaurant Data ///////////////////////////////////
        const[restaurantId, setRestaurantId]= useState('')
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
        const[btnStatus, setBtnStatus]= useState({fssai:false, shopact:false, lofo:false})
        const[tempFile, setTempFile]= useState({fssai:"", shopAct:"", logo:"" })
    
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
          setBtnStatus((prev)=>({...prev, fssai:true}))
       }
       const handleShopAct=(event)=>{
          setFileShopAct({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
          setBtnStatus((prev)=>({...prev, shopact:true}))
       }
       const handlelogo=(event)=>{
          setFileLogo({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
          setBtnStatus((prev)=>({...prev, logo:true}))
       }
  
       const handleSubmit=async()=>{
          var error = validation()
          if(error){
          var d = new Date()
          var cd = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
          var body = {'restaurantname':restaurantName,'ownername': ownerName,'stateid': stateid,'cityid': cityid,
          'phonenumber': phoneNumber,'mobilenumber':mobileNumber,'emailid':emailAddress,'address':address,'fssainumber':fssaiNumber,
          'gstnumber':gstNumber,'gsttype': gstType,'url':url,'updatedat':cd, 'restaurantid':restaurantId}
          var result = await postData('restaurant/restaurant_edit_data',body)
          
  
          if(result.status){
          Swal.fire({
              icon: 'success',
              title: 'Restaurant Registeration',
              text: result.message,
              position:'top-end',
              timer:5000,
              showConfirmButton:false,
              toast:true
              
            })
            //setOpen(false)
          }
          else{
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  position:'top-end',
                timer:5000,
                showConfirmButton:false,
                toast:true
                })
            //setOpen(false)
          }
      } 
      
    } 
   ////////////////////////////////////////////////////////////////////////////////////

        const editDeleteButton=(imgStatus)=>{
            return(
                <div>
                    <Button onClick={()=>editImage(imgStatus)}>Edit</Button>
                    <Button onClick={()=>handleCancel(imgStatus)}>Cancel</Button>
                </div>
            )
        }

        const handleCancel=(imgStatus)=>{
            if(imgStatus==1){
                setBtnStatus((prev)=>({...prev, fssai:false}))
                setFileFssai({url:tempFile.fssai, bytes:""})
        }
        else if(imgStatus==2){
            setBtnStatus((prev)=>({...prev, shopact:false}))
            setFileShopAct({url:tempFile.shopAct, bytes:""})
         }
        else if(imgStatus==3){
            setBtnStatus((prev)=>({...prev, logo:false}))
            setFileLogo({url:tempFile.logo, bytes:""})
    }
        }



        const editImage=async(imgStatus)=>{
            if(imgStatus==1){
            var formData = new FormData()
            formData.append('filefssai', fileFssai.bytes)
            formData.append('restaurantid', restaurantId)

            var result = await postData('restaurant/restaurant_edit_fssai', formData)
            setBtnStatus(false)
            if(result.status){
                Swal.fire({
                    icon: 'success',
                    title: 'Restaurant Registeration',
                    text: result.message,
                    position:'top-end',
                    timer:5000,
                    showConfirmButton:false,
                    toast:true
                    
                  })
                 // setOpen(false)
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        position:'top-end',
                        timer:5000,
                        showConfirmButton:false,
                        toast:true
                      })
                 //setOpen(false)
                }
                
            } 

            else if(imgStatus==2){
                var formData = new FormData()
                formData.append('fileshopact', fileShopAct.bytes)
                formData.append('restaurantid', restaurantId)
    
                var result = await postData('restaurant/restaurant_edit_shopact', formData)
                setBtnStatus(false)
                if(result.status){
                    Swal.fire({
                        icon: 'success',
                        title: 'Restaurant Registeration',
                        text: result.message,
                        position:'top-end',
                        timer:5000,
                        showConfirmButton:false,
                        toast:true
                        
                      })
                      //setOpen(false)
                    }
                    else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            position:'top-end',
                            timer:5000,
                            showConfirmButton:false,
                            toast:true
                          })
                    // setOpen(false)
                    }
                    
                } 

               else if(imgStatus==3){
                    var formData = new FormData()
                    formData.append('filelogo', fileLogo.bytes)
                    formData.append('restaurantid', restaurantId)
        
                    var result = await postData('restaurant/restaurant_edit_logo', formData)
                    setBtnStatus(false)
                    if(result.status){
                        Swal.fire({
                            icon: 'success',
                            title: 'Restaurant Registeration',
                            text: result.message,
                            position:'top-end',
                            timer:5000,
                            showConfirmButton:false,
                            toast:true
                            
                          })
                          //setOpen(false)
                        }
                        else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!',
                                position:'top-end',
                                timer:5000,
                                showConfirmButton:false,
                                toast:true
                              })
                        // setOpen(false)
                        }
                        
                    } 
        }
            
          
        


        const fetchAllRestaurant = async() =>{
            var result = await getData('restaurant/fetch_all_restaurant')
            setListRestaurant (result.data)
        }

        const deleteRestaurant=async(rowData)=>{
            Swal.fire({
                title: 'Do you want to delete the restaurant?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                denyButtonText: `Don't delete`,
              }).then(async(result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    var body = {'restaurantid':rowData.restaurantid}
                    var result = await postData('restaurant/restaurant_delete', body)
                    if(result.status){
                        Swal.fire('Deleted!', '', result.message)
                    }
                    else{
                        Swal.fire('Fail!', '', result.message)
                    }
                  
                } else if (result.isDenied) {
                  Swal.fire('Restaurant not delete', '', 'info')
                }
              })
              fetchAllRestaurant()
        }

        const handleEdit =(rowData)=>{
            fetchAllCities(rowData.stateid)
          setRestaurantName(rowData.restaurantname)
          setOwnerName(rowData.ownername)
          setPhoneNumber(rowData.phonenumber)
          setMobileNumber(rowData.mobilenumber)
          setEmailAddress(rowData.emailid)
          setStateid(rowData.stateid)
          setCityid(rowData.cityid)
          setUrl(rowData.url)
          setFssaiNumber(rowData.fssainumber)
          setGstNumber(rowData.gstnumber)
          setGstType(rowData.gsttype)
          setFileFssai({url:`${serverURL}/images/${rowData.filefssai}`, bytes:""})
          setFileShopAct({url:`${serverURL}/images/${rowData.fileshopact}`, bytes:""})
          setFileLogo({url:`${serverURL}/images/${rowData.filelogo}`, bytes:""})
          setAddress(rowData.address)
          setRestaurantId(rowData.restaurantid)
          setTempFile({fssai:`${serverURL}/images/${rowData.filefssai}`, bytes:"", shopAct:`${serverURL}/images/${rowData.fileshopact}`, bytes:"", logo:`${serverURL}/images/${rowData.filelogo}`, bytes:""})

          setOpen(true)
        }

        const handleDialogClose = ()=>{
          setOpen(false)
          fetchAllRestaurant()
        }

        

        const showDataForEdit=(rowData)=>{
          return(
            <Dialog open={open} maxWidth={'md'}>
              
              <DialogContent>
                {showData()}
                </DialogContent>
              <DialogActions>
              <Button onClick={handleSubmit}>Edit</Button>
                <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
          )
        }

        const showData=()=>{
          return(
            <div> 
                <div>
                    <Grid container spacing={2}>
    
                        <Grid item xs={12}>
                            <Heading title={"Restaurant Register"}/>
                        </Grid>
    
                        <Grid item xs={6}>
                            <TextField 
                            onFocus={()=>handleError(false,'restaurantName','')}
                            error={resError?.restaurantName?.error}
                            helperText={resError?.restaurantName?.message}
                            label="Restaurant Name" fullWidth onChange={(event)=>setRestaurantName(event.target.value)} value={restaurantName}/>
                            
                        </Grid>
    
                        <Grid item xs={6}>
                            <TextField
                            onFocus={()=>handleError(false,'ownerName','')}
                            error={resError?.ownerName?.error}
                            helperText={resError?.ownerName?.message}
                            label="Owner Name" fullWidth onChange={(event)=>setOwnerName(event.target.value)} value={ownerName} />
                        </Grid>
    
                        <Grid item xs={4}>
                            <TextField label="Phone Number" fullWidth onChange={(event)=>setPhoneNumber(event.target.value)} value={phoneNumber} />
                        </Grid>
    
                        <Grid item xs={4}>
                            <TextField
                             onFocus={()=>handleError(false,'mobileNumber','')}
                             error={resError?.mobileNumber?.error}
                             helperText={resError?.mobileNumber?.message}
                            label="Mobile Number" fullWidth onChange={(event)=>setMobileNumber(event.target.value)} value={mobileNumber} />
                        </Grid>
    
                        <Grid item xs={4}>
                            <TextField
                            onFocus={()=>handleError(false,'emailAddress','')}
                            error={resError?.emailAddress?.error}
                            helperText={resError?.emailAddress?.message}
                            label="Email Address" fullWidth onChange={(event)=>setEmailAddress(event.target.value)} value={emailAddress} />
                        </Grid>
    
                        <Grid item xs={12}>
                            <TextField 
                            onFocus={()=>handleError(false,'address','')}
                            error={resError?.address?.error}
                            helperText={resError?.address?.message}
                            label="Address" fullWidth onChange={(event)=>setAddress(event.target.value)} value={address}/>
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
                                label="City" value={cityid} onChange={handleCityChange}>
                                    <MenuItem>-Select City-</MenuItem>
                                    {fillCity()}
                                </Select>
                            </FormControl>
                            <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{resError?.cityid?.message}</div>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label="URL" fullWidth onChange={(event)=>setUrl(event.target.value)} value={url} />
                        </Grid>
    
                        <Grid item xs={4}>
                            <TextField
                            onFocus={()=>handleError(false,'fssaiNumber','')}
                            error={resError?.fssaiNumber?.error}
                            helperText={resError?.fssaiNumber?.message}
                            label="Fssai Number" fullWidth onChange={(event)=>setFssaiNumber(event.target.value)} value={fssaiNumber} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                             onFocus={()=>handleError(false,'gstNumber','')}
                             error={resError?.gstNumber?.error}
                             helperText={resError?.gstNumber?.message}
                            label="GST Number" fullWidth onChange={(event)=>setGstNumber(event.target.value)} value={gstNumber} />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel>GST Type</InputLabel>
                                <Select label="GST Type" onChange={(event)=>setGstType(event.target.value)} value={gstType}>
                                    <MenuItem value="5 star">5 Star</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
    
                        <Grid item xs={4}>
                        <Button component="label" variant="contained" endIcon={<UploadFile/>} fullWidth>
                        <input
                        onFocus={()=>handleError(false,'fileFssai','')}
                        multiple type="file"  onChange={handleFssai} hidden accept="image/*"></input>
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
                            <div>{btnStatus.fssai?editDeleteButton(1):<></>}</div>
                        </Grid>
                        <Grid item xs={4} className={classes.center}>
                             <Avatar
                                alt="Remy Sharp"
                                src={fileShopAct.url}
                                sx={{ width: 56, height: 56 }}
                            /> 
                            <div>{btnStatus.shopact?editDeleteButton(2):<></>}</div>    
                        </Grid>
                        <Grid item xs={4} className={classes.center}>
                              <Avatar
                                alt="Remy Sharp"
                                src={fileLogo.url}
                                sx={{ width: 56, height: 56 }}
                            />
                            <div>{btnStatus.logo?editDeleteButton(3):<></>}</div>
                        </Grid>
                    
                    </Grid>
                </div>
            </div>
        )
        }


        useEffect(function(){
            fetchAllRestaurant()
        },[])
      function displayAll() {
        return (
          <MaterialTable
            title="Restaurant List"
            columns={[
              { title: 'Restaurant/Owner Name',
            render:rowData=><><div>{rowData.restaurantname}/{rowData.ownername}</div></> },
              { title: 'Contact',
              render:rowData=><><div>{rowData.phonenumber}</div><div>{rowData.mobilenumber}</div><div>{rowData.emailid}</div></> },
              { title: 'Address',
              render:rowData=><><div>{rowData.address}</div><div>{rowData.cityname}/{rowData.statename}</div></>},
              { title: 'Documents', 
              render:rowData=><><div>GST:{rowData.gstnumber}/{rowData.gsttype}</div><div>Fssai:{rowData.fssainumber}</div></> },
              { title: 'Website', 
              render:rowData=><><div><a href="{rowdata.url}" style={{textDecoration:'none', color:'black'}}>Visit</a></div></> },
              { title: 'Logo', 
              render:rowData=><><div><img src={`${serverURL}/images/${rowData.filelogo}`} style={{width:50, height:50, borderRadius:10}}></img></div></> },
            ]}
            data={listRestaurant}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Restaurant',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Restaurant',
                onClick: (event, rowData) => deleteRestaurant(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Restaurant',
                isFreeAction: true,
                onClick: (event) => navigate('/dashboard/restaurantinterface')
              }
            ]}
            options={{
                paging:true,
                pageSize:3,       // make initial page size
                emptyRowsWhenPaging: false,   // To avoid of having empty rows
                pageSizeOptions:[3,5,7],    // rows selection options
              }}   
          />
        )
        
      }
      
    return(
        <div className={classes.rootdisplay}>
            <div className={classes.boxdisplay}>
          {displayAll()}
          </div>
          {showDataForEdit()}  
        </div>
    )
}