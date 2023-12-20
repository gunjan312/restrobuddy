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
import { useNavigate } from "react-router-dom";

const useStyles=makeStyles({
                          root:{width:'auto', height:'100%', display:'flex',justifyContent:'center', alignItems:'center', background:'#808e9b'},
                          box:{width:'60%', height:'auto', padding:10, borderRadius:10, background:"#d2dae2"}  
                        })

export default function CategoryInterface(){
    var classes = useStyles()
    var navigate = useNavigate()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))


    const[restaurantId, setRestaurantId]= useState('')
    const[categoryName, setCategoryName]= useState('')
    const[fileIcon, setFileIcon]= useState({url:'', bytes:''})
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

    useEffect(function(){
        setRestaurantId(admin.restaurantid)
    },[])

    const handleIcon=(event)=>{
        setFileIcon({url:URL.createObjectURL(event.target.files[0]), bytes:event.target.files[0]})
    }

    const handleReset=()=>{
        setCategoryName('')
        setFileIcon({url:'', bytes:''})
    }

    const handleSubmitCategory=async()=>{
        var error = validation()
        if(error){
        var formData = new FormData()
        formData.append('restaurantid', restaurantId)
        formData.append('categoryname', categoryName)
        formData.append('icon', fileIcon.bytes)
        var result = await postData('category/category_submit', formData)

        if(result.status){
            Swal.fire({
                icon: 'success',
                title: 'Category Registeration',
                text: result.message,
                position:'center',
               
                
              })
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    position:'center',
                    
                  })
            }
        }
    }

    

    return(
        <div className={classes.root}>
            <div className={classes.box}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <Heading title={"Category Register"} myroute={'/admindashboard/displayallcategory'}/>
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
                         value={categoryName}
                        label="Category Name" onChange={(event)=>setCategoryName(event.target.value)} fullWidth/>
                    </Grid>

                    <Grid item xs={6} >
                    <Button component="label" variant="contained" endIcon={<UploadFile/>} fullWidth>
                    <input
                    multiple type="file" onChange={handleIcon} hidden accept="image/*"></input>
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
                        <Button variant="contained" onClick={handleSubmitCategory} fullWidth>Submit</Button>
                
                    </Grid>
                    <Grid item xs={6} >
                        <Button variant="contained"  onClick={handleReset} fullWidth>Reset</Button>
                    </Grid>


                </Grid>
            </div>
        </div>
    )
}