
import {Grid,  Button } from "@mui/material"
import MaterialTable from "@material-table/core"
import { makeStyles } from "@mui/styles"
import { useState, useEffect } from "react"
import { postData} from "../../Services/FetchNodeServices"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'



const useStyles = makeStyles({
    root:{width :"80vw", height:"auto", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b", padding:5, flexDirection:'column'},
    box: {width:"80%", height:"auto", background:"#fff", borderRadius:10, padding:15, display:'flex', marginBottom:10, },
    center: {display:'flex', justifyContent:'center', alignItems:'center'}
})



export default function BillReport(){

  const getCurrentDate=()=>{
    var date = new Date()
    var cd = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
    return cd
}

    var classes = useStyles()
    var admin = JSON.parse(localStorage.getItem('ADMIN'))

    const[fromdate, setFromdate] = useState(getCurrentDate())
    const[todate, setTodate] = useState(getCurrentDate())
    const[currentdate, setCurrentDate] = useState('')
    const[billList, setBillList] = useState([])
    const[totalAmount, setTotalAmount] = useState(0)
    

    const handleShowBill=()=>{
      fetchTotalBill()
       fetchAllBill()
    }

    const fetchAllBill=async(rowData)=>{
        var body = {restaurantid:admin.restaurantid, 'fromdate':fromdate, 'todate':todate}
        var result = await postData('billing/fetch_bill', body)
        setBillList(result.data)
        //console.log(billList)
    }
  

    const fetchTotalBill=async()=>{
        var response = await postData('billing/fetch_total_bill', {restaurantid:admin.restaurantid, 'fromdate':fromdate, 'todate':todate})
        setTotalAmount(response.data)
        //console.log(billList)
    }

     useEffect(function(){
      fetchTotalBill()
       fetchAllBill()
       setCurrentDate(getCurrentDate())
     },[currentdate])

     const handleFromDate=(event)=>{
      const m=String(Number(event.$M)+1);
      const d=String(event.$D);
      const y=String(event.$y);
      setFromdate(y+"-"+m+"-"+d);   
    }

    const handleToDate=(event)=>{
      const m=String(Number(event.$M)+1);
      const d=String(event.$D);
      const y=String(event.$y);
      setTodate(y+"-"+m+"-"+d);   
    }
   

    function DisplayBill(){
        return(
            <MaterialTable
            title="Food Bill Record"
            columns={[
              { title: 'Bill No',
              render:rowData=><><div>{rowData.billno}</div></>},
              { title: 'Date' ,
                render:rowData=>{var date = new Date(rowData.billdate);
                var cd = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
                return<div>{cd}</div>}},
              { title: 'Time', field: 'billtime'},
              { title: 'Table No', field: 'tableno' },
              { title: 'Server', field: 'server' },
              { title: 'GST No', field: 'gst' },
              {
                title: 'Food Items',
                field: 'billingdetails',
                render: (rowData) => {            
                  const billingDetails = JSON.parse(rowData.billingdetails || '{}');
                  const foodItemNames = Object.values(billingDetails).map((item) =>item.fooditemname);
                  return <div>{foodItemNames.join(', ')}</div>;
                },
              },
              {
                title: 'Food Item Quantity',
                field: 'billingdetails',
                render: (rowData) => {            
                  const billingDetails = JSON.parse(rowData.billingdetails || '{}');
                  const foodItemQty = Object.values(billingDetails).map((item) =>item.qty);
                  return <div>{foodItemQty.join(', ')}</div>;
                },
              },
              { title: 'Total Amount',
              render:rowData=><><div>&#8377;{rowData.totalamount}</div></>},
              { title: 'Customer Name', field: 'customername' },
              { title: 'Mobile No', field: 'mobileno'},
             
             
            ]}
            data={billList} 
            options={{
              paging:true,
              pageSize:3,       // make initial page size
              emptyRowsWhenPaging: false,   // To avoid of having empty rows
              pageSizeOptions:[3,5,7],    // rows selection options
            }}       
            
          />
        )
    }

    return(<div className={classes.root}>
          
        <div className={classes.box} >
            <Grid container spacing={3} style={{display:'flex', alignItems:'center'}}>
            
            <Grid item xs={3} style={{display:'flex', alignItems:'center', flexDirection:'column' ,fontFamily:'Kanit', fontSize:18, fontWeight:'bold'}} >
                <div>Total Bill</div>
                <div style={{fontSize:24}}>&#8377;{totalAmount.totalbill}</div>
              </Grid>

                <Grid item xs={3}>
                   
                   <LocalizationProvider dateAdapter={AdapterDayjs}>
                             <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                    label="From Date"
                                    defaultValue={dayjs(getCurrentDate())}
                                     format="DD-MM-YYYY"  onChange={handleFromDate}/>
                                </DemoContainer>
                        </LocalizationProvider>
                </Grid>

                <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                             <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                    label="Till Date"
                                    defaultValue={dayjs(getCurrentDate())}
                                     format="DD-MM-YYYY"  onChange={handleToDate}/>
                                </DemoContainer>
                        </LocalizationProvider>
                </Grid>

                
                <Grid item xs={3}>
                    <Button variant="contained" onClick={handleShowBill}fullWidth >Show Bill</Button>
                </Grid>
            </Grid>
        </div>

        <div className={classes.box}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {DisplayBill()}
    </Grid>
  </Grid>

        </div>
    </div>)
}