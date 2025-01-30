import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { OrbitProgress } from 'react-loading-indicators';
import '../CSS/Transaction.css';
import { fetchTransactionDetails, fetchResults } from '../Services/transactionService';

const Transaction: React.FC = () => {
  let { id } = useParams();
  const [transaction, setTransaction] = useState<any>(null);
  const [error, setError] = useState(false);
  const [results, setResults] = useState<any>(null);

  const downloadJSON = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (id) {
      fetchTransactionDetails(id).then(res => {
        setTransaction(res);
        console.log(res)
        if(res.documents && res.documents.length > 0) {
          fetchResults(transaction).then(result => {
            console.log('Results:', result);
            setResults(result);
          }).catch(error => {
            console.error('Error fetching results:', error);
          });
        }
      }).catch(error => {
        console.error('Error setting transaction:', error);
        setError(true);
      });
    }
  }, []);

useEffect(() => {
  if (transaction && transaction.status !== 'Processed' /*&& manualReviewLink.length === 0*/) {
    const interval = setInterval(myIntervalFunction, 2000);

     function myIntervalFunction() {
      if (transaction ) {
        fetchTransactionDetails(transaction.id).then(async res => {
          console.log(res);
          setTransaction(res);
          if (res.manualReviewLink && res.status !=='Processed') {
            //clearInterval(interval);
            console.log('Awaiting Manual Review')
            console.log('transaction.status:',transaction.status)
            localStorage.setItem('transaction', JSON.stringify(transaction));
          } if (res.status === 'Processed') {
            clearInterval(interval);
            console.log('Transaction Complete :',res);
            setTransaction(res);
            //setDownload(true);
          }
        });
      }
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }

  else if( transaction && transaction.status == 'Processed'){
    fetchResults(transaction).then(result => {
      console.log('Results:', result);
      setResults(result);
    }).catch(error => {
      console.error('Error fetching results:', error);
    });
    localStorage.setItem('transaction', JSON.stringify(transaction));
}

}, [transaction]);

  if(error) return <NotFound/>;

  if(transaction)return (
    <div className='container'>
      {transaction.id &&<h2 style={{color: 'white'}} >Transaction Id : {transaction.id}</h2>}
      {transaction.status &&<h3 style={{color: 'white'}} >Transaction Status : {transaction.status}</h3>}
      {<div className='status'>
          {transaction.manualReviewLink && <div>
          <a href={transaction.manualReviewLink} target="_blank">  <button className='review'>Manual Review</button></a>
          </div>}
          {transaction.status === 'Processed' && <div hidden>
            <button onClick={()=>{console.log(fetchResults(transaction))
            }}>Log Data</button>
          </div>}
          {transaction.documents && <div>
            <button onClick={()=>{console.log(downloadJSON(results, 'results.json'))
            }}>Download Data</button>
          </div>}
          {!transaction.manualReviewLink && transaction.status != 'Processed' && <div className='progress'><div style={{color:'white'}}>Processing Files . . .</div><OrbitProgress color="#ffffff" size="medium" text="" textColor="" /></div>}
      </div>}
    </div>
  );
};

export default Transaction;