import React, { useEffect, useState } from 'react';
import TransactionTable from './TransactionTable';
import { useLocation } from 'react-router-dom';
import { set } from 'react-datepicker/dist/date_utils';
import { fetchTransactionDetails } from '../Services/transactionService';



const Export: React.FC = () => {

    const location = useLocation()
    const data = location.state
    const [transactions, setTransactions] = useState<any>(data.transactions)
    const [results, setResults] = useState<any>([])

    useEffect(() => {
        const fetchDetails = async () => {
            setResults([])
            transactions.forEach(async (transaction: any) => {
                await fetchTransactionDetails(transaction.transactionId).then((response) => {
                    //console.log(response)
                    response.documents.forEach((document: any) => {
                        /*document.resultFiles.forEach((file:any)=>{
                            //console.log(file)
                            setResults((prevResults: any) => [...prevResults, file]);
                        })*/
                            setResults((prevResults: any) => [...prevResults, document.resultFiles]);
                        
                })
                })
            })
        }
        fetchDetails()
    }, [])

    return (
        <div>
            <h1>Export Component</h1>
            {true && <TransactionTable transactions={transactions} loading={false} error={false}/>}
            <button onClick={() => console.log(results)}>Show Results</button>
            <button onClick={() => console.log(transactions)}>Show Transactions</button>
        </div>
    );
};

export default Export;