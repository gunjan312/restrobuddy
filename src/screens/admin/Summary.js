import Chart from "../../components/DashboardComponent/Chart"
import Deposits from "../../components/DashboardComponent/Deposite";
import Orders from "../../components/DashboardComponent/Orders";
import { Grid, Paper } from "@mui/material"




export default function Summary(){
    return(<div>
        <Grid container spacing={2} >
        <Grid item xs={12} md={8} lg={9} style={{paddingTop:0}}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>

              <Grid item xs={12} md={4} lg={3} style={{paddingTop:0}}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders />
                </Paper>
              </Grid>
            

        </Grid>
    </div>)
}