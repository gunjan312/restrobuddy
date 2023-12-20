import CategoryInterface from "./screens/category/CategoryInterface";
import DisplayAllCategory from "./screens/category/DisplayAllCategory";
import FoodItemInterface from "./screens/foodItems/FoodItemInterface";

import DisplayAllFoodItems from "./screens/foodItems/DisplayAllFoodItems";
import TableBookingInterface from "./screens/tablebooking/TableBookingInterface";
import DisplayAllTableBooking from "./screens/tablebooking/DisplayAllTableBooking";
import LoginPage from "./screens/superadmin/LoginPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/superadmin/Dashboard";
import WaiterInterface from "./screens/waiters/WaiterInterface";
import DisplayAllWaiters from "./screens/waiters/DisplayAllWaiters";
import WaiterTableInterface from "./screens/waitertable/WaiterTableInterface";
import DisplayAllWaiterTable from "./screens/waitertable/DisplayAllWaiterTable";
import AdminLogin from "./screens/admin/AdminLogin"
import AdminDashboard from "./screens/admin/AdminDashboard"
import FoodBooking from "./screens/FoodBooking/FoodBooking";
import Plusminus from "./components/Plusminus/Plusminus";
import BillReport from "./screens/BillReport/BillReport";

function App() {
  return (
    <div>
      <Router>
        <Routes>
         

          

         
         

          
        <Route element={<AdminLogin/>} path="/adminlogin"/>
          <Route element={<AdminDashboard/>} path='/admindashboard/*'/>

          <Route element={<LoginPage/>} path="/loginpage"/>
          <Route element={<Dashboard/>} path='/dashboard/*'/>
          <Route element={<FoodBooking/>} path='/foodbooking/*'/>
          <Route element={<Plusminus/>} path='/plusminus'/>
          <Route element={<BillReport/>} path='/billreport'/>
        </Routes>
      </Router>
      
   

    </div>
  );
}

export default App;
