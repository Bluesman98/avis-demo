import { list, uploadData } from 'aws-amplify/storage';
import React from 'react';

const fetchStorage = async () => {
  const result = await list({
    path: 'Pdf_Storage/',
    options: {
      bucket: "bucket"
    }
  });
  console.log(result)
}

function MultipleFileInput(props: any) {

  const [files, setFiles] = React.useState([]);

  const handleFileInput = (event: any) => {

    const targetFiles = event.target.files;

    // Process the uploaded files
    setFiles(targetFiles)
    console.log('Selected Files: ', targetFiles)

  };

  async function upload() {
    for (const file of files) {
      try {
        const result = await uploadData({
          path: `Pdf_Storage/${file['name']}`,
          data: file,
        }).result;
        console.log('Succeeded: ', result);
        createTodo(String(file['name']).split('.').slice(0, -1).join('.'))
      } catch (error) {
        console.log('Error : ', error);
      }
    }
  }

  function createTodo(content: string) {
    props.client.models.Todo.create({ content: content });
  }

  return (
    <div>
      <input type="file" multiple onChange={handleFileInput} />
      <button
        onClick={() => 
          upload()
        }
      >Upload</button>
      <button
        onClick={() =>
          fetchStorage()
        }
      >List Storage</button>
    </div>
  );
}

export default MultipleFileInput;