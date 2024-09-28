import React, { useEffect, useState } from 'react'
import Sidenav from '../components/Sidenav'
import { Box } from '@mui/material'
import Navbar from '../components/Navbar'
import '../pages/MonthEndReport.css'
import { Alert, Button, Col, Container, Modal, Row, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
function MonthEndReport() {
    const getDefaultDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 to month because getMonth() returns 0-based month
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const currentYearMonth = new Date().toISOString().slice(0, 7);
    
      const [data, setData] = useState([]);
      const [filteredData, setFilteredData] = useState(null);
      const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage] = useState(200);
      const [selectedCounter, setSelectedCounter] = useState('');
      const [startTime, setStartTime] = useState(currentYearMonth);
      const [endTime, setEndTime] =useState(new Date().getFullYear());
      const [showModal, setShowModal] = useState(false);
      const [modalData, setModalData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [combinedSummary, setCombinedSummary] = useState({
        salesSummary: [],
        salesReturnSummary: [],
        mainsalesummary:[],
      });
    
     
      
      const fetchCombinedSummary = async (month, year) => {
        try {
          const response = await axios.get(`http://localhost:5162/api/Accounting3/GetMonthSalesSummary`, {
            params: { month, year }
          });
          setCombinedSummary(response.data || { salesSummary: [], salesReturnSummary: [], mainsalesummary: [] });
        } catch (error) {
          console.error("There was an error fetching the combined summary data!", error);
        }
      };
      
      
      console.log('Combined Summary:', combinedSummary);

      const handleViewClick = async () => {
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        
        const month = startDate.getMonth() + 1; // Month is 0-based
        const year = startDate.getFullYear();
        
        // Fetch the combined summary for the selected month and year
        await fetchCombinedSummary(month, year);
        
        // Display the modal
        setShowModal(true);
      };
      
      const handleShowModal = async (item) => {
        const startDateTime = new Date(item.starttime);
        const endDateTime = item.endtime ? new Date(item.endtime) : null;
    
        await fetchCombinedSummary(item.dayid, item.shiftid, item.id, item.counterid, item.locationId, startDateTime, item.transactionid,item.invtypeid);
    
        setModalData({
          ...item,
          startDate: startDateTime.toLocaleDateString(),
          startTime: startDateTime.toLocaleTimeString(),
          endDate: endDateTime ? endDateTime.toLocaleDateString() : '',
          endTime: endDateTime ? endDateTime.toLocaleTimeString() : '',
        });
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
        setModalData(null);
        setCombinedSummary(null);
      };
      console.log(combinedSummary?.otherSalesSummary); 
console.log(combinedSummary?.mainsalesummary);
console.log(combinedSummary?.alterationSummary);
console.log(combinedSummary?.quotationsummary);

const totalQuantitySum =(combinedSummary?.products ?? []).reduce((sum, product) => sum + product.totalQuantity, 0);

    
 
  



//   // Calculate total cash sales from each summary
const totalCashSalesQuotation = (combinedSummary?.quotationsummary ?? []).reduce(
 (total, item) => total + item.cashSales,
  0
 );

 const totalCashSalesAlteration = (combinedSummary?.alterationSummary ?? []).reduce(

  (total, item) => total + item.cashSales,
   0
);

const totalCashSalesOther = (combinedSummary?.otherSalesSummary ?? []).reduce(
  (total, item) => total + item.cashSales,
   0
 );

const totalCashSalesMain = (combinedSummary?.mainsalesummary ?? []).reduce(
  (total, item) => total + item.cashSales,
  0
 );


 const totalCashSales = totalCashSalesQuotation + totalCashSalesAlteration + totalCashSalesOther + totalCashSalesMain;

 const totalCardSalesQuotation = (combinedSummary?.quotationsummary ?? []).reduce(
   (total, item) => total + item.cardSales,
   0
 );

 const totalCardSalesAlteration = (combinedSummary?.alterationSummary ?? []).reduce(
   (total, item) => total + item.cardSales,
   0
 );

 const totalCardSalesOther = (combinedSummary?.otherSalesSummary ?? []).reduce(
   (total, item) => total + item.cardSales,
   0
 );

 const totalCardSalesMain = (combinedSummary?.mainsalesummary ?? []).reduce(
   (total, item) => total + item.cardSales,
   0
 );

// // Add up all the cash sales totals
 const totalCardSales = totalCardSalesQuotation + totalCardSalesAlteration + totalCardSalesOther + totalCardSalesMain;

 const totalBenefitSalesQuotation = (combinedSummary?.quotationsummary ?? []).reduce(
   (total, item) => total + item.benefitSale,
   0
 );

 const totalBenefitSalesAlteration = (combinedSummary?.alterationSummary ?? []).reduce(
   (total, item) => total + item.benefitSale,
   0
 );

 const totalBenefitSalesOther = (combinedSummary?.otherSalesSummary ?? []).reduce(
   (total, item) => total + item.benefitSale,
   0
 );

 const totalBenefitSalesMain = (combinedSummary?.mainsalesummary ?? []).reduce(
   (total, item) => total + item.benefitSale,
   0
 );

// // Add up all the cash sales totals
 const totalBenefitSales = totalBenefitSalesQuotation + totalBenefitSalesAlteration + totalBenefitSalesOther + totalBenefitSalesMain;
 

 const totalCreditSalesQuotation = (combinedSummary?.quotationsummary ?? []).reduce(
   (total, item) => total + item.creditSale,
   0
 );

 const totalCreditSalesAlteration = (combinedSummary?.alterationSummary ?? []).reduce(
   (total, item) => total + item.creditSale,
   0
 );

 const totalCreditSalesOther = (combinedSummary?.otherSalesSummary ?? []).reduce(
   (total, item) => total + item.creditSale,
   0
 );

 const totalCreditSalesMain = (combinedSummary?.mainsalesummary ?? []).reduce(
   (total, item) => total + item.creditSale,
   0
 );

  const splitName = (name) => {
    if (name.length > 20) {
      return `${name.substring(0, 20)}\n${name.substring(20)}`;
    }
    return name;
  };

// // Add up all the cash sales totals
 const totalCreditSales = totalCreditSalesQuotation + totalCreditSalesAlteration + totalCreditSalesOther + totalCreditSalesMain;
//  const totalcashout = (combinedSummary?.cashout?? []).reduce(
//   (total, item) => total + item.totalAmount,
//    0
//  );
const cashinout=(combinedSummary?.cashout ?? []).reduce((total,item) => total + item.totalAmount,0 )- (combinedSummary?.cashin ?? []).reduce((total,item) => total + item.totalAmount,0 );
 const cashinhand= totalCashSales - cashinout
 //const totalopeningbalance=(combinedSummary?.obcb ?? []).reduce((total,item) => total + item.totalOpeningBalance,0 )
 //const totalcashbalance=cashinhand + totalopeningbalance ;
//  const difference= totalclosingbalance - totalcashbalance
  return (
    <div>
        <Navbar/>
        
        <Box height={30} sx={{mt:"30px"}}/>
        <h2  style={{paddingTop:"20px"}}>Monthly Report</h2>
        <Box sx={{ display: 'flex' }}>
        <Sidenav/>
        <div className='salesheader' >
    <div className="salesmain">
      <div className="fields">
        <div className='fromtomonth'>
        <div className="from">
        <label className='fromlabelmonth' ><b>MONTH</b></label><br />
   <input className='salesselectmonth'   type="month"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="tomonth">
        <label className='tolabelmonth' ><b>YEAR</b></label><br />
   <input className='salesselectmonth' type="number" min="2010" max="2099" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)} />    
        </div></div>
        <div className="filter">
            <button className='filterb' onClick={handleViewClick}>VIEW</button>
        </div>
      </div>
    </div><br />
    <div className="salesheader2">
        <div className="reportsales">
        <Container>
        <Row>
         
          <Col>
       
                                {showModal && (
   <Modal className='modalr' show={showModal} onHide={handleCloseModal}>
   <Modal.Header className='mods' closeButton>
     <Modal.Title style={{ marginLeft: "135px" }}className="text-center w-100"> <br />
       <h5 style={{ marginLeft: "79px" }}></h5><p className='headingmonth'>MONTHLYREPORT</p>  <br />
     </Modal.Title>
   </Modal.Header>
   <div className='phead'>
     <div className='classphead2'><p>MONTH &nbsp;&nbsp;: </p><p className='classdatevalue'>{startTime}</p></div>
     <div className='classphead2'><p>YEAR&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;: </p><p className='classdatevalue'>{endTime}</p></div>
   </div>
   <div className='classparticular'>
     
      <p> <b>Particulars</b> </p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <p > <b>Amount</b></p> </div> 
    <hr />
    <p style={{ paddingLeft: "25px" }}><b>OTHERSALE</b></p><hr />
<div className='phead'>
  {combinedSummary?.otherSalesSummary?.length ? (
    combinedSummary.otherSalesSummary.map(({ cashSales, cardSales, creditSale, benefitSale,netTotalAmount }) => (
      <div key={cashSales}>
        <div className='classphead2'>
          <p>CASH</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashSales !== undefined ? cashSales.toFixed(3) : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>CARD</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cardSales !== undefined ? cardSales.toFixed(3)  : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>CREDIT</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{creditSale !== undefined ? creditSale.toFixed(3)  : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>BENEFIT</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{benefitSale !== undefined ? benefitSale.toFixed(3) : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p><b>TOTAL</b> &nbsp;&nbsp;&nbsp; </p>
          <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p>
          <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{netTotalAmount.toFixed(3) }</b> </p>
        </div>
      </div>
    ))
  ) : (
    <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
  )}
</div>
<hr />

<p style={{ paddingLeft: "25px" }}><b>DELIVERY</b></p><hr />
<div className='phead'>
  {combinedSummary?.mainsalesummary?.length ? (
    combinedSummary.mainsalesummary.map(({ cashSales, cardSales, creditSale, benefitSale,netTotalAmount  }) => (
      <div key={cashSales}>
       <div className='classphead2'>
          <p>CASH</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashSales !== undefined ? cashSales.toFixed(3) : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>CARD</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cardSales !== undefined ? cardSales.toFixed(3): "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>CREDIT</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{creditSale !== undefined ? creditSale.toFixed(3): "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>BENEFIT</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{benefitSale !== undefined ? benefitSale.toFixed(3): "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p><b>TOTAL</b> &nbsp;&nbsp;&nbsp; </p>
          <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p>
          <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{netTotalAmount.toFixed(3)}</b> </p>
        </div>
      </div>
    ))
  ) : (
    <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
  )}
</div>
<hr />

<p style={{ paddingLeft: "25px" }}><b>ALTERATION</b></p><hr />
<div className='phead'>
  {combinedSummary?.alterationSummary?.length ? (
    combinedSummary.alterationSummary.map(({ cashSales, cardSales, creditSale, benefitSale,netTotalAmount  }) => (
      <div key={cashSales}>
   <div className='classphead2'>
          <p>CASH</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashSales !== undefined ? cashSales.toFixed(3): "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>CARD</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cardSales !== undefined ? cardSales.toFixed(3): "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>CREDIT</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{creditSale !== undefined ? creditSale.toFixed(3): "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>BENEFIT</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{benefitSale !== undefined ? benefitSale.toFixed(3): "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p><b>TOTAL</b> &nbsp;&nbsp;&nbsp; </p>
          <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p>
          <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{netTotalAmount.toFixed(3) }</b> </p>
        </div>
      </div>
    ))
  ) : (
    <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
  )}
</div>
<hr />

<p style={{ paddingLeft: "25px" }}><b>QUOTATION</b></p><hr />
<div className='phead'>
  {combinedSummary?.quotationsummary?.length ? (
    combinedSummary.quotationsummary.map(({ cashSales, cardSales, creditSale, benefitSale,netTotalAmount  }) => (
      <div key={cashSales}>
       <div className='classphead2'>
          <p>CASH</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashSales !== undefined ? cashSales.toFixed(3): "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>CARD</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cardSales !== undefined ? cardSales.toFixed(3) : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>CREDIT</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{creditSale !== undefined ? creditSale.toFixed(3) : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p>BENEFIT</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{benefitSale !== undefined ? benefitSale.toFixed(3): "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p><b>TOTAL</b> &nbsp;&nbsp;&nbsp; </p>
          <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p>
          <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{netTotalAmount.toFixed(3) }</b> </p>
        </div>
      </div>
    ))
  ) : (
    <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
  )}
</div>
<hr />

 <p style={{ paddingLeft: "25px" }}><b>SALES RETURN</b></p>
<hr />
<div className='phead'>
  {combinedSummary?.salesReturnSummary && combinedSummary.salesReturnSummary.length > 0 ? (
    combinedSummary.salesReturnSummary.map(
      ({ cashSalesReturn, cardSalesReturn, benefitSalesReturn, creditSalesReturn }, index) => (
        <div key={index} className='classphead2'>
          <p>CASH SALES RETURN</p>
          <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{cashSalesReturn}</p>
          <p>CARD SALES RETURN</p>
          <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{cardSalesReturn}</p>
          <p>BENEFIT SALES RETURN</p>
          <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{benefitSalesReturn}</p>
          <p>CREDIT SALES RETURN</p>
          <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{creditSalesReturn}</p>
        </div>
      )
    )
  ) : (
    <div className='no-data'>
       <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
    </div>
  )}
</div>

    <hr /> 
     <p style={{ paddingLeft: "25px" }}><b>CASHOUT</b></p><hr />
    <div className='phead'>
      {combinedSummary?.cashout.map(({ description,totalAmount}) => (
      (
        <div>
        
          <div className='classphead2' key={description}>
            <p>{description}</p>
     
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{totalAmount.toFixed(3)}</p>
          </div>
    
          </div>
          
        )
      ))}      <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>   {combinedSummary.cashout.reduce((total, item) => total + item.totalAmount, 0).toFixed(3)}
     </b> </p></div>
 
        </div>
    <hr />
      <p style={{ paddingLeft: "25px" }}><b>CASHIN</b></p><hr />
    <div className='phead'>
      {combinedSummary?.cashin.map(({ description,totalAmount}) => (
      (
        <div>
        
          <div className='classphead2' key={description}>
            <p>{description}</p>
     
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{totalAmount.toFixed(3)}</p>
          </div>
         
          </div>
          
        )
      ))}
       <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>   {combinedSummary.cashin.reduce((total, item) => total + item.totalAmount,0).toFixed(3)}
       </b> </p></div>
 
        </div>
    <hr />  
     <p style={{ paddingLeft: "25px" }}><b>BOOKING</b></p>
<hr />
<div className='phead'>
  {combinedSummary?.jobOrder && combinedSummary.jobOrder.length > 0 ? (
    combinedSummary.jobOrder.map(({ debitamnt, narration }) => (
      <div className='classphead2' key={narration}>
        <p>{narration}</p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          {debitamnt.toFixed(3)}
        </p>
      </div>
    ))
  ) : (
    <div className='no-data'>
       <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
    </div>
  )}
</div>
<hr />
<p style={{ paddingLeft: "25px" }}><b>ALTERATION</b></p>
<hr />
<div className='phead'>
  {combinedSummary?.alteration && combinedSummary.alteration.length > 0 ? (
    combinedSummary.alteration.map(({ debitamnt, narration }) => (
      <div className='classphead2' key={narration}>
        <p>{narration}</p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          {debitamnt.toFixed(3)}
        </p>
      </div>
    ))
  ) : (
    <div className='no-data'>
    <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
    </div>
  )}
</div> 

    <hr />
    <p style={{ paddingLeft: "25px" }}><b>CATEGORY SUMMARY</b></p>
<hr />
<div className='phead'>
  {combinedSummary?.itemCategorySummary && combinedSummary.itemCategorySummary.length > 0 ? (
    combinedSummary.itemCategorySummary.map(({ categoryName, totalQuantity, totalNetAmount }) => (
      <div className='classphead2' key={categoryName}>
        <p>{categoryName}</p>
        {/* <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>
          {totalQuantity}
        </p> */}
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          {totalNetAmount.toFixed(3)}
        </p>
      </div>
    ))
  ) : (
    <div className='no-data'>
       <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
    </div>
  )}

  {combinedSummary?.itemCategorySummary && combinedSummary.itemCategorySummary.length > 0 && (
    <div className='classphead2'>
      <p><b>TOTAL &nbsp;&nbsp;&nbsp;</b></p>
      <b>
        {/* <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>
          {combinedSummary.itemCategorySummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.totalQuantity, 0)}
        </p> */}
      </b>
      <b>
        <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>
          {combinedSummary.itemCategorySummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.totalNetAmount, 0).toFixed(3)}
        </p>
      </b>
    </div>
  )}
</div>
<hr />

<p style={{ paddingLeft: "25px" }}><b>EMPLOYEE SUMMARY</b></p>
<hr />
<div className='phead'>
  {combinedSummary?.employeesummary && combinedSummary.employeesummary.length > 0 ? (
    combinedSummary.employeesummary.map(({ employeename,totalamount }) => (
      <div className='classphead2' key={employeename}>
        <p>{employeename}</p>
       
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          {totalamount.toFixed(3)}
        </p>
      </div>
    ))
  ) : (
    <div className='no-data'>
       <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
    </div>
  )}
   <div className='classphead2'>
      <p><b>TOTAL </b>&nbsp;&nbsp;&nbsp;</p>
      <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>
     <b>  
     </b>
      </p>
      <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>
      <b>  {combinedSummary.employeesummary.reduce((total, item) => total + item.totalamount, 0).toFixed(3)}    </b>
      </p>
    </div>
</div>



  
    <hr />
<p style={{ paddingLeft: "25px" }}><b>PRODUCT SUMMARY</b></p>
<hr />
<div className='phead'>
  {combinedSummary?.productSummary && combinedSummary.productSummary.length > 0 ? (
    combinedSummary.productSummary.map(({ productName, totalQuantity, totalNetAmount }) => (
      <div className='classphead2' key={productName}>
       <p style={{ whiteSpace: 'pre-wrap' }}>{splitName(productName)}</p>
        {/* <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>
          {totalQuantity}
        </p> */}
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          {totalNetAmount.toFixed(3)}
        </p>
       
      </div>
      
    ))
    
  ) : (
    <div className='no-data'>
       <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
    </div>
    
  )}

  {combinedSummary?.productSummary && combinedSummary.productSummary.length > 0 && (
    <div className='classphead2'>
      <p><b>TOTAL </b>&nbsp;&nbsp;&nbsp;</p>
      {/* <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>
     <b>   {combinedSummary.productSummary.reduce((total, item) => total + item.totalQuantity, 0)}
     </b>
      </p> */}
      <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>
      <b>  {combinedSummary.productSummary.reduce((total, item) => total + item.totalNetAmount, 0).toFixed(3)}    </b>
      </p>
    </div>
  )}
</div>

<hr />

<hr />
    <p style={{ paddingLeft: "25px" }}><b>VAT AMOUNT</b></p><hr />
    <div className='phead'>
     
          <div className='classphead2' >
            <p>VAT AMOUNT</p>
            
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>0.000</p>
          </div>
       
     
    </div>
    

   <hr />
   <div className='phead'>
  {combinedSummary?.obcb && ( // Check if obcb exists
    <div>
      <div className='classphead2'>
        <p><b>Cash in Hand</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          <b>{cashinhand}</b> 
        </p>
      </div>
      <div className='classphead2'>
        <p><b>Opening Balance</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          <b>{combinedSummary.obcb.totalOpeningBalance || 0}</b> {/* Display Opening Balance */}
        </p>
      </div>
      <div className='classphead2'>
        <p><b>Cash Balance</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
        <b>{(cashinhand || 0) + (combinedSummary?.obcb?.totalOpeningBalance || 0)}</b>

        </p>
      </div>
      <div className='classphead2'>
        <p><b>Closing Balance</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          <b>{combinedSummary.obcb.totalClosingBalance || 0}</b> {/* Display Closing Balance */}
        </p>
      </div>
      <div className='classphead2'>
        <p><b>Difference</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          <b>{ (combinedSummary?.obcb?.totalClosingBalance || 0) - ((cashinhand || 0) + (combinedSummary?.obcb?.totalOpeningBalance || 0)) }</b> {/* Display Difference */}
        </p>
      </div>
    </div>
  )}
</div>
<hr />
    <div className='phead'>
    <p style={{ paddingLeft: "25px" }}><b>Today Collection</b></p><hr />
    <div>
          <div className='classphead2' >
            <p><b>Cash</b> </p>
     
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'><b>{totalCashSales.toFixed(3)}</b> </p>
            </div>
            <div className='classphead2' >
            <p><b>Card</b> </p>
     
     <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'><b> {totalCardSales.toFixed(3)}</b></p>
     </div>
     <div className='classphead2' >
     <p><b>Benefit</b> </p>
     
     <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'><b>{totalBenefitSales.toFixed(3)}</b> </p>
     </div>
     <div className='classphead2' >
     <p> <b> Credit</b></p>
     
     <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'><b>{totalCreditSales.toFixed(3)}</b> </p>
          </div>
        
          </div>
    </div>
    <hr /> 
    <Modal.Body>
    <div className="container-fluid">
    
{/* 
      <Table striped hover color='black' className="table table-bordered tableclass">
        <tr>
          <th></th>
          <th>X</th>
          <th>=</th>
        </tr>
        <tr>
          <td className='TABLEROW'>20</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>10</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>5</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>1</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.500</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.100</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.050</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.025</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.010</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.005</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'></td>
          <td className='TABLEROW'>Total</td>
          <td className='TABLEROW'>=</td>
        </tr>
      </Table> */}
      </div>
     
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
    </Modal.Footer>
  </Modal>
)}
          </Col>
        </Row>
      </Container>
</div>
    </div>
    </div>
        </Box>
     
    </div>
  )
}

export default MonthEndReport