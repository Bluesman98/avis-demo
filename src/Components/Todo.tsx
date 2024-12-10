import { useEffect, useState } from "react";
import { getUrl } from 'aws-amplify/storage';
import '../CSS/Todo.css'

function Todo(props: any) {

    const [url, setUrl] = useState('')

    useEffect(() => {
        getTodoUrl(props.todo.barcode)
    }, []);

    async function deleteTodo() {
       await props.client.models.Todo.delete(props.todo)
      }

      async function getTodoUrl(id: any) {
        const linkToStorageFile = await getUrl({
          path: `Pdf_Storage/${id}.pdf`,
          // Alternatively, path: ({identityId}) => `album/{identityId}/1.jpg`
          options: {
            bucket: "bucket",
            validateObjectExistence : true,
            expiresIn: 900
          }
        });
        setUrl( linkToStorageFile.url.toString())
        console.log(linkToStorageFile.url.toString())
        return linkToStorageFile.url.toString()
      }
  return (
    <div className="invoice-grid-row"   onClick={() =>console.log(getTodoUrl(props.todo.content))}>

      <div>{props.todo.barcode}</div>
      <div>{props.todo.vendorName}</div>
      <div>{props.todo.invoiceDate}</div>
      <div>{props.todo.entryDate}</div>
      <div>{props.todo.taxCode}</div>
      <div><a href={url} target="_blank"><button>Link</button></a></div>
      <div>{<button onClick={deleteTodo} style={{marginLeft:'.5rem'}}>Delete</button>}</div>
      
    </div>
  );
}

export default Todo;