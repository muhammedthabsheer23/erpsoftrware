import React, { useState, useEffect } from 'react';
import Sidenav from '../components/Sidenav';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import '../pages/Home.css';
import { FcSalesPerformance } from "react-icons/fc";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from 'recharts';
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaUsersGear } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

function Home() {
  const [datas, setDatas] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('This Year');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    axios.get(`http://localhost:5162/api/AccountingController2/summary`)
      .then((response) => {
        setDatas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        setError("There was an error fetching the data!");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const getNetAmount = (source) => {
    const data = datas.find(item => item.source === source);
    if (!data) return 'N/A'; // Check if data is defined before accessing its properties

    switch (selectedPeriod) {
      case 'Today':
        return data.netAmountToday || 0.000; // Provide a fallback if the value is undefined
      case 'This Month':
        return data.netAmountThisMonth || 0.000; // Provide a fallback if the value is undefined
      case 'This Year':
      default:
        return data.netAmountThisYear || 0.000; // Provide a fallback if the value is undefined
    }
  };

  const data = [
    { name: 'January', uv: 2500, pv: 2200, amt: 15487 },
    { name: 'February', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'March', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'April', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'June', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'July', uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <div>
      <Navbar />
      <Box height={30} sx={{ mt: "20px" }} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <main className='main-container home'>
          <div className='main-title'>
            <Button className='dashbutton' variant="outline-primary" onClick={() => handlePeriodChange('Today')}>Today</Button>{' '}
            <Button className='dashbutton' variant="outline-primary" onClick={() => handlePeriodChange('This Month')}>This Month</Button>{' '}
            <Button className='dashbutton' variant="outline-primary" onClick={() => handlePeriodChange('This Year')}>This Year</Button>{' '}
          </div>
          <div className='main-cards'>
            <div className='cards'>
              <div className='card-inner'>
                <h6>Sales</h6>
                <FcSalesPerformance className='card_icon sales' />
              </div>
              <h6 className='h4'>${getNetAmount('Sales')}</h6>
            </div>
            <div className='cards'>
              <div className='card-inner'>
                <h6>Sales Returns</h6>
                <MdOutlineKeyboardReturn className='card_icon salesreturn' />
              </div>
              <h6 className='h4'>${getNetAmount('SalesReturn')}</h6>
            </div>
            <div className='cards'>
              <div className='card-inner'>
                <h6>Purchase</h6>
                <MdProductionQuantityLimits className='card_icon purchases' />
              </div>
              <h6 className='h4'>${getNetAmount('Purchase')}</h6>
            </div>
            <div className='cards'>
              <div className='card-inner'>
                <h6>Purchase Returns</h6>
                <MdOutlineKeyboardReturn className='card_icon purchasereturn' />
              </div>
              <h6 className='h4'>${getNetAmount('PurchaseReturn')}</h6>
            </div>
            <div className='cards'>
              <div className='card-inner'>
                <h6>Expenses</h6>
                <PaidOutlinedIcon className='card_icon expense' />
              </div>
              <h6 className='h4'>$15,025.00</h6>
            </div>
           <div className='cards'>
              <div className='card-inner'>
                <h6>Users</h6>
                <FaUsersGear className='card_icon user' />
              </div>
              <h6 className='h4'>3 <FaArrowTrendUp /> All Time</h6>
            </div>
            <div className='cards'>
              <div className='card-inner'>
                <h6>Customers</h6>
                <FaUserFriends className='card_icon customer' />
              </div>
              <h6 className='h4'>9 <FaArrowTrendUp /> All Time</h6>
            </div>
            <div className='cards'>
              <div className='card-inner'>
                <h6>Suppliers</h6>
                <FaUserFriends className='card_icon supplier' />
              </div>
              <h6 className='h4'>3 <FaArrowTrendUp /> All Time</h6>
            </div>
          </div>
          <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
      </Box>
    </div>
  );
}

export default Home;
