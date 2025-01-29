import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionTable from './TransactionTable';
import '../CSS/TransactionList.css';
import DatePicker from 'react-datepicker';

const TransactionList: React.FC = () => {
  const [activeTransactions, setActiveTransactions] = useState<any[]>([]);
  const [completedTransactions, setCompletedTransactions] = useState<any[]>([]);
  const [loadingActiveTransactions, setLoadingActiveTransactions] = useState<boolean>(true);
  const [loadingCompletedTransactions, setLoadingCompletedTransactions] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [view, setView] = useState<'active' | 'completed'>('completed');

  const baseUrl = process.env.REACT_APP_BASE_URL!;
  const token = process.env.REACT_APP_TOKEN!;

  const getToken = () => {
    return token;
  };

  const fetchCompletedTransactions = async (startDate: Date) => {
    try {
      const token = getToken();
      startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
      const response = await axios.get(`${baseUrl}/api/publicapi/v1/transactions/completed?StageType=Automatic&StartDate=${startDate.toISOString()}&EndDate=&Limit=100`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setCompletedTransactions(response.data);
      console.log(response.data);
      localStorage.setItem('completedTransactions', JSON.stringify(response.data));
      setLoadingCompletedTransactions(false);
    } catch (error) {
      console.error('Error fetching completed transactions:', error);
      setError(true);
      setLoadingCompletedTransactions(false);
    }
  };

  const fetchActiveTransactions = async (startDate: Date) => {
    try {
      const token = getToken();
      startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
      const response = await axios.get(`${baseUrl}/api/publicapi/v1/transactions/active?StageType=ManualReview&StartDate=${startDate.toISOString()}&EndDate=&Limit=100`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setActiveTransactions(response.data);
      console.log(response.data);
      localStorage.setItem('activeTransactions', JSON.stringify(response.data));
      setLoadingActiveTransactions(false);
    } catch (error) {
      console.error('Error fetching active transactions:', error);
      setError(true);
      setLoadingActiveTransactions(false);
    }
  };

  const loadTransactions = async (date: Date) => {
    setLoadingActiveTransactions(true)
    setLoadingCompletedTransactions(true)

    await fetchActiveTransactions(date);
    setLoadingActiveTransactions(false)

    await fetchCompletedTransactions(date);
    setLoadingCompletedTransactions(false)
  }

  const fetchData = async () => {
    const storedActiveTransactions = localStorage.getItem('activeTransactions');
    const storedCompletedTransactions = localStorage.getItem('completedTransactions');
    const date = localStorage.getItem('date');
    if (storedActiveTransactions && storedCompletedTransactions && date) {
      setActiveTransactions(JSON.parse(storedActiveTransactions));
      setCompletedTransactions(JSON.parse(storedCompletedTransactions));
      setStartDate(new Date(date))
      setLoadingActiveTransactions(false)
      setLoadingCompletedTransactions(false)
    } else {
        loadTransactions(startDate)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  async function handleDateSelect(date: Date | null) {
    if (date) {
      setStartDate(date);
      localStorage.setItem('date', date.toISOString());
      setLoadingActiveTransactions(true)
      setLoadingCompletedTransactions(true)
      loadTransactions(date)
    }
  }

  return (

      <div className='container transactions'>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button onClick={() => {loadTransactions(startDate)}}>Refresh</button>
        <button className={view === 'active' ? 'selected' : ''} onClick={() => {setView('active')}}>Active Transactions</button>
        <button className={view === 'completed' ? 'selected' : ''} onClick={() => {setView('completed')}}>Completed Transactions</button>
        <DatePicker selected={startDate} onChange={(date) => {handleDateSelect(date);}}/>
      </div>
      {view == 'active' && <TransactionTable
        loading={loadingActiveTransactions}
        error={error}
        transactions={activeTransactions}
      />}
        {view == 'completed' && <TransactionTable
        loading={loadingCompletedTransactions}
        error={error}
        transactions={completedTransactions}
      />}
      </div>
  );
};

export default TransactionList;