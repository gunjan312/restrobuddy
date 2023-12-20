import React,  {useState, useEffect}  from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { postData } from '../../Services/FetchNodeServices';
import { useNavigate } from 'react-router-dom';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {

  var navigate = useNavigate()

    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const[totalAmount, setTotalAmount] = useState(0)

    const getCurrentDate=()=>{
      var date = new Date()
      var cd = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()
      return cd
    }

    const getCurrentDateString=()=>{
      var date = new Date()
      var d = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      var m = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      var cd = d[date.getDay()]+","+m[date.getMonth()]+" "+date.getDate()+" "+date.getFullYear()
      return cd
    }
   

    const fetchTotalBill=async()=>{
        var response = await postData('billing/fetch_daily_totalsale', {restaurantid:admin.restaurantid, currentdate:getCurrentDate()})
        setTotalAmount(response.data)
        //console.log(billList)
    }

    useEffect(function(){
        fetchTotalBill()
    },[])

  return (
    <React.Fragment>
      <Title>Today's Sale</Title>
      <Typography component="p" variant="h4">
      &#8377;{totalAmount.totalbill}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {getCurrentDateString()}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={()=>navigate('/admindashboard/billreport')}>
        View Today's Orders
        </Link>
      </div>
    </React.Fragment>
  );
}