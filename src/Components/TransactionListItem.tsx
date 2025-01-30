import React from 'react';
import '../CSS/Todo.css';

interface TransactionListItemProps {
  transaction: any;
  isSelected: boolean;
  onSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, isSelected, onSelect }) => {
  return (
    <div className='invoice-grid-row transactions'>
      

      
      <div>{transaction.transactionId}</div>
      <div>{transaction.status ? transaction.status : 'Manual Review'}</div>
      <div>{new Date(transaction.createTimeUtc).toLocaleString()}</div>
      <div><a href={`/transaction/${transaction.transactionId}`}><button>View</button></a></div>
      <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
        />
    </div>
  );
};

export default TransactionListItem;