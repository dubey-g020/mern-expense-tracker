import { useEffect, useState } from 'react';
import API from '../services/api';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingAmount, setEditingAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await API.get('/auth/profile');
        setUser(profileRes.data);
        const expensesRes = await API.get('/expenses');
        setExpenses(expensesRes.data);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/expenses', { title, amount });
      setExpenses([res.data, ...expenses]);
      setTitle('');
      setAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense._id);
    setEditingTitle(expense.title);
    setEditingAmount(expense.amount);
  };

  const saveEdit = async (id) => {
    try {
      const res = await API.put(`/expenses/${id}`, {
        title: editingTitle,
        amount: editingAmount
      });
      setExpenses(expenses.map((exp) => (exp._id === id ? res.data : exp)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;



  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>Welcome, {user.name}!</h2>
        <p className="text-muted">{user.email}</p>
        <LogoutButton />
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <h4>Add Expense</h4>
        <form onSubmit={addExpense} className="row g-2 align-items-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-md-5">
            <input
              type="number"
              className="form-control"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Add</button>
          </div>
        </form>
      </div>

      <h4>Your Expenses</h4>
      {expenses.map((exp) => (
        <div className="card p-3 mb-3" key={exp._id}>
          {editingId === exp._id ? (
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  value={editingAmount}
                  onChange={(e) => setEditingAmount(e.target.value)}
                />
              </div>
              <div className="col-md-4 d-flex gap-2">
                <button className="btn btn-success" onClick={() => saveEdit(exp._id)}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{exp.title}</strong>: ₹{exp.amount}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(exp)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteExpense(exp._id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

