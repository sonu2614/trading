import React, { useState } from 'react';
import './TradingJournal.css';
import * as XLSX from 'xlsx';

const TradingJournal = () => {
  const [trades, setTrades] = useState([]);
  const [formData, setFormData] = useState({
    stockName: '',
    transactionType: 'Buy',
    quantity: '',
    date: '',
    quantityOptions: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let quantityOptions = [];
    if (value === 'Nifty50') {
      quantityOptions = [50, 100, 150, 200];
    } else if (value === 'NiftyBank') {
      quantityOptions = [15, 30, 45, 60];
    }

    setFormData({
      ...formData,
      [name]: value,
      quantity: '',
      quantityOptions, 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTrade = { ...formData };
    setTrades([...trades, newTrade]);
    setFormData({
      stockName: '',
      transactionType: 'Buy',
      quantity: '',
      date: '',
      quantityOptions: [],
    });
  };

  const handleReset = () => {
    setFormData({
      stockName: '',
      transactionType: 'Buy',
      quantity: '',
      date: '',
      quantityOptions: [],
    });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(trades);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trades');
    XLSX.writeFile(wb, 'trades.xlsx');
  };

  return (
    <div>
      <h1>Trading Journal</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Stock Name:
          <select name="stockName" value={formData.stockName} onChange={handleChange}>
            <option value="">Select Stock Name</option>
            <option value="Nifty50">Nifty 50</option>
            <option value="NiftyBank">Nifty Bank</option>
          </select>
        </label>
        <label>
          Transaction Type:
          <select
            name="transactionType"
            value={formData.transactionType}
            onChange={handleChange}
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
        </label>
        <label>
          Quantity:
          <select
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            disabled={!formData.quantityOptions || formData.quantityOptions.length === 0}
          >
            <option value="" disabled>Select Quantity</option>
            {formData.quantityOptions &&
              formData.quantityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Trade</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
      <button type="button" onClick={exportToExcel}>Export to Excel</button>
      <h2>Trades</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Stock Name</th>
            <th>Transaction Type</th>
            <th>Quantity</th>
            <th>Profit/Loss</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => {
            const buyCost = parseFloat(trade.quantity) * parseFloat(trade.buyPrice);
            const sellRevenue = parseFloat(trade.quantity) * parseFloat(trade.sellPrice);
            const profitLoss = trade.transactionType === 'Sell' ? sellRevenue - buyCost : '-';
            
            return (
              <tr key={index}>
                <td>{trade.date}</td>
                <td>{trade.stockName}</td>
                <td>{trade.transactionType}</td>
                <td>{trade.quantity}</td>
                <td>{profitLoss}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TradingJournal;

