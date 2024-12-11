import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import Todo from './Todo'
import '../CSS/Home.css'
import AdvancedFilter from "./AdvanedFilter";
import SimpleFilter from "./SimpleFilter";

function Home(props: any) {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [advancedFilter, setAdvancedFilter] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  useEffect(() => {
    setSelectedTodoId(null);
  }, [todos]);

  async function filterTodos(data: Array<any>) {
    setTodos(data)
  }

  async function clearTodos(data: Array<any>) {
    setTodos([])
  }

  const searchMode = () => {
    setAdvancedFilter(!advancedFilter);
  }

  return (
    <div className="home">
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {!advancedFilter && <SimpleFilter client={props.client} filterTodos={filterTodos} clearTodos={clearTodos} />}
        {advancedFilter && <AdvancedFilter client={props.client} filterTodos={filterTodos} clearTodos={clearTodos} />}
        <button onClick={searchMode} style={{ width: "30%" }}>{advancedFilter ? "→ Simple Search" : "→ Advanced Search"}</button>
      </div>
      {todos.length > 0 && <div className="table" >
        <div className="results header" style={{ marginBottom: '0' }}>
          <div className="invoice-grid-row header">
            <div>Barcode</div>
            <div>Vendor</div>
            <div>Invoice Date</div>
            <div>Entry Date</div>
            <div>Tax Code</div>
          </div>
        </div>

        <div className="results items" style={{ maxHeight: '40rem', marginTop: '0' }}>
          {todos && todos.map((todo) => (
            <Todo key={todo.id} client={props.client} todo={todo} selectedTodoId={selectedTodoId} setSelectedTodoId={setSelectedTodoId} />
          ))}
        </div>
      </div>}
    </div>
  );
}

export default Home;
