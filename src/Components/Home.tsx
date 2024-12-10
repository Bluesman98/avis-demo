import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
//import { FileUploader } from '@aws-amplify/ui-react-storage';
import Todo from './Todo'
import '../CSS/Home.css'
import AdvancedFilter from "./AdvanedFilter";
import SimpleFilter from "./SimpleFilter";

function Home(props: any) {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const[advancedFilter, setAdvancedFilter] = useState(false);

  useEffect(() => {
   /* props.client.models.Todo.observeQuery().subscribe({
      next: (data: { items: any; }) => setTodos([...data.items]),
    });*/
  }, []);

  async function filterTodos(data: Array<any>) {
    setTodos(data)
  }

  const searchMode = () => {
    setAdvancedFilter(!advancedFilter);
  }

  return (
    <div className="home">
          <button onClick={searchMode} style={{width: "30%"}}>{advancedFilter?"Simple Search":"Advanced Search"}</button>
          {!advancedFilter && <SimpleFilter client={props.client} filterTodos={filterTodos}/>}
          {advancedFilter && <AdvancedFilter client={props.client} filterTodos={filterTodos} />}
          {todos.length > 0 &&<div className="table" >
            <div className="results header" style={{ marginBottom: '0'}}>
             <div className="invoice-grid-row header">
            <div>Barcode</div>
            <div>Vendor</div>
            <div>Invoice Date</div>
            <div>Entry Date</div>
            <div>Tax Code</div>
                    </div>
                    </div>
                    
                  <div className="results items" style={{maxHeight: '40rem', marginTop: '0'}}>
                    {todos && todos.map((todo) => (
            <Todo key={todo.id} client={props.client} todo={todo} />
                    ))}
                  </div>
          </div>}
    </div>
  );
}

export default Home;
