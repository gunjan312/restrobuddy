import  {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { Button, Dialog,  DialogActions,  DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { serverURL, getData, postData } from '../../Services/FetchNodeServices';
import { useSelector, useDispatch } from 'react-redux';



export default function FoodComponent(props) {
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[foodList, setFoodList]= useState([])
    const[tempFoodList, setTempFoodList] = useState([])
    const[order, setOrder] = useState([])
    var dispatch = useDispatch()
    var foodOrder = useSelector((state)=>state.orderData)
    
    

    const fetchAllFood=async()=>{
        var result = await postData('fooditems/fetch_all_fooditem_by_category',{'restaurantid':admin.restaurantid, 'categoryid':props.categoryid})
        setFoodList(result.data)
        setTempFoodList(result.data)
    } 
    
    const searchFood=(e)=>{
      var temp = tempFoodList.filter((item)=>{return item.fooditemname.toLowerCase().includes(e.target.value.toLowerCase())})
      setFoodList(temp)
      
    }
    
    useEffect(function(){
        fetchAllFood()
    },[props])

    const handleOrder=(item)=>{
      //alert(props.floorNo+","+"Table no:"+ props.tableNo)
      var key = `#${props.floorNo}${props.tableNo}`
      

      try{
        foodList = foodOrder[key]
        try{
          foodList[item.fooditemid].qty=parseInt(foodList[item.fooditemid].qty)+1
        }
        catch(e){
        foodList[item.fooditemid]=item
        item.qty = 1
        foodOrder[key] = foodList
      }
      }
      catch(e){
        var foodList = {}
        foodList[item.fooditemid]=item
        item.qty = 1
        foodOrder[key] = {...foodList}
      }
      console.log(foodOrder)
      props.setRefresh(!props.refresh)
      dispatch({type:"ADD_ORDER", payload:[key, foodOrder[key]]})
    }

    const showFoodList=()=>{
        return foodList.map((item)=>{
            return(
              <div>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItemButton onClick={()=>handleOrder(item)} style={{height:40, display:'flex', justifyContent:'center', alignItems:'center'}} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={`${serverURL}/images/${item.icon}`} style={{width:30, height:30}} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.fooditemname}
                        secondary={item.offerprice>0?<span><s>&#8377;{item.price}</s><b>&#8377;{item.offerprice}</b></span>:<b>&#8377;{item.price}</b>}
                        
                      />
                    </ListItemButton>
               </List> 
               <Divider />
               </div>
           )
        })
    }


   

    const showFoodDialog=()=>{
        return(
          <Dialog open={props.open} maxWidth='md'>
            
          <DialogContent>
            <TextField onChange={(e)=>searchFood(e)} label="Search food here.." variant='standard'/>
            {showFoodList()}
            </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleDialogClose}>Close</Button>
            </DialogActions>
        </Dialog>
      )
      }
      const handleDialogClose=()=>{
        props.setOpen(false)
    }

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {showFoodDialog()}
    </Box>
  );
}
