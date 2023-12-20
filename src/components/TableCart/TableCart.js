import logo from "../../assets/logo.png"
import list from "../../assets/list.png"
import { Paper, Grid, Divider, Button, TextField } from "@mui/material"
import { useNavigate } from "react-router-dom"
import {useState, useEffect} from "react"
import { serverURL, getData, postData } from "../../Services/FetchNodeServices";
import { useSelector, useDispatch } from "react-redux"
import Plusminus from "../Plusminus/Plusminus"
import Swal from "sweetalert2"
import { useCallback } from "react";
import useRazorpay from "react-razorpay";
import { useRef } from "react";



export default function TableCart(props){
    var navigate = useNavigate()
    var dispatch = useDispatch()
    const [Razorpay] = useRazorpay();

    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    var gst = parseInt(admin.gsttype)/2

    var foodOrder = useSelector((state)=>state.orderData)
    var foodList=[]
    if(props.tableNo.length!=1){
    var cart = foodOrder[props.tableNo]
    if(cart!=undefined)
        foodList = Object.values(cart)
    }

    var totalAmount = foodList.reduce(calculateTotalAmount,0)
    function calculateTotalAmount(item1, item2){
        return item1+(item2.price*item2.qty)
    }

    var totalOffer = foodList.reduce(calculateTotalOffer,0)
    function calculateTotalOffer(item1, item2){
        var price = item2.offerprice>0?item2.price*item2.qty:0
        return item1+(price-(item2.offerprice*item2.qty))
    } 

///////////////////////////////////////////////////////////////////////////////////////////

	const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);


////////////////////////////////////////////////////////////////////////////////////////

    const[floor, setFloor] = useState([])
    const[tableno, setTableno] = useState([])
    const[customername, setCustomername] = useState("")
    const[mobileno, setMobileno] = useState("")
    

    const showTotalBill=()=>{
        return(<>
            <Grid item xs={12}><Divider/></Grid>
            <Grid item xs={6} style={{fontWeight:'bold', fontSize:12}}>Total Amount</Grid>
            <Grid item xs={6} style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{totalAmount}</Grid>
            <Grid item xs={6} style={{fontWeight:'bold', fontSize:12}}>Discount</Grid>
            <Grid item xs={6} style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{totalOffer}</Grid>
            <Grid item xs={6} style={{fontWeight:'bold', fontSize:12}}>CGST</Grid>
            <Grid item xs={6} style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{(totalAmount-totalOffer)*gst/100}</Grid>
            <Grid item xs={6} style={{fontWeight:'bold', fontSize:12}}>SGST</Grid>
            <Grid item xs={6} style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{(totalAmount-totalOffer)*gst/100}</Grid>
            <Grid item xs={6} style={{fontWeight:'bold', fontSize:12}}>Net Amount</Grid>
            <Grid item xs={6} style={{fontWeight:'bold', textAlign:'right'}}>&#8377;{(totalAmount-totalOffer)+(totalAmount-totalOffer)*admin.gsttype/100}</Grid>
            <Grid item xs={12}><Divider/></Grid>     
            </> 
        )
    }

    const getCurrentDate=()=>{
        var date = new Date()
        var cd = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
        return cd
    }

    const getCurrentTime=()=>{
        var time = new Date()
        var ct = time.getHours()+":"+time.getMinutes()
        return ct
    }

/////////////////////////////////////////// PAYMENT API RAZORPAY////////////////////////////////////////////////////////////////////////

const handlePayment = useCallback(async(na) => {
    

    const options ={
      key: "rzp_test_GQ6XaPC6gMPNwH",
      amount: na*100,
      currency: "INR",
      name: admin.restaurantname,
      description: "Online Payment",
      image: `${serverURL}/images/${admin.filelogo}`,
     // order_id: order.id,
      handler: (res) => {

        console.log(customername);
	    const currentProps = propsRef.current;
        handleSaveOnline("Online", res.razorpay_payment_id,na,currentProps);
      },
      prefill: {
        name: customername,
        email: "youremail@example.com",
        contact: mobileno,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
    
  },[Razorpay]);



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  


    const handleSave=async()=>{
        var body = {restaurantid:admin.restaurantid, billdate:getCurrentDate(), billtime:getCurrentTime(), tableno:props.tableNo, server:props.waiter, fssai:admin.fssainumber, cnote:"", gst:admin.gstnumber, billingdetails:JSON.stringify(foodOrder[props.tableNo]), totalamount:(totalAmount -totalOffer)+((totalAmount - totalOffer) *  admin.gsttype/100),paymentstatus:"cash", transactionid:"cash", customername, mobileno}
        var response = await postData('billing/bill_submit', body)

        if(response.status){
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to save the bill!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Done!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Saved!',
                'Your bill has been saved.',
                'success'
              )
            dispatch({type:'DEL_ORDER', payload:[props.tableNo]})
            props.setRefresh(!props.refresh)
            }
          })
        }
        //alert(response.status)
    }

    //////////////////////////////////////////////HANDLESAVE ONLINE///////////////////////////////////////////////////////

    const handleSaveOnline=async(paymentStatus, transactionId, amount,currentProps)=>{
        var body = {restaurantid:admin.restaurantid, billdate:getCurrentDate(), billtime:getCurrentTime(), tableno:currentProps.tableNo, server:currentProps.waiter, fssai:admin.fssainumber, cnote:"", gst:admin.gstnumber, billingdetails:JSON.stringify(foodOrder[currentProps.tableNo]), totalamount:amount,paymentstatus:paymentStatus, transactionid:transactionId, customername, mobileno}
        var response = await postData('billing/bill_submit', body)

        if(response.status){
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to save the bill!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Done!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Saved!',
                'Your bill has been saved.',
                'success'
              )
            dispatch({type:'DEL_ORDER', payload:[props.tableNo]})
            props.setRefresh(!props.refresh)
            }
          })
        }
        //alert(response.status)
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////

    const handleQtyChange=(v, item)=>{
        var foodList = foodOrder[props.tableNo]
        if(v==0){
            delete foodList[item.fooditemid]
            foodOrder[props.tableNo] = foodList
        }
        else{
       
        foodList[item.fooditemid].qty=v
        foodOrder[props.tableNo] = foodList
        }
        dispatch({type:"ADD_ORDER", payload:[props.tableNo, foodOrder[props.tableNo]]})
        props.setRefresh(!props.refresh)
    }

    const showFoodList=()=>{
        return foodList?.map((item, index)=>{
            return(<>
                <Grid item xs={1}>{index+1}</Grid>
                <Grid item xs={3}>{item?.fooditemname}</Grid>
                <Grid item xs={2} style={{textAlign:'right'}}>&#8377;{item?.price}</Grid>
                <Grid item xs={2} style={{textAlign:'right'}}>&#8377;{item?.offerprice}</Grid>
                <Grid item xs={2} style={{display:'flex', justifyContent:'right'}}><Plusminus onChange={(v)=>handleQtyChange(v, item)} qty={item?.qty}/></Grid>
                <Grid item xs={2} style={{textAlign:'right', fontWeight:'bold'}}>&#8377;{item?.offerprice>0?item?.offerprice*item?.qty:item?.price*item?.qty}</Grid>
            </>)
        })
    }

    const heading=()=>{
        return(<div>
           
            <Grid container spacing={1} style={{fontFamily:'kanit'}}>
                <Grid item xs={6}>
                    <TextField label="Customer Name" variant="standard" onChange={(event)=>setCustomername(event.target.value)} />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Mobile Number" variant="standard" onChange={(event)=>setMobileno(event.target.value)} />
                </Grid>
                <Grid item xs={12}><Divider/></Grid>
                <Grid item xs={1} style={{fontWeight:'bold'}} >SNo</Grid>
                <Grid item xs={3} style={{fontWeight:'bold'}}>Name</Grid>
                <Grid item xs={2} style={{fontWeight:'bold', textAlign:'right'}}>Rate</Grid>
                <Grid item xs={2} style={{fontWeight:'bold', textAlign:'right'}}>Offer</Grid>
                <Grid item xs={2} style={{fontWeight:'bold', textAlign:'right'}}>QTY</Grid>
                <Grid item xs={2} style={{fontWeight:'bold', textAlign:'right'}}>Amount</Grid>
                <Grid item xs={12}><Divider/></Grid>
                {showFoodList()}
                {showTotalBill()}
                <Grid item xs={6}>
                    <Button onClick={() => handleSave()} variant="contained" style={{display:'flex', marginLeft:'auto'}}>Save & Print</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={()=>handlePayment((totalAmount-totalOffer)+((totalAmount-totalOffer)*admin.gsttype/100))} variant="contained" style={{display:'flex', marginLeft:'auto'}}>Online Payment</Button>
                </Grid>
            </Grid>
           
        </div>)
    }

    return(<div>
        {heading()}
    </div>)
}
