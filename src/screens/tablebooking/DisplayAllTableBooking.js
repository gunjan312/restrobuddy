import { useState,useEffect } from "react"
import MaterialTable from "@material-table/core"
import { makeStyles } from "@mui/styles"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Avatar, Grid, TextField, Button, Select, FormHelperText } from "@mui/material"
import{ FormLabel,RadioGroup, FormControlLabel, Radio} from "@mui/material"
import Heading from "../../components/heading/Heading"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import UploadFile from '@mui/icons-material/UploadFile'
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { getData, serverURL, postData } from "../../Services/FetchNodeServices"

var useStyles = makeStyles({
    rootdisplay:{width :"auto", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    boxdisplay: {width:"60vw", height:"auto", background:"#d2dae2", borderRadius:10, padding:15},
    root:{width :"100vw", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})



export default function DisplayAllTableBooking(){
    var classes = useStyles()
    var navigate = useNavigate()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[tableBookingList, setTableBookingList] = useState([])
    const[tableId, setTableId] = useState('')
    const[open, setOpen] = useState(false)
//////////////////////// Table Booking Interface Data /////////////////////////////////////
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




    const fetchALLTableBooking=async()=>{
        var result = await postData('tablebooking/fetch_all_tablebooking', {'restaurantid':admin.restaurantid})
        setTableBookingList(result.data)
    }

    useEffect(function(){
        setRestaurantId(admin.restaurantid)
        fetchALLTableBooking()
    },[])

    const handleTableBookingDelete=async(rowData)=>{
        Swal.fire({
            title: 'Do you want to delete the Table Booking?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
          }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                var body = {'tableid':rowData.tableid}
                var result = await postData('tablebooking/tablebooking_delete', body)
                if(result.status){
                    Swal.fire(result.message)
                    fetchALLTableBooking()
                  }
                  else{
                    Swal.fire('Fail!', '', result.message)
                  }
                  
                }
            else if (result.isDenied) {
            Swal.fire('Food Item not deleted', '', 'info')
                 }
              })
            
    }


    const handleEdit=(rowData)=>{
        setRestaurantId(rowData.restaurantid)
        setTableNo(rowData.tableno)
        setTableId(rowData.tableid)
        setNoOfChairs(rowData.noofchairs)
        setFloor(rowData.floor)
        setOpen(true)
    }


    const handleTableBookingEdit=async()=>{
        var error = validation()
        if(error){
        var body = {'restaurantid': restaurantId, 'tableno': tableNo, 'noofchairs': noOfChairs, 'floor': floor, 'tableid':tableId }
        var result = await postData('tablebooking/tablebooking_edit_data', body)
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
        fetchALLTableBooking()
    }

    const handleDialogClose=()=>{
        setOpen(false)
    }


    const showTableBookingForEdit=()=>{
        return(
        <Dialog open={open} maxWidth='md'>
             <DialogContent>
                {showTableBookingData()}
          </DialogContent>
        <DialogActions>
        <Button variant="contained" onClick={handleTableBookingEdit}>Edit</Button>
          <Button variant="contained" onClick={handleDialogClose} >Close</Button>
          </DialogActions>
        </Dialog>
        )
    }


    function showTableBookingData(){
        return(
            <div>
                <div>
                        <Grid container spacing={4}>
    
                            <Grid item xs={12}>
                                <Heading title={"Table Booking"} fullWidth/>
                            </Grid>
    
                            <Grid item xs={6}>
                                <TextField  
                                
                                label="Restaurant ID"  value={restaurantId} fullWidth/>
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
                                    <MenuItem value="Ground Floor">Ground Floor</MenuItem>
                                    <MenuItem value="First Floor">First Floor</MenuItem>
                                    <MenuItem value="Second Floor">Second Floor</MenuItem>
                                    <MenuItem value="Third Floor">Third Floor</MenuItem>
                                    <MenuItem value="Fourth Floor">Fourth Floor</MenuItem>
                                    <MenuItem value="Fifth Floor">Fifth Floor</MenuItem>
                                    <MenuItem value="Sixth Floor">Sixth Floor</MenuItem>
                                    <MenuItem value="Seventh Floor">Seventh Floor</MenuItem>
                                    <MenuItem value="Eighth Floor">Eighth Floor</MenuItem>
                                    <MenuItem value="Nineth Floor">Nineth Floor</MenuItem>
                                    <MenuItem value="Tenth Floor">Tenth Floor</MenuItem>
                                    <MenuItem value="Roof Top">Roof Top</MenuItem>
     
                                   
                                </Select>
                            </FormControl>
                            <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{tableBookingError?.floor?.message}</div>
                        </Grid>
    
    
                        </Grid>
                </div>
            </div>
        )
    }


    function displayTableBooking() {
        return (
          <MaterialTable
            title="List Of Table Bookings"
            columns={[
              { title: 'Restaurant ID/Name', 
              render:rowData=><><div>{rowData.restaurantid}/{rowData.restaurantname}</div></> },

              { title: 'Table Number',
              render:rowData=><div>{rowData.tableno}</div>},

              { title: 'No. of Chairs',
              render:rowData=><div>{rowData.noofchairs}</div>},

              {title: 'Floor',
              render:rowData=><div>{rowData.floor}</div> },
            ]}
            data={tableBookingList}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Booking',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Table Booking',
                onClick: (event, rowData) => handleTableBookingDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Table Booking',
                isFreeAction: true,
                onClick: (event) => navigate('/admindashboard/tablebookinginterface')
              }
            ]}
          />
        )
      }


    return(
        <div className={classes.rootdisplay}>
            <div className={classes.boxdisplay}>
                {displayTableBooking()}
            </div>
            {showTableBookingForEdit()}
        </div>
    )
}