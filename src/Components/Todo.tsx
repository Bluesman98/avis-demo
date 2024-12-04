import { useEffect, useState } from "react";
import { getUrl } from 'aws-amplify/storage';

function Todo(props: any) {

    const [url, setUrl] = useState('')

    useEffect(() => {
        getTodoUrl(props.todo.content)
    }, []);

    function deleteTodo(id: string) {
        props.client.models.Todo.delete({ id })
      }
    
      async function getTodoUrl(id: any) {
        const linkToStorageFile = await getUrl({
          path: `Pdf_Storage/${id}.pdf`,
          // Alternatively, path: ({identityId}) => `album/{identityId}/1.jpg`
          options: {
            bucket: "bucket",
            validateObjectExistence : true
          }
        });
        setUrl( linkToStorageFile.url.toString())
        return linkToStorageFile.url.toString()
      }
  return (
    <div  style={{display:'flex', marginBottom: '.5rem'}}>
            
   <li  onClick={() =>console.log(getTodoUrl(props.todo.content))} style={{flex:'1'}}><a href={url} target="_blank">{props.todo.content}</a></li>
 
    <button onClick={() => deleteTodo(props.todo.id)} style={{marginLeft:'.5rem'}}>Delete</button>
    </div>
  );
}

export default Todo;