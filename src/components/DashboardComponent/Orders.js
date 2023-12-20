import {Grid,  Button } from "@mui/material"
import MaterialTable from "@material-table/core"
import { makeStyles } from "@mui/styles"
import { useState, useEffect } from "react"
import { postData} from "../../Services/FetchNodeServices"




const useStyles = makeStyles({
    root:{width :"auto", height:"auto", display:"flex", justifyContent:"center", alignItems:"center",background:"#808e9b", padding:0, flexDirection:'column'},
    box: {width:"90%", height:"auto", background:"#fff", borderRadius:10, padding:15, display:'flex', marginBottom:10, },
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
       fetchAllBill()
    }

    const fetchAllBill=async(rowData)=>{
        var body = {restaurantid:admin.restaurantid, 'fromdate':fromdate, 'todate':todate}
        var result = await postData('billing/fetch_bill', body)
        setBillList(result.data)
        //console.log(billList)
    }
  

    

     useEffect(function(){
       fetchAllBill()
       setCurrentDate(getCurrentDate())
     },[currentdate])

     

    function DisplayBill(){
        return(
            <MaterialTable
            title="Today's Orders"
           
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
              pageSize:1,       // make initial page size
              emptyRowsWhenPaging: false,   // To avoid of having empty rows
              pageSizeOptions:[3,5,7],    // rows selection options
            }}       
            
          />
        )
    }

    return(<div>
          
        

        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {DisplayBill()}
    </Grid>
  </Grid>

        </div>
    </div>)
}