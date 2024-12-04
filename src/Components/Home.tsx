import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { list } from 'aws-amplify/storage';
import Todo from './Todo'

const fetchStorage = async () =>{
  const result = await list({
	path: 'Pdf_Storage/',
  options: {
    bucket: "bucket"
  }
});
console.log(result)
}

const client = generateClient<Schema>();

const fetchTodos= async (q: string) => {
  const json = await client.models.Todo.list({
    filter: {
      content: {
        beginsWith: q
      }
    }
  })
  console.log(json.data);
  return json.data;
};

 function Home() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    fetchStorage();
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
    
  async function filterTodos(filterString: string) {
    const data = fetchTodos(filterString)
    setTodos([...await data])
  }

  const [searchItem, setSearchItem] = useState('')

  const handleInputChange = (e: { target: { value: any; }; }) => { 
    const searchTerm = e.target.value;
    setSearchItem(searchTerm)
  }

  function keyPress(e: { keyCode: number; }){
    if(e.keyCode == 13){
      filterTodos(searchItem)
    }
 }

  return (
    <main>
        <FileUploader
          acceptedFileTypes={['*']}
          path="Pdf_Storage/"
          maxFileCount={1}
          isResumable
        /> 
        {
          <div>      
        <input
            type="text"
            value={searchItem}
            onChange={handleInputChange}
            onKeyDown={keyPress}
            placeholder='Type to search'
        />
        <button onClick={()=>{filterTodos(searchItem)}}>search</button>
        </div>
        }

      <h1>My todos</h1>

      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <Todo key={todo.id} client = {client} todo = {todo}/>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default Home;
