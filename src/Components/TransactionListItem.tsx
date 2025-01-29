import '../CSS/Todo.css'

function TransactionListItem(props: any) {

  const date = new Date(props.transaction.createTimeUtc);

  const formmatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
  }

  return (
    <div className='invoice-grid-row transactions' >
      <div>{props.transaction.transactionId}</div>
      <div>{props.transaction.status ? props.transaction.status : 'Manual Review'}</div>
      <div>{formmatDate(date)}</div>
      <div><a href={`/transaction/${props.transaction.transactionId}`} ><button>View</button></a></div>
    </div>
  );
}

export default TransactionListItem;