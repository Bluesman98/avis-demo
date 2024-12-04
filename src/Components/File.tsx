import React from 'react';
import { uploadData } from 'aws-amplify/storage';

function File() {
    const [file, setFile] = React.useState();

    const handleChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const upload = (file: any) => {
        if(file){
            uploadData({
                path: 'Pdf_Storage/file.name',
                data: file,
            })
            }
    };

    return (
        <div>
            <input type="file" onChange={handleChange} />
            <button
                onClick={() => {upload(file)}
                }
            >
                Upload
            </button>
        </div>
    );
}

export default File;