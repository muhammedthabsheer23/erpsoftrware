import React, { useState } from 'react'
import Sidenav from '../components/Sidenav'
import {Box} from '@mui/material'
import Navbar from '../components/Navbar'
import { Button, Col, Container, Row, Spinner, Table } from 'react-bootstrap'
import axios from 'axios'
import '../pages/DayReport.css'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function PurchaseSummary() {
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
  const [isDataFetched, setIsDataFetched] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setIsDataFetched(false); 
    axios.get('http://localhost:5162/api/AccountingController2/productsales', {
      params: {
        startDate: fromDate,
        endDate: toDate
      }
    })
    .then((response) => {
      setData(response.data);
      setLoading(false);
      setIsDataFetched(true); 
    })
    .catch(error => {
      console.error("There was an error fetching the day end report data!", error);
      setError("There was an error fetching the day end report data!");
      setLoading(false);
      setIsDataFetched(false);
    });
  };
  const calculateTotalNetAmount = () => {
    return data.reduce((total, item) => total + item.netProductNetAmount, 0).toFixed(3);
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
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DayReport');
    
    // Define a bold and large font style for the main heading
    const boldAndLargeStyle = {
      font: {
        bold: true,
        size: 20, // Font size 20 (Excel uses point size, not pixels)
      },
      alignment: {
        horizontal: 'center',
      },
    };
    
    // Define a bold style for the column headers
     const boldAndExtraLargeStyle = {
      font: {
        bold: true,
        size: 12, // Font size 50 for the column headers
      },
      alignment: {
        horizontal: 'center',
      },
    };
    
    // Add the main heading to the first row
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = `PurchaseReportSummary`; // Heading as DayReportSummary
    worksheet.getCell('A1').style = boldAndLargeStyle;
    
    // Add the date range to the second row
    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').value = `From: ${fromDate}   To: ${toDate}`;
    worksheet.getCell('A2').style = boldAndLargeStyle;
    
    // Add column headers starting from the third row
    const headerRow = worksheet.getRow(3);
  headerRow.values = ['Sno', 'BARCODE', 'PRODUCTNAME', 'CATEGORY', 'QUANTITY', 'AMOUNT'];
  
  headerRow.eachCell((cell) => {
    cell.style = boldAndExtraLargeStyle;
  });
    // Adjust the column widths
    worksheet.columns = [
      {  key: 'sno', width: 10 },
      { key: 'barcode', width: 20 },
      { key: 'productName', width: 30 },
      {  key: 'category', width: 20 },
      { key: 'netProductQuantity', width: 15 },
      {  key: 'netProductNetAmount', width: 15 }, // Update key to reflect DayReportSummary
    ];
    
    // Add data to the worksheet starting from the fourth row
    data.forEach((item, index) => {
      worksheet.addRow({
        sno: index + 1,
        barcode: item.barcode,
        productName: item.productName,
        category: item.category,
        netProductQuantity: item.netProductQuantity,
        netProductNetAmount: item.netProductNetAmount.toFixed(3),
      });
    });
    const totalNetAmount = calculateTotalNetAmount();
    const totalRow = worksheet.addRow({
      sno: '',
      barcode: '',
      productName: '',
      category: 'Total',
      netProductQuantity: '',
      netProductNetAmount: totalNetAmount,
    });
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
    });
    
    // Save the workbook to a buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'DayReport.xlsx');
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
      pdf.save('ProductSummary.pdf');
    });
  };
  return (
    <div>
        <Navbar/>
        <Box height={30} sx={{mt:"25px"}}/>
        <h2 style={{paddingTop:"20px"}}>Product Summary</h2>
        <Box sx={{ display: 'flex' }}>
        <Sidenav/>
        <div className='salesheaderday' >
    <div className="salesmainday">
      <div className="fieldsday">
        <div className='fromtoday'>
        <div className="fromday">
        <label className='fromlabelday' > <b>From*</b></label><br />
   <input className='salesselectday'   type="date"
           
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}   />
        </div> 
        <div className="today">
        <label className='tolabelday' ><b>To*</b></label><br />
   <input className='salesselectday'  type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)} />    
        </div></div>
        <div className='filterday'>
            <button className='filtertday' onClick={fetchData} >VIEW</button>
            <button className='filtertday' onClick={handleExportToExcel} > EXCEL</button>
            <button className='filtertday' onClick={handleExportToPDF} > PDF</button>
            <button className='filtertday' onClick={handlePrint}>PRINT</button>
       
            </div>
      </div>
    </div><br />
    {isDataFetched && (
    <div className="salesheader2day">
        <div className="reportsalesday">
        <Container>
        <Row>
         
          <Col>
          {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
          
                <Table striped bordered hover variant="blue" className='tableclasss' id="printable-table">
                <thead>
                  <tr>
                    <th>Sno</th>
                   <th>BARCODE</th>
                    <th>PRODUCTNAME</th>
                    <th>CATEGORY</th>
                    <th>QUANTITY</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody style={{ overflowY: "scroll" }}>
  {data.map((item, index) => (
    <tr key={index}>
        <td>{index+1}</td>
      <td style={{textAlign:"start"}}>{item.barcode}</td>
      <td  style={{textAlign:"start"}}>{item.productName}</td>
      <td  style={{textAlign:"start"}}>{item.category}</td>
      <td style={{textAlign:"end"}}>{item.netProductQuantity}</td>
      <td style={{textAlign:"end"}}>{item.netProductNetAmount.toFixed(3)}</td>
    </tr>
  ))}
    <tr>
                              <td colSpan="5" style={{ fontWeight: 'bold', textAlign: 'right' }}>Total:</td>
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
  )
}

export default PurchaseSummary