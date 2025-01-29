import React, { useEffect, useState } from 'react';
import { OrbitProgress } from 'react-loading-indicators';
import 'react-datepicker/dist/react-datepicker.css';
import TransactionListItem from './TransactionListItem';
import '../CSS/TransactionList.css';

interface TransactionTableProps {
  loading: boolean;
  error: boolean;
  transactions: any;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  loading,
  error,
  transactions,
}) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    if (transactions && transactions.items) {
        handleSort();
    }
  },[])

  const handleSort = () => {
    const sortedTransactions = [...transactions.items].sort((a: any, b: any) => {
      const dateA = new Date(a.createTimeUtc).getTime();
      const dateB = new Date(b.createTimeUtc).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    transactions.items = sortedTransactions;
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <div className='container' style={{width:'100%', alignItems: 'center'}}><h3 style={{color:'white'}} >Loading...</h3><OrbitProgress color="#ffffff" size="medium" text="" textColor="" /></div>;
  if (error) return <div className='container'><h3 style={{color:'white'}} >Error loading transactions.</h3></div>;

  return (
    <div>
      {transactions && transactions.items && transactions.items.length > 0 && <div className="table" >
        <div className="results header" style={{ marginBottom: '0' }}>
          <div className="invoice-grid-row header transactions">
            <div>Id</div>
            <div>Status</div>
            <div  style={ {cursor: 'pointer' }}onClick={handleSort}>Date ({sortOrder === 'asc' ? 'Descending' : 'Ascending'})</div>
            <div>View</div>
          </div>
        </div>
        <div className="results items" style={{ maxHeight: '40rem', marginTop: '0' }}>
          {transactions.items.map((transaction : any) => (
            <TransactionListItem key={transaction.transactionId} transaction={transaction}  />
          ))}
        </div>
      </div>}
      {transactions && transactions.items &&  !transactions.items.length && <h3 style={{color:'white'}}>No transactions found.</h3>}
    </div>
  );
};

export default TransactionTable;