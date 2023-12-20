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
    root:{width :"auto", height:"100%", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b" },
    box: {width:"60%", height:"auto", background:"#d2dae2", borderRadius:10, padding:10},
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})



export default function FoodItemInterface(){
    var classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[restaurantid, setRestaurantid] = useState('')
    const[categoryid, setCategoryid] = useState('')
    const[categoryName, setCategoryName] = useState([])
    const[foodItemName, setFoodItemName] = useState('')
    const[foodType, setFoodType] = useState('')
    const[ingredients, setIngredients] = useState('')
    const[price, setPrice] = useState('')
    const[offerPrice, setOfferPrice] = useState('')
    const[fileIcon, setFileIcon]= useState({url:'', bytes:''})
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
        if(price.trim().length==0)
        {
            handleError(true, 'price', 'Please enter Price')
            submitRecord = false
        }
        if(offerPrice.trim().length==0)
        {
            handleError(true, 'offerPrice', 'Please enter Offer Price')
            submitRecord = false
        }
        return submitRecord
    }

    useEffect(function(){
        
        setRestaurantid(admin.restaurantid)
        fetchCategory()
    },[])


    const handleIcon=(event)=>{
        setFileIcon({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
    }

    const fetchCategory = async()=>{
         var result = await postData('fooditems/fetch_category', {restaurantid:admin.restaurantid})
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

    
    

    const handleFoodItemSubmit=async()=>{
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
        formData.append('icon', fileIcon.bytes)

        var result = await postData('fooditems/fooditem_submit', formData)

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
        }
    }

     
 const handleReset=()=>{
    setCategoryid ('')
    setCategoryName([])
    setFoodItemName('')
    setFoodType('')
    setIngredients('')
    setPrice('')
    setOfferPrice('')
     setFileIcon({url:'', bytes:''})
 }

    return(
        <div className={classes.root}>
            <div className={classes.box}>
                <Grid container spacing={2}>

                    <Grid item xs={12}>
                    <Heading title={"Food Items Register"}  myroute={'/admindashboard/displayallfooditems'}/>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField 
                        disabled
                        label="Restaurant ID"  value={restaurantid} fullWidth/>
                        
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Food Category</InputLabel>
                            <Select 
                            onFocus={()=>handleError(false,'categoryid','')}
                            error={foodItemError?.categoryid?.error}
                            label="Food Category" onChange={handleCategoryChange} value={categoryid} >
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
                                <RadioGroup row>
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
                        onFocus={()=>handleError(false,'offerPrice','')}
                        error={foodItemError?.offerPrice?.error}
                        helperText={foodItemError?.offerPrice?.message}
                        label="Offer Price" onChange={(event)=>setOfferPrice(event.target.value)}  value={offerPrice} fullWidth/>
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
                    </Grid>

                    <Grid item xs={6} >
                        <Button variant="contained" onClick={handleFoodItemSubmit} fullWidth>Submit</Button>
                
                    </Grid>
                    <Grid item xs={6} >
                        <Button variant="contained" onClick={handleReset} fullWidth>Reset</Button>
                    </Grid>


                </Grid>
            </div>
        </div>
    )
}