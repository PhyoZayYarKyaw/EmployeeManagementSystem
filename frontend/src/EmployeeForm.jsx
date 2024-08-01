
import React, { useState } from 'react';
import axios from 'axios';
// import Glyphicon from '@strongdm/glyphicon'

import { useNavigate } from 'react-router-dom';
import './EmployeeForm.css';
import { toast } from 'react-toastify';
const EmployeeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    EmployeeID: '',
    photo: null,
    name: '',
    DOB: '',
    Gender: '',
    NRC: '',
    Email: '',
    Address: '',
    Skills: '',
    Department: 'HR',
    Education: []
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');


  const handleImageClick = (e) =>{
    document.getElementById("input").click();
  }
  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log("Photo is :", file);

    reader.onloadend = () => {
        setImage(file);
        setPreview(reader.result);
        setFormData({
            ...formData,
            photo: file // Set photo directly to the base64 encoded data URL

        });


    };
    formData.photo = image;
    if (file) {
        reader.readAsDataURL(file);
    }
};

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        Skills: {
          ...formData.Skills,
          [name]: checked
        }
      });
    } else if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle input change for education fields
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...formData.Education];
    updatedEducation[index] = { ...updatedEducation[index], [name]: value };
    setFormData({ ...formData, Education: updatedEducation });
  };



  // Handle adding education fields
  const handleAddEducation = () => {
    setFormData({
      ...formData,
      Education: [...formData.Education, { type: '', description: '', year: '' }]
    });
  };
  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevState => {
      const newskills = checked
        ? [...formData.Skills, value]
        : formData.Skills.filter(skill => skill !== value);
      return { ...formData, Skills: newskills };
    });
  };

  //Remove Education
  const handleRemoveEducation = (index) => {
    const updatedEducation = [...formData.Education];
    updatedEducation.splice(index, 1);
    setFormData({ ...formData, Education: updatedEducation });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();


    
  formData.Skills = formData.Skills.toString();
  // formData.photo = image;
  // console.log("photo data is :" , formData.photo);
  const formDataToSubmit = new FormData();
  Object.keys(formData).forEach(key => {
      if (key === 'Education') {
        if (formData.Education.length > 0) {
          const educationData = formData.Education.map(edu => ({
              type: edu.type,
              description: edu.description,
              year: edu.year
          }));
            formDataToSubmit.append('Education', JSON.stringify(educationData));
        } else {
          // Append empty array if Education is empty
          formDataToSubmit.append('Education', JSON.stringify([]));
        }
      } else if (key === 'photo') {
          formDataToSubmit.append(key, formData[key]);
      } else {
          formDataToSubmit.append(key, formData[key]);
      }
  });
  console.log("data is :", formData);

  // const data = await axios.get(`http://127.0.0.1:8000/employees/edit/${formData.EmployeeID}`)
            
          //  if(data.status ===200){
          //   alert(`Employee ID of ${formData.EmployeeID} already exist`);
          //  }else if (data.status ===404){
          // }  
  
  try {
      const response =  await axios.post('http://localhost:8000/employees/create/', formDataToSubmit);
      if (response.status === 201) {
        toast.success('Employee added successfully!');
          console.log("data is :", formDataToSubmit);
          navigate('/'); // Navigate to the home page or desired route
      } else {
          toast.error('Failed to add employee');
          console.log("data is :", formDataToSubmit);
      }
  } catch (error) {
      // console.error('Error adding employee:', error);
      toast.error(`Employee ID of ${formData.EmployeeID} already exist`);
  }
  

    
};





return (
    <div className="container">
      <h2>Employee</h2>
      <form onSubmit={handleSubmit}>
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
                  <label><input className="form-check-input" type="radio" EmployeeID="male" name="Gender" value="Male" checked={formData.Gender === 'Male'} onChange={handleChange} />  Male</label>&nbsp;


                  <label><input className="form-check-input" type="radio" EmployeeID="female" name="Gender" value="Female" checked={formData.Gender === 'Female'} onChange={handleChange} />  Female</label>


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
                  <input className="form-check-input" type="checkbox" EmployeeID="Python" value="Python" checked={formData.Skills.Python} onChange={handleSkillChange} />
                  <label className="form-check-label" htmlFor="Python">Python</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" EmployeeID="PHP" value="PHP" checked={formData.Skills.PHP} onChange={handleSkillChange} />
                  <label className="form-check-label" htmlFor="PHP">PHP</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" EmployeeID="Java" value="Java" checked={formData.Skills.Java} onChange={handleSkillChange} />
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

                <img src={preview} alt="Preview" style={{ height: '100px', width: 'auto', marginTop: '10px' ,borderRadius :'10%' }} /><br></br><br></br>

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
                    <select className="form-select" EmployeeID="type" name="type" value={edu.type} onChange={(e) => handleEducationChange(index, e)}>
                      <option value="">Select type</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Master">Master</option>
                      <option value="Ph.D">Ph.D</option>
                      <option value="Certificate">Certificate</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>
                  <div className="col sm-3 nopadding">

                    <input type="text" className="form-control" name="description" placeholder="description" value={edu.description} onChange={(e) => handleEducationChange(index, e)} />
                  </div>
                  <div className="col-sm-3 nopadding">

                    <input type="text" className="form-control" name="year" placeholder="year" value={edu.year} onChange={(e) => handleEducationChange(index, e)} />
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

export default EmployeeForm;
