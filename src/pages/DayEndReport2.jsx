import React, { useEffect, useState } from 'react'
import Sidenav from '../components/Sidenav'
import { Box } from '@mui/material'
import Navbar from '../components/Navbar'
import '../pages/DayEnd.css'
import { Alert, Button, Col, Container, Modal, Row, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
function DayEndReport2() {
    const getDefaultDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 to month because getMonth() returns 0-based month
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    
      const [data, setData] = useState([]);
      const [filteredData, setFilteredData] = useState(null);
      const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage] = useState(200);
      const [selectedCounter, setSelectedCounter] = useState('');
      const [startTime, setStartTime] = useState(getDefaultDate());
      const [endTime, setEndTime] = useState(getDefaultDate());
      const [showModal, setShowModal] = useState(false);
      const [modalData, setModalData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [combinedSummary, setCombinedSummary] = useState({
        salesSummary: [],
        salesReturnSummary: [],
        mainsalesummary:[],
      });
    
      useEffect(() => {
        axios
          .get("http://localhost:5162/api/Accounting/dayendreport")
          .then((response) => {
            setData(response.data); // Directly set the fetched data
            setLoading(false);
          })
          .catch((error) => {
            console.error("There was an error fetching the day end report data!", error);
            setError("There was an error fetching the day end report data!");
            setLoading(false);
          });
      }, []);
      
    
      const fetchCombinedSummary = async (dayid, shiftid, userid, counter, location, invdate, Transactionid, invtypeid) => {
        try {
          const response = await axios.get(`http://localhost:5162/api/Accounting3/sales-summary`, {
            params: { dayid, shiftid, userid, counter, location, invdate, Transactionid, invtypeid }
          });
          setCombinedSummary(response.data || { salesSummary: [], salesReturnSummary: [] });
        } catch (error) {
          console.error("There was an error fetching the combined summary data!", error);
        }
      };
      
      console.log('Combined Summary:', combinedSummary);

      const handleViewClick = () => {
        let filtered = data;
    
        if (selectedCounter) {
            filtered = filtered.filter(item => item.countername === selectedCounter);
        }
    
        if (startTime && endTime) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.starttime).toISOString().split('T')[0];
                const startDate = new Date(startTime).toISOString().split('T')[0];
                const endDate = new Date(endTime).toISOString().split('T')[0];
                
                // Check if the dates match or are within the range
                return itemDate >= startDate && itemDate <= endDate;
            });
        }
    
        setFilteredData(filtered);
        setCurrentPage(1);
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
    
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = filteredData ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];

    
      const totalSale = (combinedSummary?.salesSummary || [])
      .filter(item => item.paymode !== 'MULTIPAYMODE')
      .reduce((total, item) => total + item.amount, 0);
    
    // const totalReturnSale = (combinedSummary?.salesReturnSummary || [])
    //   .filter(item => item.paymode !== 'MULTIPAYMODE')
    //   .reduce((total, item) => total + item.amount, 0);
    
    //  const totalAfterReturn = totalSale - totalReturnSale;
    const Totalothersale = (combinedSummary?.otherSalesSummary ?? []).reduce(
      (total, item) => total + item.cardSales + item.cashSales + item.creditSale + item.benefitSale,
      0
  );
  
  const Totalmainsale = (combinedSummary?.mainsalesummary ?? []).reduce(
      (total, item) => total + item.cardSales + item.cashSales + item.creditSale + item.benefitSale,
      0
  );
  
  const Totalalterationsale = (combinedSummary?.alterationSummary ?? []).reduce(
      (total, item) => total + item.cardSales + item.cashSales + item.creditSale + item.benefitSale,
      0
  );
  
  const Totalquotationsale = (combinedSummary?.quotationsummary ?? []).reduce(
      (total, item) => total + item.cardSales + item.cashSales + item.creditSale + item.benefitSale,
      0
  );
  // Calculate total cash sales from each summary
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

// Add up all the cash sales totals
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

// Add up all the cash sales totals
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

// Add up all the cash sales totals
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

// Add up all the cash sales totals
const totalCreditSales = totalCreditSalesQuotation + totalCreditSalesAlteration + totalCreditSalesOther + totalCreditSalesMain;
const totalcashout = (combinedSummary?.cashinout ?? []).reduce(
  (total, item) => total + item.totalAmount,
  0
);
const cashinhand= totalCashSales - totalcashout
const totalclosingbalance = (combinedSummary?.obcb ?? []).reduce(
  (total, item) => total + item.openningbalance,
  0
); 
const totalcashbalance=cashinhand + totalclosingbalance ;
const difference= totalclosingbalance - totalcashbalance;

const splitName = (name) => {
  if (name.length > 20) {
    return `${name.substring(0, 20)}\n${name.substring(20)}`;
  }
  return name;
};
  return (
    <div>
        <Navbar/>
        
        <Box height={30} sx={{mt:"30px"}}/>
        <h2 style={{paddingTop:"20px"}}>Day End Report</h2>
        <Box sx={{ display: 'flex' }}>
        <Sidenav/>
        <div className='salesheaderdend' >
    <div className="salesmaindend">
      <div className="fieldsdend">
        <div className="saleddend">
        <label className='salesselectlabeldend' htmlFor="counter-select">BRANCH</label><br />
<select
  id="counter-select"
  className='salesselectdend'
  value={selectedCounter}
  onChange={(e) => setSelectedCounter(e.target.value)}
>
  <option value="">Select Options</option>
  {[...new Set(data.map(option => option.countername))].map(countername => (
    <option key={countername} value={countername}>
      {countername}
    </option>
  ))}
</select>
        </div>
        <div className="fromdend">
        <label className='fromlabeldend' >From*</label><br />
   <input className='salesselectdend'   type="date"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="todend">
        <label className='tolabeldend' >To*</label><br />
   <input className='salesselectdend'  type="date"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)} />    
        </div>
        <div className="filterdend">
            <button className='filterbdend' onClick={handleViewClick}>VIEW</button>
        </div>
      </div>
    </div><br />
    <div className="salesheader2">
        <div className="reportsalesend">
        <Container>
        <Row>
         
          <Col>
            {loading ? (
              <Spinner animation="border" />
            ) : error ? (
              <Alert variant="danger">
                {error}
              </Alert>
            ) : filteredData === null ? (
              <Alert className='alertbox' >
                No data available. Please select the counter and date range to view the details.
              </Alert>
            ) : filteredData.length === 0 ? (
              <Alert variant="warning">
                No data available for the selected counter and date range.
              </Alert>
            ) : (
              <>
                  <Table hover variant="blue" className='tableclasss'>
                  <thead>
                    <tr>
                      <th>Sno</th>
                      <th>USERNAME</th>
                      <th>COUNTER</th>
                      <th>START TIME</th>
                      <th>END TIME</th>
                      <th>LOCATION</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr style={{textAlign:"center"}} key={index}>
                        <td>{index+1}</td>
                        <td >{item.name}</td>
                        <td>{item.countername}</td>
                        <td>{item.starttime}</td>
                        <td>
              {item.endtime === "1900-01-01 12:00 AM" ?    "  Running" : item.endtime}
            </td>
                        <td>{item.location}</td>
                        
                  
                    
                        
                        <td>
                          <Button
                          className='viewbutton'
                            style={{ height: "38px",color:"white",backgroundColor:" rgb(34, 7, 63)" }}
                            
                            onClick={() => handleShowModal(item)}
                          >
                            VIEW
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </Table>
              </>
            )}
                                {showModal && (
   <Modal show={showModal} onHide={handleCloseModal} className='modalredend'>
   <Modal.Header className='modss' closeButton> 
     <Modal.Title style={{ marginLeft: "135px" }}>
       {/* <h5 style={{ }}>ManamaCenter </h5>  */}
       <p className='headingmonthe'>DAY&nbsp;END&nbsp;REPORT</p>  <br />
     </Modal.Title>
   </Modal.Header>
   <div className='phead'>
     <div className='classphead2'><p>Start Date &nbsp;&nbsp;: </p><p className='classdatevalue'>{modalData?.startDate}</p></div>
     <div className='classphead2'><p>Start Time&nbsp;&nbsp; : </p><p className='classdatevalue'>{modalData?.startTime}</p></div>
     <div className='classphead2'><p>End Date&nbsp;&nbsp;&nbsp;&nbsp; :</p><p className='classdatevalue'>{modalData?.endDate === "1/1/1900" ?    "  Running" : modalData?.endDate}</p></div>
     <div className='classphead2'><p>End Time &nbsp;&nbsp;&nbsp; : </p><p className='classdatevalue'>{modalData?.endTime  === "12:00:00 AM" ?    "  Running" :modalData?.endTime}</p></div>
     <div className='classphead2'><p>UserName &nbsp; : </p><p className='classdatevalue'>{modalData?.name}</p></div>
     <div className='classphead2'><p>Counter&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : </p><p className='classdatevalue'>{modalData?.countername}</p></div>
   </div>
   <div className='classparticular'>
     
     
   <p> <b>Particulars</b> </p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   <p > <b>Amount</b></p> </div> 
    <hr />
    <p style={{ paddingLeft: "25px" }}className="mb-3"><b>OTHERSALE</b></p><hr />
<div className='phead'>
  {combinedSummary?.otherSalesSummary?.length ? (
    combinedSummary.otherSalesSummary.map(({ cashSales, cardSales, creditSale, benefitSale }) => (
      <div key={cashSales}>
        <div className='classphead2'>
          <p>CASH</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashSales !== undefined ? cashSales.toFixed(3) : "0.000"}</p>
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
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{benefitSale !== undefined ? benefitSale.toFixed(3) : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p><b>TOTAL</b> &nbsp;&nbsp;&nbsp; </p>
          <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p>
          <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{Totalothersale.toFixed(3)}</b> </p>
        </div>
      </div>
    ))
  ) : (
    <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
  )}
</div>
<hr />

<p style={{ paddingLeft: "25px" }}className="mb-3"><b>DELIVERY</b></p><hr />
<div className='phead'>
  {combinedSummary?.mainsalesummary?.length ? (
    combinedSummary.mainsalesummary.map(({ cashSales, cardSales, creditSale, benefitSale }) => (
      <div key={cashSales}>
       <div className='classphead2'>
          <p>CASH</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashSales !== undefined ? cashSales.toFixed(3) : "0.000"}</p>
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
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{benefitSale !== undefined ? benefitSale.toFixed(3) : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p><b>TOTAL</b> &nbsp;&nbsp;&nbsp; </p>
          <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p>
          <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{Totalmainsale.toFixed(3)}</b> </p>
        </div>
      </div>
    ))
  ) : (
    <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
  )}
</div>
<hr />

<p style={{ paddingLeft: "25px" }}className="mb-3"><b>ALTERATION</b></p><hr />
<div className='phead'>
  {combinedSummary?.alterationSummary?.length ? (
    combinedSummary.alterationSummary.map(({ cashSales, cardSales, creditSale, benefitSale }) => (
      <div key={cashSales}>
   <div className='classphead2'>
          <p>CASH</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashSales !== undefined ? cashSales.toFixed(3) : "0.000"}</p>
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
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{benefitSale !== undefined ? benefitSale.toFixed(3) : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p><b>TOTAL</b> &nbsp;&nbsp;&nbsp; </p>
          <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p>
          <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{Totalalterationsale.toFixed(3)}</b> </p>
        </div>
      </div>
    ))
  ) : (
    <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
  )}
</div>
<hr />

<p style={{ paddingLeft: "25px" }}className="mb-3"><b>QUOTATION</b></p><hr />
<div className='phead'>
  {combinedSummary?.quotationsummary?.length ? (
    combinedSummary.quotationsummary.map(({ cashSales, cardSales, creditSale, benefitSale }) => (
      <div key={cashSales}>
       <div className='classphead2'>
          <p>CASH</p>
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashSales !== undefined ? cashSales.toFixed(3) : "0.000"}</p>
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
          <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{benefitSale !== undefined ? benefitSale.toFixed(3) : "0.000"}</p>
        </div>
        <div className='classphead2'>
          <p><b>TOTAL</b> &nbsp;&nbsp;&nbsp; </p>
          <p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p>
          <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{Totalquotationsale.toFixed(3)}</b> </p>
        </div>
      </div>
    ))
  ) : (
    <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>0.000</b> </p></div>
 
  )}
</div>
<hr />

<p style={{ paddingLeft: "25px" }}className="mb-3"><b>SALES RETURN</b></p>
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
     <p style={{ paddingLeft: "25px" }}className="mb-3"><b>CASHOUT</b></p><hr />
    <div className='phead'>
      {combinedSummary?.cashinout.map(({ description,cashOutAmount}) => (
      (
        <div>
        
          <div className='classphead2' key={description}>
            <p>{description}</p>
     
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashOutAmount.toFixed(3)}</p>
          </div>
          <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{cashOutAmount.toFixed(3)}</b> </p></div>
 
          </div>
          
        )
      ))}
        </div>
    <hr />
      <p style={{ paddingLeft: "25px" }}className="mb-3"><b>CASHIN</b></p><hr />
    <div className='phead'>
      {combinedSummary?.cashinout.map(({ description,cashInAmount}) => (
      (
        <div>
        
          <div className='classphead2' key={description}>
            <p>{description}</p>
     
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{cashInAmount.toFixed(3)}</p>
          </div>
          <div className='classphead2'><p><b>TOTAL&nbsp;&nbsp;&nbsp;</b> </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}></p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}> <b>{cashInAmount.toFixed(3)}</b> </p></div>
 
          </div>
          
        )
      ))}
        </div>
    <hr />
    <p style={{ paddingLeft: "25px" }}className="mb-3"><b>BOOKING</b></p>
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
<p style={{ paddingLeft: "25px" }}className="mb-3"><b>ALTERATION</b></p>
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
    <p style={{ paddingLeft: "25px" }}className="mb-3"><b>CATEGORY SUMMARY</b></p>
<hr />
<div className='phead'>
  {combinedSummary?.itemCategorySummary && combinedSummary.itemCategorySummary.length > 0 ? (
    combinedSummary.itemCategorySummary.map(({ categoryName, totalQuantity, netTotalAmount }) => (
      <div className='classphead2' key={categoryName}>
        <p>{categoryName}</p>
        {/* <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>
          {totalQuantity}
        </p> */}
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          {netTotalAmount.toFixed(3)}
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
          {combinedSummary.itemCategorySummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.netTotalAmount, 0).toFixed(3)}
        </p>
      </b>
    </div>
  )}
</div>
<hr />

<p style={{ paddingLeft: "25px" }}className="mb-3"><b>EMPLOYEE SUMMARY</b></p>
<hr />
<div className='phead'>
  {combinedSummary?.employeeSummary && combinedSummary.employeeSummary.length > 0 ? (
    combinedSummary.employeeSummary.map(({ employeeName, totalTransactions, totalNetAmount }) => (
      <div className='classphead2' key={employeeName}>
        <p>{employeeName}</p>
        {/* <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>
          {totalTransactions}
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
</div>
<hr />

<p style={{ paddingLeft: "25px" }}className="mb-3"><b>PRODUCT SUMMARY</b></p>
<hr />
<div className='phead'>
  {combinedSummary?.productSummary && combinedSummary.productSummary.length > 0 ? (
    combinedSummary.productSummary.map(({ productName, productQuantity, productNetAmount }) => (
      <div className='classphead2' key={productName}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{splitName(productName)}</p>
        {/* <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>
          {productQuantity}
        </p> */}
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          {productNetAmount.toFixed(3)}
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
     <b>   {combinedSummary.productSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.productQuantity, 0)}
     </b>
      </p> */}
      <p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>
      <b>  {combinedSummary.productSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.productNetAmount, 0).toFixed(3)}
      </b>
      </p>
    </div>
  )}
</div>
<hr />

    <p style={{ paddingLeft: "25px" }}className="mb-3"><b>VAT AMOUNT</b></p><hr />
    <div className='phead'>
     
          <div className='classphead2' >
            <p>VAT AMOUNT</p>
            
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>0.000</p>
          </div>
       
     
    </div>
    <hr />
   
    <div className='phead'>
  {combinedSummary?.obcb?.[0] && ( // Check if there's at least one item in obcb
    <div className="mb-3">
      <div className='classphead2'>
        <p><b>Cash in Hand</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          <b>{cashinhand.toFixed(3)}</b>
        </p>
      </div>
      <div className='classphead2'>
        <p><b>Opening Balance</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          <b>{combinedSummary.obcb[0].openningbalance.toFixed(3)}</b>
        </p>
      </div>
      <div className='classphead2'>
        <p><b>Cash Balance</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          <b>{totalcashbalance.toFixed(3)}</b>
        </p>
      </div>
      <div className='classphead2'>
        <p><b>Closing Balance</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          <b>{combinedSummary.obcb[0].closingbalance.toFixed(3)}</b>
        </p>
      </div>
      <div className='classphead2'>
        <p><b>Difference</b></p>
        <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>
          <b>{difference.toFixed(3)}</b>
        </p>
      </div>
    </div>
  )}
</div>
<hr />

    
    
    <div className='phead'>
    <p style={{ paddingLeft: "25px" }} className="mb-3"><b>Today Collection</b></p><hr />
    <div >
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
      {/* <Table striped hover color='black' className='tableclass'>
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

export default DayEndReport2