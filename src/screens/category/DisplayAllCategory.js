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

var useStyles = makeStyles({
    rootcategory:{width :"80vw", height:"80vh", display:"flex", justifyContent:"center", alignItems:"center",background:"808e9b" },
    boxcategory: {width:"60vw", height:"auto", background:"#d2dae2", borderRadius:10, padding:15,},
    root:{width :"100vw", height:"auto", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})


export default function DisplayAllCategory(){
    var classes = useStyles()
    var navigate = useNavigate()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[categoryList, setCategoryList]= useState([])
    const[open, setOpen] = useState(false)

    /////////////////////////////////// CategoryInterface Data//////////////////////////////////////////
    const[categoryId, setCategoryId] = useState('')
    const[restaurantId, setRestaurantId]= useState('')
    const[categoryName, setCategoryName]= useState('')
    const[fileIcon, setFileIcon]= useState({url:'', bytes:''})
    const[btnStatus, setBtnStatus]= useState(false)
    const[tempFile, setTempFile]= useState({icon:''})
    const[tempFileIcon , setTempFileIcon] = useState('')
    const[categoryError, setCategoryError]= useState({})

    

    const handleError=(error, input, message)=>{
        setCategoryError(prevState =>({...prevState, [input]:{'error':error, 'message':message}}))
      }


        const validation =()=>{
          var submitRecord = true
          if(restaurantId.length==0)
          {
              handleError(true, 'restaurantId', 'Please enter Restaurant ID')
              submitRecord = false
          }
          if(categoryName.trim().length==0)
          {
              handleError(true, 'categoryName', 'Please enter Category name')
              submitRecord = false
          }
          return submitRecord
      }

      

    const handleIcon=(event)=>{
        setFileIcon({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
       setBtnStatus(true)
    }

    


    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleCancel=()=>{
      setBtnStatus(false)
      setFileIcon({url:tempFile.icon, bytes:tempFile.bytes})
    }


    const editCategoryData=async()=>{ 
      var error = validation()
      if(error){     
      var formData = new FormData()
      formData.append('categoryid', categoryId)
      formData.append('restaurantid', restaurantId)
      formData.append('categoryname', categoryName)
      formData.append('tempFileIcon', tempFileIcon)
      formData.append('icon', fileIcon.bytes)
      
      var result = await postData('category/category_edit_data',formData)
      setBtnStatus(false)
      if(result.status){
        Swal.fire({
            icon: 'success',
            title: 'Category Registeration',
            text: result.message,
            position:'center',
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
                position:'center',
                timer:5000,
                showConfirmButton:false,
                toast:true
              })
         //setOpen(false)
        }
      }
        fetchAllCategory()
    }


    const handleCategoryDelete=async(rowData)=>{
      Swal.fire({
        title: 'Do you want to delete the category?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Don't delete`,
      }).then(async(result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          var body = {'categoryid': rowData.categoryid}
          var result = await postData('category/category_delete', body)
          if(result.status){
            Swal.fire(result.message)
            fetchAllCategory()
          }
          else{
            Swal.fire('Fail!', '', result.message)
          }
          
        } else if (result.isDenied) {
          Swal.fire('Category not deleted', '', 'info')
        }
      })
      
    }

    const editDeleteButton=()=>{
      return(
        <div>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      )
    }

    

    const fetchAllCategory=async()=>{
        var result = await postData('category/fetch_all_category',{'restaurantid':admin.restaurantid})
        setCategoryList(result.data)
    }   

    const handleDialogClose=()=>{
        setOpen(false)
    }

    const handleEdit=(rowData)=>{
        setRestaurantId(rowData.restaurantid)
        setCategoryName(rowData.categoryname)
        setCategoryId(rowData.categoryid)
        setFileIcon({url:`${serverURL}/images/${rowData.icon}`, bytes:""})
        setTempFile({icon:`${serverURL}/images/${rowData.icon}`,bytes:""})
        setTempFileIcon(rowData.icon)
        setOpen(true)
    }

    const showCategoryForEdit=()=>{
        return(
            <Dialog open={open}>
              
            <DialogContent>
              {showCategoryData()}
              </DialogContent>
            <DialogActions>
            <Button variant="contained" onClick={editCategoryData}>Edit</Button>
              <Button variant="contained" onClick={handleDialogClose}>Close</Button>
              </DialogActions>
          </Dialog>
        )
    }

    const showCategoryData=()=>{
        return(
            <div>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <Heading title={"Category Register"}/>
                        </Grid>
    
                        <Grid item xs={12} >
                            <TextField 
                              label="Restaurant ID" value={restaurantId} fullWidth/>
                        </Grid>
    
                        <Grid item xs={12} >
                            <TextField 
                            onFocus={()=>handleError(false,'categoryName','')}
                            error={categoryError?.categoryName?.error}
                            helperText={categoryError?.categoryName?.message}
                            label="Category Name" onChange={(event)=>setCategoryName(event.target.value)} value={categoryName} fullWidth/>
                        </Grid>
    
                        <Grid item xs={12} >
                        <Button component="label" variant="contained" endIcon={<UploadFile/>} fullWidth>
                        <input
                        multiple type="file" onChange={handleIcon} hidden accept="image/*"></input>
                            Upload Icon
                            </Button>
                        </Grid>
                        <Grid item xs={4} className={classes.center}>
                             <Avatar 
                                alt="Remy Sharp"
                                src={fileIcon.url}
                                sx={{ width: 56, height: 56 }}
                            />
                           <div>{btnStatus?editDeleteButton():<></>}</div>
                        </Grid>
    
    
                    </Grid>
                </div>
            </div>
        )
    }

    useEffect(function(){
        fetchAllCategory()
    },[])

    function displayCategory() {
        return (
          <MaterialTable
            title="Category List"
            columns={[
              { title: 'Restaurant ID/Name', 
                render:rowData=><><div>{rowData.restaurantid}/{rowData.restaurantname}</div></>},

              { title: 'Category Name', 
                render:rowData=><><div>{rowData.categoryname}</div></>},

              { title: 'Category Logo', 
                render:rowData=><><div><img src={`${serverURL}/images/${rowData.icon}`} style={{width:50, height:50, borderRadius:5}}/></div></> },
              
            ]}
            data={categoryList}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Category',
                onClick: (event, rowData) =>handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Category',
                onClick: (event, rowData) => handleCategoryDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Category',
                isFreeAction: true,
                onClick: (event) => navigate('/admindashboard/categoryinterface')
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
        <div className={classes.rootcategory}>
            <div className={classes.boxcategory} >
            {displayCategory()}
            </div>
            {showCategoryForEdit()}
        </div>
    )
}
