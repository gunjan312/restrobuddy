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
    rootdisplay:{width :"auto", height:"100%", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    boxdisplay: {width:"80%", height:"auto", background:"#d2dae2", borderRadius:10, padding:15},
    root:{width :"100vw", height:"auto", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})


export default function DisplayAllFoodItems(){
    var classes = useStyles()
    var navigate = useNavigate()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[foodItemList, setFoodItemList] = useState([])
    const[open, setOpen] = useState(false)
    const[btnStatus, setBtnStatus]= useState(false)

    //////////////////////////////////////// Food Item Interface Data /////////////////////////////////////////////////////
    const[restaurantid, setRestaurantid] = useState('')
    const[categoryid, setCategoryid] = useState('')
    const[categoryName, setCategoryName] = useState([])
    const[foodItemName, setFoodItemName] = useState('')
    const[foodItemId, setFoodItemId] = useState('')
    const[foodType, setFoodType] = useState('')
    const[ingredients, setIngredients] = useState('')
    const[price, setPrice] = useState('')
    const[offerPrice, setOfferPrice] = useState('')
    const[fileIcon, setFileIcon]= useState({url:'', bytes:''})
    const[tempFile, setTempFile]= useState({icon:''})
    const[tempFileIcon , setTempFileIcon] = useState('')
    const[foodItemError, setFoodItemError]= useState({})

    const handleError=(error, input, message)=>{
        setFoodItemError(prevState =>({...prevState, [input]:{'error':error, 'message':message}}))
    }
    const validation =()=>{
        var submitRecord = true
        if(restaurantid.length==0)
        {
            handleError(true, 'restaurantid', 'Please enter Restaurant ID')
            submitRecord = false
        }
        if(categoryid.length==0)
        {
            handleError(true, 'categoryid', 'Please enter Category name')
            submitRecord = false
        }
        if(foodItemName.trim().length==0)
        {
            handleError(true, 'foodItemName', 'Please enter Food Item name')
            submitRecord = false
        }
        if(price.length==0)
        {
            handleError(true, 'price', 'Please enter Price')
            submitRecord = false
        }
        if(offerPrice.length==0)
        {
            handleError(true, 'offerPrice', 'Please enter Offer Price')
            submitRecord = false
        }
        return submitRecord
    }


    const handleIcon=(event)=>{
        setFileIcon({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
        setBtnStatus(true)
    }

    const fetchCategory = async()=>{
         var result = await postData('fooditems/fetch_category',{restaurantid:admin.restaurantid})
         setCategoryName(result.data)
     }

     const handleCategoryChange=(event)=>{
        setCategoryid(event.target.value)
     }

     const fillCategoryId=()=>{
        return categoryName.map((item)=>{
            return <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>
        })
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
///////////////////////////// Code To Update Fooditem Data //////////////////////////////////////////////////////////
    const editFoodItemData=async()=>{
      var error = validation()
      if(error){
        var formData = new FormData()
        formData.append('restaurantid', restaurantid)
        formData.append('categoryid', categoryid)
        formData.append('categoryname', categoryName)
        formData.append('fooditemname', foodItemName)
        formData.append('foodtype', foodType)
        formData.append('ingredients', ingredients)
        formData.append('price', price)
        formData.append('offerprice', offerPrice)
        formData.append('tempFileIcon', tempFileIcon)
        formData.append('icon', fileIcon.bytes)
        formData.append('fooditemid', foodItemId)

        var result = await postData('fooditems/fooditem_edit_data', formData)
        console.log(result.data)

        if(result.status){
            Swal.fire({
                icon: 'success',
                title: 'Food Item Registeration',
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
            fetchAllFooditem()
          }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////// Code To Delete FoodItem Record ///////////////////////////////////////////////////////
const fooditemRecordDelete=(rowData)=>{
  Swal.fire({
    title: 'Do you want to delete the Food Record?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    denyButtonText: `Don't delete`,
  }).then(async(result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      var body = {'fooditemid': rowData.fooditemid}
      var result = await postData('fooditems/fooditem_delete', body)
      if(result.status){
        Swal.fire(result.message)
        fetchAllFooditem()
      }
      else{
        Swal.fire('Fail!', '', result.message)
      }
      
    } else if (result.isDenied) {
      Swal.fire('Food Item not deleted', '', 'info')
    }
  })
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////// Code To Show Previously Added Data In Dialog box Form///////////////////////////////////////
    
    
    const handleEdit=(rowData)=>{
      fetchCategory(rowData.restaurantid)
      setRestaurantid(rowData.restaurantid)
      setCategoryid(rowData.categoryid)
      setFoodItemId(rowData.fooditemid)
      setFoodItemName(rowData.fooditemname)
      setFoodType(rowData.foodtype)
      setIngredients(rowData.ingredients)
      setPrice(rowData.price)
      setOfferPrice(rowData.offerprice)
      setFileIcon({url:`${serverURL}/images/${rowData.icon}`, bytes:""})
      setTempFile({icon:`${serverURL}/images/${rowData.icon}`,bytes:""})
      setTempFileIcon(rowData.icon)
      setOpen(true)
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////// code for image update cancel button ///////////////////////////////////
    const handleCancel=()=>{
      setBtnStatus(false)
      setFileIcon({url:tempFile.icon, bytes:tempFile.bytes})
    }

    const cancelButton=()=>{
      return(
        <div>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      )
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////// Code For Edit and Close Button of Dialog Box //////////////////////////////
const handleDialogClose=()=>{
    setOpen(false)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////// code to fetch food items ///////////////////////////////////////
    const fetchAllFooditem=async(rowData)=>{
      var result = await postData('fooditems/fetch_all_fooditem', {'restaurantid':admin.restaurantid})
      setFoodItemList(result.data)
    }

    
    useEffect(function(){
      fetchAllFooditem()
      fetchCategory()
      setRestaurantid(admin.restaurantid)
    },[])
///////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// Code For Dialog Box And Data To Show In Dialog Box ///////////////////////////
    const showFoodItemForEdit=()=>{
      return(
        <Dialog open={open} maxWidth='md'>
          
        <DialogContent>
          {showFoodItemData()}
          </DialogContent>
        <DialogActions>
        <Button variant="contained" onClick={editFoodItemData}>Edit</Button>
          <Button variant="contained" onClick={handleDialogClose}>Close</Button>
          </DialogActions>
      </Dialog>
    )
    }

    const showFoodItemData=()=>{
        return(
          <div>
            <div>
            <Grid container spacing={2}>

                    <Grid item xs={12}>
                    <Heading title={"Food Items Register"}/>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                        
                        label="Restaurant ID" value={restaurantid} fullWidth/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category ID</InputLabel>
                            <Select 
                             onFocus={()=>handleError(false,'categoryid','')}
                             error={foodItemError?.categoryid?.error}
                            label="Category ID" onChange={handleCategoryChange} value={categoryid}>
                                <MenuItem>-Select category-</MenuItem>
                                {fillCategoryId()}
                            </Select>
                        </FormControl>
                        <div style={{color:"#c0392b", fontWeight:"normal", fontSize:'13px', marginLeft:'10px'}}>{foodItemError?.categoryid?.message}</div>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField 
                        onFocus={()=>handleError(false,'foodItemName','')}
                        error={foodItemError?.foodItemName?.error}
                        helperText={foodItemError?.foodItemName?.message}
                        label="Food Item Name" onChange={(event)=>setFoodItemName(event.target.value)} value={foodItemName} fullWidth/>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl>
                            <FormLabel style={{fontWeight:'bold'}} >Food Type</FormLabel>
                                <RadioGroup row value={foodType}>
                                    <FormControlLabel value={'Veg'} label={"Veg"} onChange={(event)=>setFoodType(event.target.value)} control={<Radio/>}/>
                                    <FormControlLabel value={'Non-Veg'} label={"Non-Veg"} onChange={(event)=>setFoodType(event.target.value)} control={<Radio/>} />
                                </RadioGroup>    
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="Ingredients" onChange={(event)=>setIngredients(event.target.value)} value={ingredients} fullWidth/>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                        onFocus={()=>handleError(false,'price','')}
                        error={foodItemError?.price?.error}
                        helperText={foodItemError?.price?.message}
                        label="Price" onChange={(event)=>setPrice(event.target.value)} value={price} fullWidth/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                        onFocus={()=>handleError(false,'price','')}
                        error={foodItemError?.price?.error}
                        helperText={foodItemError?.price?.message}
                        label="Offer Price" onChange={(event)=>setOfferPrice(event.target.value)} value={offerPrice} fullWidth/>
                    </Grid>

                    <Grid item xs={6} >
                    <Button component="label" variant="contained" endIcon={<UploadFile/>} fullWidth>
                    <input
                    multiple type="file"  onChange={handleIcon}  hidden accept="image/*"></input>
                        Upload Icon
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Avatar
                            alt="Remy Sharp"
                            src={fileIcon.url}
                            sx={{ width: 56, height: 56 }}
                        />
                       <div>{btnStatus?cancelButton():<></>}</div>
                    </Grid>

                    

                    </Grid>
            </div>
          </div>
        )
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////// Code To Display Food Items ////////////////////////////////////////////////////////////
    function displayFooditems() {
        return (
          <MaterialTable
            title="Food Item List"
            columns={[
              { title: 'Restaurant ID/Name', 
                render:rowData=><><div>{rowData.restaurantid}/{rowData.restaurantname}</div></>},

              { title: 'Category Id/Name', 
                render:rowData=><><div>{rowData.categoryid}/{rowData.categoryname}</div></>},

              { title: 'Food Item Name', 
                render:rowData=><><div>{rowData.fooditemname}</div></>}, 
                
              { title: 'Food Type', 
                render:rowData=><><div>{rowData.foodtype}</div></>},

              { title: 'Price', 
                render:rowData=><><div>{rowData.price}</div></>},

             { title: 'Offer Price', 
                render:rowData=><><div>{rowData.offerprice}</div></>},

              { title: 'Food Item Logo', 
                render:rowData=><><div><img src={`${serverURL}/images/${rowData.icon}`} style={{width:50, height:50, borderRadius:5}}/></div></> },
              
            ]}
            data={foodItemList}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Food Item',
                onClick: (event, rowData) => handleEdit(rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Food Item',
                onClick: (event, rowData) => fooditemRecordDelete(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Category',
                isFreeAction: true,
                onClick: (event) => navigate('/admindashboard/fooditeminterface')
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return(
        <div className={classes.rootdisplay}>
            <div className={classes.boxdisplay}>
              {displayFooditems()}
            </div>
            {showFoodItemForEdit()}
        </div>
    )
}