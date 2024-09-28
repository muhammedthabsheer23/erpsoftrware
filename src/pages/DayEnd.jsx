// import React, { useEffect, useState } from 'react'
// import Sidenav from '../components/Sidenav'
// import { Box } from '@mui/material'
// import Navbar from '../components/Navbar'

// import { Alert, Button, Col, Container, Modal, Row, Spinner, Table } from 'react-bootstrap';
// import axios from 'axios';
// function DayEnd() {
//     const getDefaultDate = () => {
//         const today = new Date();
//         const year = today.getFullYear();
//         const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 to month because getMonth() returns 0-based month
//         const day = String(today.getDate()).padStart(2, '0');
//         return `${year}-${month}-${day}`;
//       };
    
//       const [data, setData] = useState([]);
//       const [filteredData, setFilteredData] = useState(null);
//       const [currentPage, setCurrentPage] = useState(1);
//       const [itemsPerPage] = useState(7);
//       const [selectedCounter, setSelectedCounter] = useState('');
//       const [startTime, setStartTime] = useState(getDefaultDate());
//       const [endTime, setEndTime] = useState(getDefaultDate());
//       const [showModal, setShowModal] = useState(false);
//       const [modalData, setModalData] = useState(null);
//       const [loading, setLoading] = useState(true);
//       const [error, setError] = useState(null);
//       const [combinedSummary, setCombinedSummary] = useState(null);
    
//       useEffect(() => {
//         axios.get("http://localhost:5162/api/Accounting/dayendreport")
//           .then((response) => {
//             const uniqueData = getUniqueData(response.data);
//             setData(uniqueData);
//             setLoading(false);
//           })
//           .catch(error => {
//             console.error("There was an error fetching the day end report data!", error);
//             setError("There was an error fetching the day end report data!");
//             setLoading(false);
//           });
//       }, []);
    
//       const getUniqueData = (data) => {
//         const seen = new Set();
//         return data.filter(item => {
//           const uniqueKey = `${item.name}-${item.countername}-${item.starttime}-${item.endtime}-${item.location}`;
//           if (seen.has(uniqueKey)) {
//             return false;
//           } else {
//             seen.add(uniqueKey);
//             return true;
//           }
//         });
//       };
    
//       const fetchCombinedSummary = async (dayid, shiftid, userid, counter, location, invdate, Transactionid) => {
//         try {
//           const response = await axios.get(`http://localhost:5162/api/AccountingController2/combined-summary`, {
//             params: { dayid, shiftid, userid, counter, location, invdate, Transactionid }
//           });
//           setCombinedSummary(response.data);
//         } catch (error) {
//           console.error("There was an error fetching the combined summary data!", error);
//         }
//       };
    
//       const handleViewClick = () => {
//         let filtered = data;
    
//         if (selectedCounter) {
//           filtered = filtered.filter(item => item.countername === selectedCounter);
//         }
    
//         if (startTime && endTime) {
//           filtered = filtered.filter(item => {
//             const itemStartTime = new Date(item.starttime).getTime();
//             const filterStartTime = new Date(startTime).getTime();
//             const filterEndTime = new Date(endTime).getTime();
//             return itemStartTime >= filterStartTime && itemStartTime <= filterEndTime;
//           });
//         }
    
//         setFilteredData(filtered);
//         setCurrentPage(1);
//       };
    
//       const handleShowModal = async (item) => {
//         const startDateTime = new Date(item.starttime);
//         const endDateTime = item.endtime ? new Date(item.endtime) : null;
    
//         await fetchCombinedSummary(item.dayid, item.shiftid, item.id, item.counterid, item.locationId, startDateTime, item.transactionid);
    
//         setModalData({
//           ...item,
//           startDate: startDateTime.toLocaleDateString(),
//           startTime: startDateTime.toLocaleTimeString(),
//           endDate: endDateTime ? endDateTime.toLocaleDateString() : '',
//           endTime: endDateTime ? endDateTime.toLocaleTimeString() : '',
//         });
//         setShowModal(true);
//       };
    
//       const handleCloseModal = () => {
//         setShowModal(false);
//         setModalData(null);
//         setCombinedSummary(null);
//       };
    
//       const indexOfLastItem = currentPage * itemsPerPage;
//       const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//       const currentItems = filteredData ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : [];
    
//       const totalSale = combinedSummary?.salesSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0) || 0;
//       const totalReturnSale = combinedSummary?.salesReturnSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0) || 0;
//       const totalAfterReturn = totalSale - totalReturnSale;
    
    
//   return (
//     <div>
//         <Navbar/>
        
//         <Box height={30} sx={{mt:"30px"}}/>
//         <h2 style={{paddingTop:"20px"}}>Day End Report</h2>
//         <Box sx={{ display: 'flex' }}>
//         <Sidenav/>
//         <div className='salesheader' >
//     <div className="salesmain">
//       <div className="fields">
//         <div className="saled">
//         <label className='salesselectlabel' htmlFor="counter-select">BRANCH</label><br />
// <select
//   id="counter-select"
//   className='salesselect'
//   value={selectedCounter}
//   onChange={(e) => setSelectedCounter(e.target.value)}
// >
//   <option value="">Select Options</option>
//   {[...new Set(data.map(option => option.countername))].map(countername => (
//     <option key={countername} value={countername}>
//       {countername}
//     </option>
//   ))}
// </select>
//         </div>
//         <div className="from">
//         <label className='fromlabel' >From*</label><br />
//    <input className='salesselect'   type="date"
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)} />
//         </div>
//         <div className="to">
//         <label className='tolabel' >To*</label><br />
//    <input className='salesselect'  type="date"
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)} />    
//         </div>
//         <div className="filter">
//             <button className='filterb' onClick={handleViewClick}>VIEW</button>
//         </div>
//       </div>
//     </div><br />
//     <div className="salesheader2">
//         <div className="reportsales">
//         <Container>
//         <Row>
         
//           <Col>
//             {loading ? (
//               <Spinner animation="border" />
//             ) : error ? (
//               <Alert variant="danger">
//                 {error}
//               </Alert>
//             ) : filteredData === null ? (
//               <Alert className='alertbox' >
//                 No data available. Please select the counter and date range to view the details.
//               </Alert>
//             ) : filteredData.length === 0 ? (
//               <Alert variant="warning">
//                 No data available for the selected counter and date range.
//               </Alert>
//             ) : (
//               <>
//                 <Table hover variant="blue" className='tableclasss'>
//                   <thead>
//                     <tr>
//                       <th>Sno</th>
//                       <th>USERNAME</th>
//                       <th>COUNTER</th>
//                       <th>START TIME</th>
//                       <th>END TIME</th>
//                       <th>LOCATION</th>
//                       <th>ACTION</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentItems.map((item, index) => (
//                       <tr style={{textAlign:"start"}} key={index}>
//                         <td>{index+1}</td>
//                         <td >{item.name}</td>
//                         <td>{item.countername}</td>
//                         <td>{item.starttime}</td>
//                         <td>{item.endtime}</td>
//                         <td>{item.location}</td>
                        
//                         <td>
//                           <Button
//                             style={{ height: "38px",color:"white",backgroundColor:" rgb(34, 7, 63)" }}
                            
//                             onClick={() => handleShowModal(item)}
//                           >
//                             VIEW
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
              
//               </>
//             )}
//                                 {showModal && (
//    <Modal show={showModal} onHide={handleCloseModal}>
//    <Modal.Header closeButton>
//      <Modal.Title style={{ marginLeft: "135px" }}>
//        <h5 style={{ marginLeft: "49px" }}>Manama Center </h5> &nbsp;&nbsp;&nbsp;SHIFTENDREPORT <br />
//      </Modal.Title>
//    </Modal.Header>
//    <div className='phead'>
//      <div className='classphead2'><p>Start Date &nbsp;&nbsp;: </p><p className='classdatevalue'>{modalData?.startDate}</p></div>
//      <div className='classphead2'><p>Start Time&nbsp;&nbsp; : </p><p className='classdatevalue'>{modalData?.startTime}</p></div>
//      <div className='classphead2'><p>End Date&nbsp;&nbsp;&nbsp;&nbsp; :</p><p className='classdatevalue'>{modalData?.endDate}</p></div>
//      <div className='classphead2'><p>End Time &nbsp;&nbsp;&nbsp; : </p><p className='classdatevalue'>{modalData?.endTime}</p></div>
//      <div className='classphead2'><p>UserName &nbsp; : </p><p className='classdatevalue'>{modalData?.name}</p></div>
//      <div className='classphead2'><p>Counter&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : </p><p className='classdatevalue'>{modalData?.countername}</p></div>
//    </div>
//    <div className='classparticular'>
     
//       <p>Particulars</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//       <p>Count </p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//       <p>Amount</p>
//     </div><hr />
//     <p style={{ paddingLeft: "25px" }}><b>SALES</b></p><hr />
//     <div className='phead'>
//       {combinedSummary?.salesSummary.map(({ paymode, count, amount }) => (
//         paymode !== 'MULTIPAYMODE' && (
//           <div className='classphead2' key={paymode}>
//             <p>{paymode}</p>
//             <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{count}</p>
//             <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{amount.toFixed(3)}</p>
//           </div>
//         )
//       ))}
//       <div className='classphead2'><p>TOTAL &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>{combinedSummary?.salesSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.count, 0)}</p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{combinedSummary?.salesSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0).toFixed(3)}</p></div>
//     </div>
//     <hr />
//     <p style={{ paddingLeft: "25px" }}><b>SALES RETURN</b></p><hr />
//     <div className='phead'>
//       {combinedSummary?.salesReturnSummary.map(({ paymode, count, amount }) => (
//         paymode !== 'MULTIPAYMODE' && (
//           <div className='classphead2' key={paymode}>
//             <p>{paymode}</p>
//             <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{count}</p>
//             <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{amount.toFixed(3)}</p>
//           </div>
//         )
//       ))}
//       <div className='classphead2'><p>TOTAL &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>{combinedSummary?.salesReturnSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.count, 0)}</p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{combinedSummary?.salesReturnSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0).toFixed(3)}</p></div>
//       <div className='classphead2'><p>TOTAL AFTER RETURN &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{(combinedSummary?.salesSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0) - combinedSummary?.salesReturnSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0)).toFixed(3)}</p></div>
//     </div>
//     <hr />
//     <p style={{ paddingLeft: "25px" }}><b>CATEGORY SUMMARY</b></p><hr />
//     <div className='phead'>
//       {combinedSummary?.itemCategorySummary.map(({ categoryName,totalQuantity,totalNetAmount }) => (
//       (
//           <div className='classphead2' key={categoryName}>
//             <p>{categoryName}</p>
//             <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{totalQuantity}</p>
//             <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{totalNetAmount.toFixed(3)}</p>
//           </div>
//         )
//       ))}
//       <div className='classphead2'><p>TOTAL &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>{combinedSummary?.itemCategorySummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.totalQuantity, 0)}</p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{combinedSummary?.itemCategorySummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.totalNetAmount, 0).toFixed(3)}</p></div>
//     </div>
//     <hr />
//     <p style={{ paddingLeft: "25px" }}><b>EMPLOYEE SUMMARY</b></p><hr />
//     <div className='phead'>
//       {combinedSummary?.employeeSummary.map(({ employeeName,totalTransactions,totalNetAmount }) => (
//       (
//           <div className='classphead2' key={employeeName}>
//             <p>{employeeName}</p>
//             <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{totalTransactions}</p>
//             <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{totalNetAmount.toFixed(3)}</p>
//           </div>
//         )
//       ))}
     
//     </div>
//     <hr />
//     <p style={{ paddingLeft: "25px" }}><b>PRODUCT SUMMARY</b></p><hr />
//     <div className='phead'>
//       {combinedSummary?.productSummary.map(({ productName,productQuantity,productNetAmount}) => (
//       (
//           <div className='classphead2' key={productName}>
//             <p>{productName}</p>
//             <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{productQuantity}</p>
//             <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{productNetAmount.toFixed(3)}</p>
//           </div>
//         )
//       ))}
//       <div className='classphead2'><p>TOTAL &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>{combinedSummary?.productSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.productQuantity, 0)}</p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{combinedSummary?.productSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.productNetAmount, 0).toFixed(3)}</p></div>
  
//     </div>
//     <hr />
//     <Modal.Body>
//       <Table striped hover color='black' className='tableclass'>
//         <tr>
//           <th></th>
//           <th>X</th>
//           <th>=</th>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>20</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>10</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>5</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>1</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>.500</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>.100</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>.050</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>.025</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>.010</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'>.005</td>
//           <td className='TABLEROW'>X</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//         <tr>
//           <td className='TABLEROW'></td>
//           <td className='TABLEROW'>Total</td>
//           <td className='TABLEROW'>=</td>
//         </tr>
//       </Table>
     
//     </Modal.Body>
//     <Modal.Footer>
//       <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
//     </Modal.Footer>
//   </Modal>
// )}
//           </Col>
//         </Row>
//       </Container>
// </div>
//     </div>
//     </div>
//         </Box>
     
//     </div>
//   )
// }

// export default DayEnd