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
    boxdisplay: {width:"90%", height:"auto", background:"#d2dae2", borderRadius:10, padding:15},
    root:{width :"100vw", height:"auto", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
    
})

export default function DisplayAllWaiters(){
    var classes = useStyles()
    var navigate = useNavigate()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[waiterList, setWaiterList] = useState([])
    const[open, setOpen] = useState(false)

    ////////////////////////////////////////////// Waiter Interface Data //////////////////////////////////////////////
    const[restaurantid, setRestaurantid] = useState('')
    const[waiterName, setWaiteName] = useState('')
    const[waiterid, setWaiterid] = useState('')
    const[gender, setGender] = useState('')
    const[dob, setDob] = useState('')
    const[mobileNo, setMobileNo] = useState('')
    const[emailid, setEmailid] = useState('')
    const[address, setAddress] = useState('')
    const[picture, setPicture]= useState({url:'', bytes:''})
    const[waiterError, setWaiterError]= useState({})
    const[tempFile, setTempFile]= useState({picture:''})
    const[btnStatus, setBtnStatus] = useState(false)

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
        if(dob.trim().length==0)
        {
            handleError(true, 'dob', 'Please select Date Of Birth')
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
    
    
    const handlePicture=(event)=>{
        setPicture({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
        setBtnStatus(true)
     }
    
     const handleEditSubmit =async()=>{
    
        var error = validation()
        if(error){
       var body = {'waiterid':waiterid, 'restaurantid':restaurantid, 'waitername':waiterName, 'gender':gender, 'dob':dob, 'mobileno':mobileNo,
                    'emailid': emailid, 'address':address}
     var result = await postData('waiter/waiter_edit_data', body)
        if(result.status){
            Swal.fire({
                icon: 'success',
                title: 'Waiter Registeration',
                text: result.message,
                position:'top-end',
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
                    position:'top-end',
                    timer:5000,
                    showConfirmButton:false,
                    toast:true
                  })
            }
        }
        fetchAllWaiters()
     }

     
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////Code To Delete Waiter Record///////////////////////////////////
     const handleDeleteRecord=async(rowData)=>{
        Swal.fire({
            title: 'Do you want to delete the Waiter Record?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
          }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                var body = {'waiterid':rowData.waiterid}
                var result = await postData('waiter/waiter_delete_data', body)
                if(result.status){
                    Swal.fire(result.message)
                    fetchAllWaiters()
                }
                else{
                    Swal.fire(result.message)
                }
              
            } else if (result.isDenied) {
              Swal.fire('Waiter Record not delete', '', 'info')
            }
          })
       
     }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleDialogClose=()=>{
        setOpen(false)
    }

    //////////////////////////////////// Code For Edit Image///////////////////////////////////////////////////////
     const editImage=async()=>{
        var formData = new FormData()
        formData.append('picture', picture.bytes)
        formData.append('waiterid',waiterid)
        var result = await postData('waiter/waiter_edit_picture', formData)
        setBtnStatus(false)
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

            fetchAllWaiters()
     }

     const handleCancel=()=>{
        setPicture({url:tempFile.picture, bytes:""})
        setBtnStatus(false)
     }

     const handleEditDeleteButton=()=>{
        return(
            <div>
                <Button onClick={editImage}>Edit</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
            </div>
        )
     }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fetchAllWaiters =async()=>{
        var result = await postData('waiter/fetch_all_waiter', {'restaurantid':admin.restaurantid})
        setWaiterList(result.data)
    }

    useEffect(function(){
        setRestaurantid(admin.restaurantid)
        fetchAllWaiters()
    },[])

    const handleEdit=(rowData)=>{
        setRestaurantid(rowData.restaurantid)
        setWaiteName(rowData.waitername)
        setWaiterid(rowData.waiterid)
        setGender(rowData.gender)
        setDob(rowData.dob)
        setMobileNo(rowData.mobileno)
        setEmailid(rowData.emailid)
        setAddress(rowData.address)
        setPicture({url:`${serverURL}/images/${rowData.picture}`, bytes:""})
        setTempFile({picture:`${serverURL}/images/${rowData.picture}`,bytes:""})
        setOpen(true)
    }

    const showDataForEdit=()=>{
        return(
            <Dialog open={open} maxWidth='md'>
             <DialogContent>
                {editWaiterData()}
          </DialogContent>
        <DialogActions>
        <Button variant="contained" onClick={handleEditSubmit}>Edit</Button>
          <Button variant="contained" onClick={handleDialogClose}>Close</Button>
          </DialogActions>
        </Dialog>
        )
    }

    function editWaiterData(){
        return(
            <div>
                <div>
                    <Grid container spacing={2}>
    
                        <Grid item xs={12}>
                            <Heading title={"Waiter Registeration"}/>
                        </Grid>
    
                        <Grid item xs={12}>
                            <TextField 
                           
                            label="Restaurant ID"  value={restaurantid} fullWidth />
                        </Grid>
    
                        <Grid item xs={4}>
                            <TextField 
                            onFocus={()=>handleError(false,'waiterName','')}
                            error={waiterError?.waiterName?.error}
                            helperText={waiterError?.waiterName?.message}
                            label="Waiter Name"  onChange={(event)=>setWaiteName(event.target.value)} value={waiterName} fullWidth/>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                            onFocus={()=>handleError(false,'gender','')}
                            error={waiterError?.gender?.error}
                            helperText={waiterError?.gender?.message}
                            label="Gender"  onChange={(event)=>setGender(event.target.value)} value={gender} fullWidth />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField 
                             onFocus={()=>handleError(false,'dob','')}
                             error={waiterError?.dob?.error}
                             helperText={waiterError?.dob?.message}
                            label="DOB"  onChange={(event)=>setDob(event.target.value)} value={dob} fullWidth />
                            
                        </Grid>
    
                        <Grid item xs={4}>
                            <TextField 
                             onFocus={()=>handleError(false,'mobileNo','')}
                             error={waiterError?.mobileNo?.error}
                             helperText={waiterError?.mobileNo?.message}
                            label="Mobile Number"  onChange={(event)=>setMobileNo(event.target.value)} value={mobileNo} fullWidth />
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
                            label="Address"  onChange={(event)=>setAddress(event.target.value)} value={address} fullWidth />
                        </Grid>
    
                        <Grid item xs={6} >
                        <Button component="label" variant="contained" endIcon={<UploadFile/>}fullWidth >
                        <input
                        onFocus={()=>handleError(false,'picture','')}
                        multiple type="file" onChange={handlePicture} hidden accept="image/*"></input>
                            Upload Picture
                            </Button>
                            <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{waiterError?.picture?.message}</div>
                        </Grid>
                        <Grid item xs={4}>
                             <Avatar
                                alt="Remy Sharp"
                                src={picture.url}
                                sx={{ width: 56, height: 56 }}
                                />
                                <div>{btnStatus?handleEditDeleteButton():<></>}</div>
                                </Grid>
                                
                               
                           
    
    
                    </Grid>
                </div>
            </div>
        )
    }

    function displayWaiterData() {
        return (
          <MaterialTable
            title="Waiters List"
            columns={[
              { title: 'Restaurant ID',
                 render:rowData=><div>{rowData.restaurantid}</div>},

              { title: 'Name',
              render:rowData=><div>{rowData.waitername}</div>},

              { title: 'Gender',
              render:rowData=><div>{rowData.gender}</div>},
              {
                title: 'Date of Birth',
                render:rowData=><div>{rowData.dob}</div>
              },

              {
                title: 'Mobile Number',
                render:rowData=><div>{rowData.mobileno}</div>
              },
              {
                title: 'Email Id',
                render:rowData=><div>{rowData.emailid}</div>
              },
              {
                title: 'Address',
                render:rowData=><div>{rowData.address}</div>
              },
              {title : 'Picture',
              render:rowData=><><div><img src={`${serverURL}/images/${rowData.picture}`} style={{width:50, height:50, borderRadius:10}}></img></div></> }
            ]}
            data={waiterList}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Waiter',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Waiter',
                onClick: (event, rowData) => handleDeleteRecord(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Waiters',
                isFreeAction: true,
                onClick: (event) => navigate('/admindashboard/waiterinterface')
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
                {displayWaiterData()}
            </div>
            {showDataForEdit()}
        </div>
    )
}