import React, { useState } from 'react'
import Calendar from './Calendar';
import TransactionsList from './TransactionsList';
import AddEditTransaction from '../navbar/AddEditTransaction';
import { useBoundedStore } from '@/app/store/boundedStore';
import { useStore } from 'zustand';
import moment from 'moment';

function StatisticMain({calendarStart, calendarEnd, setCalendarStart, setCalendarEnd}) {
    const boundedStore = useStore(useBoundedStore);
    const transactions = useBoundedStore((state) => state.transactionsByMonth);
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const [modalOpen, setModalOpen] = useState(false);
    const [editedData, setEditedData] = useState("");
    
    const handleEditTransaction = (transactionData) => {
        setModalOpen(true);
        setEditedData(transactionData);
    };

    const handleDeleteTransaction = (transactionData) => {
      try {
        boundedStore.setIsLoading();
        boundedStore.deleteTransaction(transactionData);
        boundedStore.setOperationSuccess();
      } catch (error) {
        boundedStore.setOperationFailed();
      }
    };

  return (
    <div className="w-full h-full grid grid-cols-10 gap-x-2">
      <div className="col-span-7 bg-white rounded-lg p-4 flex flex-col shadow-lg">
        <Calendar
          transactionsAmount={
            transactions[calendarStart?.format("YYYYMMDD")]?.transactionsAmount
          }
          setCalendarStart={setCalendarStart}
          setCalendarEnd={setCalendarEnd}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="col-span-3">
        <TransactionsList
          transactions={transactions}
          calendarStart={calendarStart}
          selectedDate={selectedDate}
          handleEditTransaction={handleEditTransaction}
          handleDeleteTransaction={handleDeleteTransaction}
        />
      </div>

      <AddEditTransaction
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        transactionData={editedData}
      />
    </div>
  );
}

export default StatisticMain
