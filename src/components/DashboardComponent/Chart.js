import  React, {useState, useEffect} from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import { postData } from '../../Services/FetchNodeServices';
import Title from './Title';


// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

export default function Chart() {
  const theme = useTheme();

  var admin = JSON.parse(localStorage.getItem('ADMIN'))
  const[sale, setSale] = useState([])

  const fetchMonthlySaleData=async()=>{
    var result = await postData('billing/fetch_totalsale_month', {'restaurantid':admin.restaurantid})
    var saledata = result.data.map((item)=>{
        return(createData(item.month, item.totalbill))
    })
    setSale(saledata)
  }

  useEffect(function(){
    fetchMonthlySaleData()
  },[])

  return (
    <React.Fragment>
      <Title>Monthly Sale</Title>
      <ResponsiveContainer>
        <LineChart
          data={sale}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}