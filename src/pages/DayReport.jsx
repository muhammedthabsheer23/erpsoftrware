import React, { useState } from 'react';
import Sidenav from '../components/Sidenav';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import { Button, Col, Container, Row, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../pages/DayReport.css';

function DayReport() {
  const getDefaultDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(getDefaultDate);
  const [toDate, setToDate] = useState(getDefaultDate);
  const [isDataFetched, setIsDataFetched] = useState(false); // New state to track if data is fetched

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setIsDataFetched(false); // Reset before fetching new data

    axios.get('http://thbsheer-001-site1.ktempurl.com/api/Accounting/dayday', {
      params: {
        startDate: fromDate,
        endDate: toDate
      }
    })
      .then((response) => {
        setData(response.data);
        setLoading(false);
        setIsDataFetched(true); // Set true when data is fetched
      })
      .catch(error => {
        console.error("There was an error fetching the day end report data!", error);
        setError("There was an error fetching the day end report data!");
        setLoading(false);
        setIsDataFetched(false); // Keep false if there's an error
      });
  };

  const handlePrint = () => {
    const contentToPrint = document.getElementById('printable-table');
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = contentToPrint.outerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload the page to restore event listeners and original content
  };
 
  const handleExportToExcel = async () => {
    // Excel export logic (same as before)
  };
  
  const handleExportToPDF = () => {
    const contentToExport = document.getElementById('printable-table');
    html2canvas(contentToExport).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('DayReport.pdf');
    });
  };

  const calculateTotalNetAmount = () => {
    return data.reduce((total, item) => total + item.netTotalAmount, 0).toFixed(3);
  };

  return (
    <div>
      <Navbar />
      <Box height={30} sx={{ mt: "32px" }} />
      <h2 style={{paddingTop:"10px"}}>Day Report</h2>
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <div className='salesheaderday'>
          <div className="salesmainday">
            <div className="fieldsday">
              <div className='fromtoday'>
              <div className="fromday">
                <label className='fromlabelday' ><b>From*</b></label><br />
                <input className='salesselectday' type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="today">
                <label className='tolabelday' ><b>To*</b></label><br />
                <input className='salesselectday' type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)} />
              </div></div>
              <div className='filterday'>
                <button className='filtertday' onClick={fetchData} >VIEW</button>
                <button className='filtertday' onClick={handleExportToExcel} > EXCEL</button>
                <button className='filtertday' onClick={handlePrint}>PRINT</button>
                <button className='filtertday' onClick={handleExportToPDF} > PDF</button>
                </div>
            </div>
          </div><br />
          
          {/* Conditionally render the table if data is fetched */}
          {isDataFetched && (
            <div className="salesheader2day">
              <div className="reportsalesday">
                <Container fluid>
               <Row>
                    <Col    >
                      {loading ? (
                        <p>Loading...</p>
                      ) : error ? (
                        <p>{error}</p>
                      ) : (
                        <>
                      
                          <Table  striped bordered hover variant="blue" className='tableclasssday' id="printable-table">
                            <thead>
                              <tr>
                                <th>Sno</th>
                                <th>DATE</th>
                                <th>CASH SALES</th>
                                <th>VISACARD SALES</th>
                                <th>BENEFITPAY SALES</th>
                                <th>CREDIT SALES</th>
                                <th>TOTAL SALES</th>
                              </tr>
                            </thead>
                            <tbody style={{ overflowY: "scroll" }}>
                              {data.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td style={{textAlign:"start"}}>{item.invDate}</td>
                                  <td style={{textAlign:"end"}}>{item.cashSales.toFixed(3)}</td>
                                  <td style={{textAlign:"end"}}>{item.cardSales.toFixed(3)}</td>
                                  <td style={{textAlign:"end"}}>{item.benefitSales.toFixed(3)}</td>
                                  <td style={{textAlign:"end"}}>{item.creditSales.toFixed(3)}</td>
                                  <td style={{textAlign:"end"}}>{item.netTotalAmount.toFixed(3)}</td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan="6" style={{ fontWeight: 'bold', textAlign: 'right' }}>Total:</td>
                                <td style={{ fontWeight: 'bold',textAlign:"right" }}>{calculateTotalNetAmount()}</td>
                              </tr>
                            </tbody>
                          </Table>
                         
                        </>
                      )}
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
}

export default DayReport;
