import logo from "../../assets/logo.png"
import list from "../../assets/list.png"
import { Paper } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {useState, useEffect} from "react"
import { serverURL, getData, postData } from "../../Services/FetchNodeServices";



export default function TableComponent(props){
    var navigate = useNavigate()
    var foodOrder = useSelector((state)=>state.orderData)
    var foodList=[]
    function calculate(tn){
    
            var cart = foodOrder[tn]
            if(cart!=undefined){
                foodList = Object.values(cart)
            

            var totalAmount = foodList.reduce(calculateTotalAmount,0)
            var totalOffer = foodList.reduce(calculateTotalOffer,0)
            return(totalAmount-totalOffer)
            }
            else{
                return 0
            }
        }


    function calculateTotalAmount(item1, item2){
        return item1+(item2.price*item2.qty)
    }

    
    function calculateTotalOffer(item1, item2){
        var price = item2.offerprice>0?item2.price*item2.qty:0
        return item1+(price-(item2.offerprice*item2.qty))
    } 









    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[floor, setFloor] = useState([])
    const[tableno, setTableno] = useState([])
    const[selectedFloor, setSelectedFloor] = useState(-1)
    const[selectedTable, setSelectedTable] = useState(-1)

    const fetchAllFloor = async()=>{
        var result = await postData('waitertable/fetch_all_floor', {'restaurantid':admin.restaurantid})
        setFloor(result.data)
    }

    const fetchAllTables = async(fn, i)=>{
        props.setTableNo('')
        props.setFloorNo(fn)
        var result = await postData('waitertable/fetch_table_by_floor', {restaurantid:admin.restaurantid, floor:fn})
        setTableno(result.data)
        setSelectedFloor(i)
        setSelectedTable(-1)
        
    }
   

    useEffect(function(){
        fetchAllFloor()
    },[])

    const showFloor=()=>{
       return floor.map((item,i)=>{
           return (<Paper onClick={()=>fetchAllTables(item.floor, i)} style={{borderRadius:6, width:80, height:80, display:'flex', justifyContent:'center', alignItems:'center', background:i==selectedFloor?"#27ae60":"#7bed9f", padding:5, margin:8, cursor:'pointer'}}>
            <div style={{fontFamily:'Kanit', fontWeight:'bold', fontSize:'18', color:'#fff', display:'flex',justifyContent:'center', alignItems:'center' ,padding:2}}> {item.floor}</div>
           </Paper>)
       })
    }


    const handleTableClick=(item,i)=>{
        props.setTableNo(item.tableno)
        setSelectedTable(i)
    }

    const showTable=()=>{
        return tableno.map((item, i)=>{
            
            return (<Paper onClick={()=>handleTableClick(item, i)} style={{borderRadius:6, width:80, height:80, display:'flex',justifyContent:'center', alignItems:'center', background:i==selectedTable?"#e74c3c":"#ff7675", padding:5, margin:8, flexDirection:'column', cursor:'pointer'}}>
             <div  style={{fontFamily:'Kanit', fontWeight:'bold', fontSize:16, color:'#fff', padding:2}}>Table {item.tableno}</div>
             <div style={{fontFamily:'Kanit', fontWeight:'bold', fontSize:12, color:'#fff',padding:2}}>Chair {item.noofchairs}</div>
             <div style={{fontFamily:'Kanit', fontWeight:'bold', fontSize:14, color:'#fff',padding:2}}> &#8377; {calculate(`#${props.floorNo}${item.tableno}`)}</div>
              
            </Paper>)
        })
    }    

    return(
        <div style={{display:'flex', flexDirection:'column', padding:5 }} >
            <div style={{display:'flex', flexWrap:'wrap', marginBottom:10 }}>{showFloor()}</div>
            <div style={{display:'flex',  flexWrap:'wrap'}}>{showTable()}</div>
        </div>
    )}
