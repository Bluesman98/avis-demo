import React, { useState, useEffect } from 'react';
import { OrbitProgress } from 'react-loading-indicators';
import TransactionListItem from './TransactionListItem';
import '../CSS/TransactionList.css';
import { Link } from 'react-router-dom';

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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortedTransactions, setSortedTransactions] = useState<any[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState<boolean>(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState<boolean>(false);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      handleSort();
    }
  }, [transactions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setIsShiftPressed(true);
      }
      if (event.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setIsShiftPressed(false);
      }
      if (event.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleSort = () => {
    const sorted = [...transactions].sort((a: any, b: any) => {
      const dateA = new Date(a.createTimeUtc).getTime();
      const dateB = new Date(b.createTimeUtc).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setSortedTransactions(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSelect = (transactionId: string, index: number, event: React.MouseEvent) => {
    if (isShiftPressed && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const newSelected = new Set(selectedTransactions);
      const shouldUnselect = Array.from(newSelected).some(id => sortedTransactions.slice(start, end + 1).some((item: any) => item.transactionId === id));

      for (let i = start; i <= end; i++) {
        if (shouldUnselect) {
          newSelected.delete(sortedTransactions[i].transactionId);
        } else {
          newSelected.add(sortedTransactions[i].transactionId);
        }
      }
      setSelectedTransactions(newSelected);
    } else {
      setSelectedTransactions(prevSelected => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(transactionId) && !isCtrlPressed) {
          newSelected.delete(transactionId);
        } else {
          newSelected.add(transactionId);
        }
        return newSelected;
      });
    }
    setLastSelectedIndex(index);
  };

  const handleSelectAll = () => {
    if (selectedTransactions.size === sortedTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      const allSelected: Set<string> = new Set(sortedTransactions.map((item: any) => item.transactionId));
      setSelectedTransactions(allSelected);
    }
  };

  const isItemSelected = (index: number): boolean => {
    return selectedTransactions.has(sortedTransactions[index].transactionId);
  };

  if (loading) return <div className='container' style={{width:'100%', alignItems: 'center'}}><h3 style={{color:'white'}} >Loading...</h3><OrbitProgress color="#ffffff" size="medium" text="" textColor="" /></div>;
  if (error) return <div className='container'><h3 style={{color:'white'}} >Error loading transactions.</h3></div>;

  return (
    <div>
      <button onClick={handleSelectAll}>
        {selectedTransactions.size === sortedTransactions.length ? 'Unselect All' : 'Select All'}
      </button>
      {selectedTransactions.size > 0 && sortedTransactions[0].status === 'Processed' && (
        <Link to={`/transactions/export`} style={{marginLeft: '1rem'}} state={{transactions: sortedTransactions.filter((transaction: any) =>
          selectedTransactions.has(transaction.transactionId)
        )}}>Export</Link>
      )}
      {sortedTransactions && sortedTransactions.length > 0 && (
        <div className="table">
          <div className="results header" style={{ marginBottom: '0' }}>
            <div className="invoice-grid-row header transactions">
              <div>Id</div>
              <div>Status</div>
              <div style={{ cursor: 'pointer' }} onClick={handleSort}>Date ({sortOrder === 'asc' ? 'Descending' : 'Ascending'})</div>
              <div>View</div>
              <div>Select</div>
            </div>
          </div>
          <div className="results items" style={{ maxHeight: '40rem', marginTop: '0' }}>
            {sortedTransactions.map((transaction: any, index: number) => (
                <TransactionListItem
                  transaction={transaction}
                  isSelected={isItemSelected(index)}
                  onSelect={(event: any) => handleSelect(transaction.transactionId, index, event)}
                  key = {index}
                />
            ))}
          </div>
        </div>
      )}
      {sortedTransactions && !sortedTransactions.length && <h3 style={{color:'white'}}>No transactions found.</h3>}
    </div>
  );
};

export default TransactionTable;