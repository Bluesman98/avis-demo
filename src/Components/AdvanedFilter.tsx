import { useState } from "react";
import '../CSS/AdvanedFilter.css';

const AdvancedFilter = (props: any) => {
  const [barcode, setBarcode] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [taxCode, setTaxCode] = useState('');

  const advancedFilter = async (b: string, v: string, i: string, e: string, t: string) => {
    const filterConditions = [];

    if (b) filterConditions.push({ barcode: { contains: b.toUpperCase() } });
    if (v) filterConditions.push({ vendorName: { contains: v.toUpperCase() } });
    if (i) filterConditions.push({ invoiceDate: { contains: i } });
    if (e) filterConditions.push({ entryDate: { contains: e } });
    if (t) filterConditions.push({ taxCode: { contains: t } });

    const json = await props.client.models.Todo.list({
      filter: {
        and: filterConditions
      }
    });
    console.log(json.data);
    return json.data;
  };

  const handleFilter = async () => {
    const results = await advancedFilter(barcode, vendorName, invoiceDate, entryDate, taxCode);
    props.filterTodos(results);
  };

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      handleFilter();
    }
  };

  const clearFilter = async () => {
    setBarcode('')
    setVendorName('')
    setInvoiceDate('')
    setEntryDate('')
    setTaxCode('')
    props.clearTodos();
  }

  return (
    <div className="advanced-filter" style={{ display: "flex", flexDirection: "column" }} onKeyDown={handleKeyDown}>
      <div>
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Barcode"
        />
        <input
          type="text"
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          placeholder="Vendor Name"
        />
      </div>
      <div>
        <input
          type="text"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          placeholder="Invoice Date"
        />
        <input
          type="text"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          placeholder="Entry Date"
        />
      </div>
      <div>
        <input
          type="text"
          value={taxCode}
          onChange={(e) => setTaxCode(e.target.value)}
          placeholder="Tax Code"
        />
        <div className="button-container">
          <button onClick={handleFilter}>Search</button>
          <button className="clear-button" onClick={clearFilter}>Clear</button>
        </div>
      </div>
    </div>
  );
}

export default AdvancedFilter;