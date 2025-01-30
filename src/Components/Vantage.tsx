import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/Vantage.css';
import { useNavigate } from 'react-router-dom';
import { list, uploadData, getUrl } from 'aws-amplify/storage';

function Vantage (props: any) {

const baseUrl = process.env.REACT_APP_BASE_URL!;
const token = process.env.REACT_APP_TOKEN!;
const skill = process.env.REACT_APP_SKILL!;

const navigate = useNavigate();

const getToken = () => {
  // Replace this with your actual token retrieval logic
  //return localStorage.getItem('authToken');
  return token;
};

const [files, setFiles] = useState([]);

const handleFileChange = (event: any) => {
  if (event.target.files) {
    setFiles(event.target.files);
  }
};

const handleFileUpload = async () => {
  if (files) {
    try {
        let transactionId = await createTransaction()
        await postFiles(files, transactionId);
        await startTransaction(transactionId)
        navigate(`/transaction/${transactionId}`);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};

const createTransaction = async () => {
    let data = JSON.stringify({
        "skillId": skill,
        "generateMobileInputLink": true,
        "registrationParameters": [
          {
            "key": "aute Ut",
            "value": "Duis dolore"
          },
          {
            "key": "in cillum",
            "value": "fugiat qui et cillum minim"
          }
        ]
      })
      
    try {
      const token = getToken();
      const response = await axios.post(`${baseUrl}/api/publicapi/v1/transactions`, data,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data)
      return response.data.transactionId;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

 const postFiles = async (files: any, transactionId: string) => {
  try {
    const token = getToken();
    const formData = new FormData();
    Array.from(files).forEach((file: any) => {
        formData.append('file', file);
      });

    const response = await axios.post(`${baseUrl}/api/publicapi/v1/transactions/${transactionId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const startTransaction = async (transactionId: string) => {
    try {
      const token = getToken();

      const response = await axios.post(`${baseUrl}/api/publicapi/v1/transactions/${transactionId}/start`, '',{
        headers: {
          'Accept': 'text/plain',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Error when starting transaction:', error);
      throw error;
    }
  };
  return (
    <div className='container'>
      <div>
        <h1 style={{color: 'white'}}>Upload File</h1>
        <div className='upload'>
            <input type="file"  multiple onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default Vantage;