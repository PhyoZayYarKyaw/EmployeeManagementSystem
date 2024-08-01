import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeForm.css';
import { toast } from 'react-toastify';

const EmployeeUpdateForm = () => {
    const {id} = useParams();  // Assuming you're using React Router's useParams to get the employee ID from URL
    const navigate = useNavigate();
    console.log("EmployeeID is ", id);
    const [formData, setFormData] = useState({
        EmployeeID: '',
        photo: '',
        name: '',
        DOB: '',
        Gender: '',
        NRC: '',
        Email: '',
        Address: '',
        Skills: '',
        Department: 'HR',
        Education: [
            { Type: '', Description: '', Year: '' }
        ]
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');

    useEffect(() => {
        // Fetch employee details based on ID
        const fetchEmployeeDetails = async () => {
            try {
                // let config = {
                //     method: 'get',
                //     url: `http://localhost:8000/employees/edit/${EmployeeID}`,
                //     headers: { 'Content-Type': 'application/json' },
                //     body: {
                //         "EmployeeID":EmployeeID
                //         }
                // };
                const response = await axios.get(`http://localhost:8000/employees/edit/${id}`);         
                const employeeData = response.data;
                // setImage(employeeData.photo);
                if (employeeData.photo) {
                    setPreview(employeeData.photo);
                }

                console.log("Data are ",employeeData)
                setFormData({
                    EmployeeID: employeeData.EmployeeID,
                    name: employeeData.name,
                    photo: '', // You might want to handle this differently depending on how files are managed
                    DOB: employeeData.DOB,
                    Gender: employeeData.Gender,
                    NRC: employeeData.NRC,
                    Email: employeeData.Email,
                    Address: employeeData.Address,
                    Skills: employeeData.Skills.split(','), // Assuming Skills is stored as a comma-separated string in backend
                    Department: employeeData.Department,
                    Education: employeeData.Education.map(edu => ({
                        Type: edu.Type,
                        Description: edu.Description,
                        Year: edu.Year,
                    }))
                });


            } catch (error) {
                console.error('Error fetching employee details:', error);
                // Handle error gracefully, e.g., show error message
            }
        };




        fetchEmployeeDetails();
    }, [id]);

    console.log("preview image is :", preview);
    console.log("Image is ", image);
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            if (checked) {
                setFormData(prevState => ({
                    ...prevState,
                    Skills: [...prevState.Skills, value]
                }));
            } else {
                setFormData(prevState => ({
                    ...prevState,
                    Skills: prevState.Skills.filter(skill => skill !== value)
                }));
            }
        } else if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0]
            });
            // Handle image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            if (files[0]) {
                reader.readAsDataURL(files[0]);
            } else {
                setPreview('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEducation = [...formData.Education];
        updatedEducation[index] = { ...updatedEducation[index], [name]: value };
        setFormData({ ...formData, Education: updatedEducation });
    };

    const handleAddEducation = () => {
        setFormData({
            ...formData,
            Education: [...formData.Education, { Type: '', Description: '', Year: '' }]
        });
    };

    const handleRemoveEducation = (index) => {
        const updatedEducation = [...formData.Education];
        updatedEducation.splice(index, 1);
        setFormData({ ...formData, Education: updatedEducation });
    };
    
    
    
    const handleImageClick = (e) =>{
        document.getElementById("input").click();
      }

    const handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFormData({
                ...formData,
                photo: file
            });
            setPreview(reader.result);
            setImage(file);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.Skills = formData.Skills.toString();
        // formData.photo = image;
        console.log("Skill data :", formData.Skills);
        console.log(" data are ", formData);

        console.log("photo are :", formData.photo);
        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'Education') {
                const educationData = formData.Education.map(edu => ({
                    Type: edu.Type,
                    Description: edu.Description,
                    Year: edu.Year
                }));
                formDataToSubmit.append('Education', JSON.stringify(educationData));
            } else if (key === 'photo') {
                formDataToSubmit.append(key, formData[key]);
            } else {
                formDataToSubmit.append(key, formData[key]);
            }
        });
        formData.photo = image;
        formDataToSubmit.append('photo', formData.photo);
        console.log("Data to sent :", formDataToSubmit);
        try {
            const response = await axios.put(`http://localhost:8000/employees/update/${id}`, formDataToSubmit, {
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                toast.success('Employee updated successfully!');
                navigate('/employees');
            } else {
                toast.error('Failed to update employee');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            toast.error('Error updating employee');
        }
    };



    return (
        <div className="container">
            <h2>Update Employee</h2>
            <form onSubmit={handleSubmit}>
                {/* Form fields */}
                {/* Image upload */}
                {/* Education background */}
                {/* Submit button */}

                <div className="row">
                    <div className="column">
                        <div className="form-group row">
                            <label htmlFor="EmployeeID" className="col-md-6 col-form-label">Employee ID</label>
                            <div className="col-md-6">
                                <input type="text" className="form-control" EmployeeID="EmployeeID" name="EmployeeID" value={formData.EmployeeID} onChange={handleChange} required />
                            </div>
                        </div><br />

                        <div className="form-group row">
                            <label htmlFor="name" className="col-md-6 col-form-label">Name</label>
                            <div className="col-md-6">
                                <input type="text" className="form-control" EmployeeID="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                        </div><br />
                        <div className="form-group row">
                            <label htmlFor="DOB" className="col-md-6 col-form-label">Date of Birth</label>
                            <div className="col-md-6">
                                <input type="date" className="form-control" EmployeeID="DOB" name="DOB" value={formData.DOB} onChange={handleChange} required />
                            </div>
                        </div><br></br>
                        <div className="form-group row">
                            <div className="col-md-6 form-label">
                                <label className="col-form-label">Gender</label>
                            </div>
                            <div className="col-md-6">
                                <div className="radio-group">
                                    <label><input className="form-check-input" type="radio" EmployeeID="male" name="Gender" value="Male" checked={formData.Gender === 'Male'} onChange={handleChange} />  Male</label>&nbsp;&nbsp;


                                    <label><input className="form-check-input" type="radio" EmployeeID="female" name="Gender" value="Female" checked={formData.Gender === 'Female'} onChange={handleChange} />  Female</label>&nbsp;&nbsp;


                                    <label ><input className="form-check-input" type="radio" EmployeeID="other" name="Gender" value="Other" checked={formData.Gender === 'Other'} onChange={handleChange} />  Other</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="NRC" className="col-md-6 col-form-label">NRC</label>
                            <div className="col-md-6">
                                <input type="text" className="form-control" EmployeeID="NRC" name="NRC" value={formData.NRC} onChange={handleChange} required />
                            </div>
                        </div><br />
                        <div className="form-group row">
                            <label htmlFor="Email" className="col-md-6 col-form-label">Email</label>
                            <div className="col-md-6">
                                <input type="Email" className="form-control" EmployeeID="Email" name="Email" value={formData.Email} onChange={handleChange} required />
                            </div>
                        </div><br />
                        <div className="form-group row">
                            <label htmlFor="Address" className="col-md-6 col-form-label">Address</label>
                            <div className="col-md-6">
                                <textarea className="form-control" EmployeeID="Address" name="Address" value={formData.Address} onChange={handleChange} required></textarea>
                            </div>
                        </div><br />
                        <div className="form-group row">
                            <div className="col-md-6">
                                <label className="col-form-label">Skills</label>
                            </div>
                            <div className="col-md-6">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" EmployeeID="Python" value="Python" checked={formData.Skills.includes("Python")} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="Python">Python</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" EmployeeID="PHP" value="PHP" checked={formData.Skills.includes("PHP")} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="PHP">PHP</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" EmployeeID="Java" value="Java" checked={formData.Skills.includes("Java")} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="Java">Java</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="Department" className="col-md-6 col-form-label">Department</label>
                            <div className="col-md-6">
                                <select className="form-select" EmployeeID="Department" name="Department" value={formData.Department} onChange={handleChange} required>
                                    <option value="HR">HR</option>
                                    <option value="Admin">Admin</option>
                                    <option value="SDD">SDD</option>
                                    <option value="Finance">Finance</option>
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="column align=center">


                        <div className="form-group row">
                            <h4 className="heading">Add Image</h4>
                            <div className="img-holder" onClick={handleImageClick}>

                                <img src={preview} alt="Preview" style={{ height: '100px', width: 'auto', marginTop: '10px', borderRadius: '10%' }} /><br></br><br></br>

                            </div>
                            <input type="file" name="image-uplod" EmployeeID="input" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                            <label htmlFor="input" className="image-upload">

                            </label>
                        </div>
                    </div>
                </div>
                <div className="panel-default">
                    <div className="panel-body">
                        <p>Education Background</p>
                        <button className="btn btn-success" type="button" onClick={handleAddEducation}>ADD</button><br></br><br></br>
                        {Array.isArray(formData.Education) && formData.Education.map((edu, index) => (
                            <div key={index}>
                                <div className="form-group row">

                                    <div className="col-sm-3">
                                        <select className="form-select" EmployeeID="type" name="type" value={edu.Type} onChange={(e) => handleEducationChange(index, e)}>
                                            <option value="">Select type</option>
                                            <option value="Bachelor">Bachelor</option>
                                            <option value="Master">Master</option>
                                            <option value="Ph.D">Ph.D</option>
                                            <option value="Certificate">Certificate</option>
                                            <option value="Diploma">Diploma</option>
                                        </select>
                                    </div>
                                    <div className="col sm-3 nopadding">

                                        <input type="text" className="form-control" name="description" placeholder="description" value={edu.Description} onChange={(e) => handleEducationChange(index, e)} />
                                    </div>
                                    <div className="col-sm-3 nopadding">

                                        <input type="text" className="form-control" name="year" placeholder="year" value={edu.Year} onChange={(e) => handleEducationChange(index, e)} />
                                    </div>
                                    <br />
                                    <div className="col-sm-3 nopadding">
                                        <button className="btn btn-danger" onClick={() => handleRemoveEducation(index)}>Remove</button>
                                    </div>
                                </div>
                                <br />
                            </div>
                        ))}
                    </div>
                </div>
                <br />
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default EmployeeUpdateForm;
