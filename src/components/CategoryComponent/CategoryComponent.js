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
import { serverURL, getData, postData } from '../../Services/FetchNodeServices';
import FoodComponent from '../FoodComponent/FoodComponent';

export default function CategoryComponent(props) {
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[categoryList, setCategoryList]= useState([])
    const[categoryId, setCategoryId]= useState('')
    const[open, setOpen] = useState(false)

    const fetchAllCategory=async()=>{
        var result = await postData('category/fetch_all_category',{'restaurantid':admin.restaurantid})
        setCategoryList(result.data)
    }   

    useEffect(function(){
        fetchAllCategory()
    },[])

const handleFoodList=(cid)=>{
  setCategoryId(cid)
  setOpen(true)
}


    const showCategoryList=()=>{
        return categoryList.map((item)=>{
            return(
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItemButton alignItems="flex-start" onClick={()=>handleFoodList(item.categoryid)} >
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={`${serverURL}/images/${item.icon}`} style={{width:30, height:30}} />
        </ListItemAvatar>
        <ListItemText
          primary={item.categoryname}
          
        />
      </ListItemButton>
      <Divider variant="inset" component="li" />
         </List>   )
        })
    }

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {showCategoryList()}
      <FoodComponent categoryid={categoryId} setOpen={setOpen} open={open} floorNo={props.floorNo} tableNo={props.tableNo} refresh={props.refresh} setRefresh={props.setRefresh}/>
    </Box>
  );
}
