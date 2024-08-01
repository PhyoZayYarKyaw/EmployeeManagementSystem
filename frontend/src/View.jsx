import React, { useState, useEffect } from "react";
import axios from "axios";
// import { read, utils } from 'xlsx';
// import BootstrapTable from 'react-bootstrap';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button } from 'react-bootstrap';
import './View.css';
import Modal from 'react-bootstrap/Modal';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const ExcelJS = require('exceljs');

const View = () => {
    const [employees, setEmployees] = useState([]);
    // const[loading,setloading] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10);


    useEffect(() => {
        fetchEmployees();


    }, []);


    const fetchEmployees = () => {
        

        axios.get('http://127.0.0.1:8000/employees')//,config
            .then(response => {
                setEmployees(response.data);
                console.log('res data :', response.data);

            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    };



 
    const filteredEmployees = employees.filter(employee =>
        employee.EmployeeID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.Address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.Department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Change page
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredEmployees.length / employeesPerPage); i++) {
        pageNumbers.push(i);
    }
    function handleHeaderClick(header) {
        const newdata = employees.sort((a, b) => (a[header] > b[header] ? 1 : -1));
        setEmployees(newdata);
    }


    const handleExport = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("My Sheet");
        sheet.properties.defaultRowHeight = 20;

        sheet.columns = [
            {
                header: "EmployeeID",
                key: "EmployeeID",
                width: 12
            },
            {
                header: "Name",
                key: "name",
                width: 20
            },
            {
                header: "DOB",
                key: "DOB",
                width: 20
            },
            {
                header: "Gender",
                key: "Gender",
                width: 10
            },
            {
                header: "NRC",
                key: "NRC",
                width: 20
            },
            {
                header: "Email",
                key: "Email",
                width: 25
            },
            {
                header: "Address",
                key: "Address",
                width: 30
            },
            {
                header: "Skills",
                key: "Skills",
                width: 20
            },
            {
                header: "Department",
                key: "Department",
                width: 20
            },
            {
                header: "Type",
                key: "Type",
                width: 20
            },
            {
                header: "Description",
                key: "Description",
                width: 20
            },
            {
                header: "Year",
                key: "Year",
                width: 10
            }
        ];


        const data = '';
        employees.sort((a, b) => (a.EmployeeID > b.EmployeeID) ? 1 : -1);
        employees.map(employee => {


            if (employee.Education.length > 0) {
                employee.Education.map(edu => {
                    sheet.addRow({
                        EmployeeID: employee.EmployeeID,
                        name: employee.name,
                        DOB: employee.DOB,
                        Gender: employee.Gender,
                        NRC: employee.NRC,
                        Email: employee.Email,
                        Address: employee.Address,
                        Skills: employee.Skills,
                        Department: employee.Department,

                        Type: edu.Type,
                        Description: edu.Description,
                        Year: edu.Year,

                    })
                })
            } else {
                sheet.addRow({
                    EmployeeID: employee.EmployeeID,
                    name: employee.name,
                    DOB: employee.DOB,
                    Gender: employee.Gender,
                    NRC: employee.NRC,
                    Email: employee.Email,
                    Address: employee.Address,
                    Skills: employee.Skills,
                    Department: employee.Department,
                })
            }


        });

        workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], {
                Type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",

            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = "Employees.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);


        })

    }



    const [file, setFile] = useState(null);
    const [Exceldata, setExceldata] = useState([]);


    const handleFileUpload = async (e) => {
        const files = e.target.files[0];

        let filetypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        if (!files) {
            toast.error('Please select a file.');

        } else if (files && filetypes.includes(files.Type)) {

            const data = await files.arrayBuffer();
            const workbook = XLSX.readFile(data, { sheetRows: 2 });
            const worksheet = workbook.Sheets[workbook.Sheetnames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
            });
            const columns = jsonData[0];

            console.log(" Excel columns are :  ", columns);
            console.log(columns[0]);
            console.log(files.Type);
            if (columns[0] === "EmployeeID" && columns[1] === "name" &&
                columns[2] === "DOB" && columns[3] === "Gender" &&
                columns[4] === "NRC" && columns[5] === "Email" &&
                columns[6] === "Address" && columns[7] === "Skills" &&
                columns[8] === "Department" && columns[9] === "Type" &&
                columns[10] === "Description" && columns[11] == "Year") {

                
                console.log("file is correct");
                console.log("submit data", workbook);
                const formData = new FormData();
                formData.append('file', files);
                // document.getElementById('fileUpload').click(files);
                try {
                    const response = await axios.post('http://localhost:8000/employees/ExcelImport/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    toast.success("Import data successfully");
                    console.log('Upload response:', response.data);
                    // Additional logic after successful upload
                    fetchEmployees();
                } catch (error) {
                    console.error('Error uploading file:', error);
                }


            } else {
                toast.error("file is not correct ");
            }
        } else {
            toast.error("Please choose excel file");
        }    //   setFile(files);



    };
    const [deleteid, setdeleteid] = useState("");
    const [show, setShow] = useState(false);
    const handleClickDelete = (EmployeeID) => {
        setdeleteid(EmployeeID);
        setShow(true);
    }
    const handleCancel = () => {
        fetchEmployees()
        setShow(false)
    }
    const handleDelete = () => {
        setShow(false);
        // axios.post(`http://localhost:8000/employees/delete/${EmployeeID}/`)
        // if (window.confirm('Are you sure you want to delete this employee?')) {
        axios.delete(`http://127.0.0.1:8000/employees/delete/${deleteid}`, {
            method: 'DELETE'
        })
            .then(response => {
                console.log('Employee deleted:', response.data);
                toast.success('Employee delete successfully');
                fetchEmployees(); // Refresh employee list after deletion
            })
            .catch(error => {
                console.error('Error deleting employee:', error);
            });
        // }
    };

    return (

        <div>
            <Modal show={show} size="md" onHide={handleCancel} popup>
                <Modal.Header closeButton />
                <Modal.Header>Are you sure you want to delete this Employee?</Modal.Header>

                <Modal.Footer>
                    <div className="text-center">
                        
                        
                        <Button variant="secondary" color="failure" onClick={handleDelete}>
                            OK
                        </Button>&nbsp;&nbsp;
                        <Button variant="primary" color="gray" onClick={handleCancel}>
                            Cancel
                        </Button>
                        {/* </div> */}
                    </div>
                </Modal.Footer>
            </Modal>

                            
            <div className="container" style={{ marginTop: "10px" }}>
                {/* <h2>Employee List</h2> */}


                <div className="d-flex justify-content-start">
                    <button className="btn btn-block" style={{ backgroundColor: '#d0e0e3' }} onClick={handleExport}>Export</button>
                    &nbsp;&nbsp;
                    <label className="btn btn-block" style={{ backgroundColor: '#d0e0e3' }}>
                        <input Type="file" className="form-control" EmployeeID="choosefile" onChange={handleFileUpload} style={{ display: 'none' }} />
                        Import</label>
                </div>

                


                {/* Search input */}
                <div className="search-box-container">
                    <input
                        Type="text"
                        placeholder="Search by name, Email, "
                        value={searchTerm}
                        style={{
                            float: 'right',
                            padding: '6px',
                            border: 'none',
                            marginTop: '8px',
                            marginRight: '16px',
                            fontSize: '17px',
                            // background:'white',
                            border: '1px solid #ccc', // Example border style
                            borderRadius: '4px',
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="col col-form-control col-md-4 "
                        align="right"
                    /></div>
                <Table size="sm" onClick={handleHeaderClick} >
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Department</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEmployees.length > 0 ? (
                            currentEmployees.map(employee => (

                                <tr key={employee.EmployeeID}>
                                    <td>{employee.EmployeeID}</td>
                                    <td>{employee.name}</td>
                                    <td>{employee.Email}</td>
                                    <td>{employee.Address}</td>
                                    <td>{employee.Department}</td>
                                    <td>
                                        <Link to={`/employees/edit/${employee.EmployeeID}`} className="btn btn-sm btn-outline-primary">Edit</Link>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleClickDelete(employee.EmployeeID)}>Delete</button>
                                    </td>
                                    {/* <Link to={`/employees/edit/${employee.EmployeeID}/`}>Edit</Link>
                        <button onClick={() => handleDelete(employee.EmployeeID)}>Delete</button> */}
                                </tr>
                            ))
                        ) : (     
                            <tr><td colSpan='7'>No employees found</td></tr>
                        )
                        }
                    </tbody>
                </Table>


                {/* Pagination */}
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                        </li>
                        {pageNumbers.map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(number)}>{number}</button>
                            </li>
                        ))}

                        <li className={`page-item`}><button className="page-link"> total : {filteredEmployees.length}</button></li>
                        <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>

            </div>
        </div>
    );

    function prePage() {

    }

    // function changeCPage(EmployeeID){

    // }
    function nextPage() {

    }
}
export default View;