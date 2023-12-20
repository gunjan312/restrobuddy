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

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { getData, serverURL, postData } from "../../Services/FetchNodeServices"

var useStyles = makeStyles({
    rootfooditem:{width :"80vw", height:"91vh", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b", },
    boxfooditem: {display:"flex", justifyContent:"center",width:"60vw", height:"auto", background:"#d2dae2", borderRadius:10, padding:15},
    root:{width :"100vw", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})



export default function DisplayAllWaiterTable(){
    var classes = useStyles()
    var navigate = useNavigate()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[waiterTableList, setWaiterTableList] = useState([])
    const[open, setOpen] = useState(false)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const[restaurantid, setRestaurantid] = useState('')
    const[waiterid, setWaiterid] = useState('')
    const[waiterName, setWaiterName] = useState([])
    const[tableno, setTableno] = useState([])
    const[tableid, setTableid] = useState('')
    const[floor, setFloor] = useState([])
    const[floorNo, setFloorNo] = useState('')
    const[currentDate, setCurrentDate] = useState('')
    const[waiterTableid, setWaiterTableid] = useState('')
    const[waiterTableError, setWaiterTableError]= useState({})

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

    const handleEditSubmit =async()=>{
        var error = validation()
        if(error){
        var d = new Date()
        var cd = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
        var body = {'restaurantid':restaurantid, 'waiterid':waiterid, 'tablenoid':tableid, 'tableid':tableno, 'currentdate':currentDate, 'floor':floorNo, 'waitertableid':waiterTableid}
        var result = await postData('waitertable/waitertable_data_edit', body)
        
        if(result.status){
            Swal.fire({
                icon: 'success',
                title: 'Assigning Waiter and Table',
                text: result.message,
                position:'center',
                timer:2000,
                showConfirmButton:false,
                toast:true
                
              })
              fetchAllWaiterTable()
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


    const handleDeleteWaiterTable=(rowData)=>{
        Swal.fire({
            title: 'Do you want to delete the restaurant?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
          }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                var body = {'waitertableid':rowData.waitertableid}
                var result = await postData('waitertable/waitertable_delete_data', body)
                if(result.status){
                    Swal.fire(result.message)
                    fetchAllWaiterTable()
                }
                else{
                    Swal.fire('Fail!', '', result.message)
                }
              
            } else if (result.isDenied) {
              Swal.fire('Waiter Table not delete', '', 'info')
            }
          })
         
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleDialogClose=()=>{
        setOpen(false)
    }

     ///////////////////////////////////////////// Fetch Waiter Name and id //////////////////////////////////////////////
     const fetchAllWaiters = async(restaurantid)=>{
        var  body ={restaurantid:restaurantid}
         var result = await postData('waitertable/fetch_waiter', body)
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
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const handleDate=(event)=>{
        const m=String(Number(event.$M)+1);
        const d=String(event.$D);
        const y=String(event.$y);
        setCurrentDate(y+"-"+m+"-"+d);   
      }


    


    const fetchAllWaiterTable=async()=>{
        var result = await postData('waitertable/fetch_all_waitertable', {'restaurantid':admin.restaurantid})
        setWaiterTableList(result.data)
    }

    useEffect(function(){
        fetchAllWaiterTable()
    },[])

    useEffect(function(){
        fetchAllWaiters()
        fetchAllFloor()
        fetchAllTables()       
        setRestaurantid(admin.restaurantid)       
    },[])

    const handleEdit=(rowData)=>{
        fetchAllWaiters(rowData.restaurantid)               
        fetchAllTables(rowData.floor)
        setRestaurantid(rowData.restaurantid)
        setWaiterid(rowData.waiterid)
        setFloorNo(rowData.floor)
        setTableid(rowData.tablenoid)
        setCurrentDate(rowData.currentdate)
        setWaiterTableid(rowData.waitertableid)       
        setOpen(true)
    }

    const showDataEditDialog=()=>{
        return(
            <Dialog open={open} maxWidth='md'>
            <DialogContent>
               {showDataForEdit()}
         </DialogContent>
       <DialogActions>
       <Button variant="contained" onClick={handleEditSubmit}>Edit</Button>
         <Button variant="contained" onClick={handleDialogClose}>Close</Button>
         </DialogActions>
       </Dialog>
        )
    }

    function showDataForEdit(){
        return(
            <div >
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Heading title={"Assign Waiter Table"}/>
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
                                     format="DD-MM-YYYY"  onChange={handleDate} />
                                </DemoContainer>
                        </LocalizationProvider>
                        </Grid>        
    
                        
    
                    </Grid>
                </div>
            </div>
        )
    }


    function displayWaiterTable() {
        return (
          <MaterialTable
            title="List of Waiter and Table"
            columns={[
              { title: 'Restaurant ID/Name', 
              render:rowData=><><div>{rowData.restaurantid}/{rowData.restaurantname}</div></> },

              { title: 'Waiter ID/Waiter Name',
              render:rowData=><><div>{rowData.waiterid}/{rowData.waitername}</div></>},

              { title: 'Table ID/Number',
              render:rowData=><><div><b>Table ID:</b> {rowData.tablenoid}</div><div><b>Table No:</b> {rowData.tableno}</div><div><b>Floor No:</b> {rowData.floor}</div></>},

              {title: 'Assigned Date',
              render:rowData=><div>{rowData.currentdate}</div> },
            ]}
            data={waiterTableList}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Assigned Waiter & Table',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Assigned Waiter & Table ',
                onClick: (event, rowData) => handleDeleteWaiterTable(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Waiter and Table',
                isFreeAction: true,
                onClick: (event) => navigate('/admindashboard/waitertableinterface')
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
        <div className={classes.rootfooditem}>
            <div className={classes.boxfooditem}>
                {displayWaiterTable()}
            </div>
            {showDataEditDialog()}
        </div>
    )
}