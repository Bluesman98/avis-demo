import { list, uploadData, getUrl } from 'aws-amplify/storage';
import React from 'react';
import * as XLSX from 'xlsx';
import '../CSS/Upload.css';

const fetchStorage = async () => {
  const result = await list({
    path: 'Pdf_Storage/',
    options: {
      bucket: "bucket"
    }
  });
  console.log(result)
}


function Upload(props: any) {

  const [files, setFiles] = React.useState([]);
  const [metaData, setMetadata] = React.useState([]);

  const handleMetadataInput = async (event: any) => {
    const targetFiles = event.target.files;
    // Process the uploaded files
    console.log('Selected Files: ', targetFiles)
    event.stopPropagation(); event.preventDefault();
    const f = targetFiles[0];
    /* f is a File */
    const data = await f.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = XLSX.read(data);

    console.log('Selected Workbook: ', workbook)

    console.log("Sheet to Json: ", XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]))
    setMetadata(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]))
  }

  const handleFileInput = (event: any) => {

    const targetFiles = event.target.files;

    // Process the uploaded files
    setFiles(targetFiles)
    console.log('Selected Files: ', targetFiles)

  };

  async function uploadFiles() {
    let results = []
    let errors = []
    console.group('Uploading Files');
    for (const file of files) {
      try {
        const result = await uploadData({
          path: `Pdf_Storage/${file['name']}`,
          data: file,
        }).result;
        //console.log('Succeeded: ', result);
        results.push('Succeeded: ', result)
        //createTodo(String(file['name']).split('.').slice(0, -1).join('.'))
      } catch (error) {
        //console.log('Error : ', error);
        errors.push('Error : ', error)
      }
    }
    if (results.length) console.log('Completed: ', results)
    if (errors.length) console.log('Errors: ', errors)
  }

  async function createData(metaData: Array<any>) {
    for (const row of metaData) {
      //createTodo(row.barcode, row.vendorName, row.invoiceDate, row.entryDate, row.taxCode)
      const result = createTodo(row.barcode, row.vendorName, row.invoiceDate, row.entryDate, row.taxCode)
      console.log(result)
    }
  }

  async function getTodoUrl(id: any) {
    const linkToStorageFile = await getUrl({
      path: `Pdf_Storage/${id}.pdf`,
      // Alternatively, path: ({identityId}) => `album/{identityId}/1.jpg`
      options: {
        bucket: "bucket",
        validateObjectExistence: true,
        expiresIn: 900
      }
    });
    return linkToStorageFile.url.toString()
  }

  async function createTodo(
    barcode: string,
    vendorName: string,
    invoiceDate: string,
    entryDate: string,
    taxCode: string,) {
    const url = await getTodoUrl(barcode)
    await props.client.models.Todo.create({ barcode: barcode, vendorName: vendorName, invoiceDate: invoiceDate, entryDate: entryDate, taxCode: taxCode, url: url });
  }
  return (
    <div className="container">
      <div className='upload'>
        {true && <input type="file" multiple onChange={handleFileInput} />}
        {true && <button
          onClick={() =>
            uploadFiles()
          }
        >Upload Pdf's</button>}
      </div>
      <div className='upload'>
        {true && <input type="file" onChange={handleMetadataInput} />}
        {true && <button
          onClick={() =>
            createData(metaData)
          }
        >Upload Metadata</button>}
      </div>
      {false && <button
        onClick={() =>
          fetchStorage()
        }
      >List Storage</button>}
    </div>
  );
}
export default Upload;