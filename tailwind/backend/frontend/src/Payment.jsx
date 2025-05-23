import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Payment() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ id: '', AmountPaid: '', PaymentDate: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setMessage({ type: 'danger', text: 'Failed to load payments.' });
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (
      (editingId === null && !form.id.trim()) ||
      !form.AmountPaid.toString().trim() ||
      !form.PaymentDate.trim()
    ) {
      setMessage({ type: 'danger', text: 'Please fill all fields including ID.' });
      return;
    }

    try {
      if (editingId !== null) {
        await axios.put(`http://localhost:5000/api/payments/${editingId}`, {
          AmountPaid: form.AmountPaid,
          PaymentDate: form.PaymentDate,
        });
        setMessage({ type: 'warning', text: 'Payment updated successfully.' });
      } else {
        await axios.post('http://localhost:5000/api/payments', form);
        setMessage({ type: 'success', text: 'Payment added successfully.' });
      }

      setForm({ id: '', AmountPaid: '', PaymentDate: '' });
      setEditingId(null);
      fetchPayments();
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error saving payment.' });
    }
  };

  const handleEdit = (payment) => {
    setForm({
      id: payment.id.toString(),
      AmountPaid: payment.AmountPaid,
      PaymentDate: payment.PaymentDate,
    });
    setEditingId(payment.id);
    setMessage(null);
  };

  const handleCancel = () => {
    setForm({ id: '', AmountPaid: '', PaymentDate: '' });
    setEditingId(null);
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/payments/${id}`);
        fetchPayments();
        setMessage({ type: 'danger', text: 'Payment deleted.' });
      } catch (err) {
        setMessage({ type: 'danger', text: 'Error deleting payment.' });
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <i className="bi bi-currency-dollar me-2 fs-4"></i>
          <h4 className="mb-0">Payments</h4>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          <div className="row g-3 mb-3">
            {/* Show ID input only when adding new payment */}
            {editingId === null && (
              <div className="col-md-12">
                <input
                  type="number"
                  className="form-control"
                  placeholder="ID"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  min="1"
                />
              </div>
            )}

            <div className={editingId === null ? "col-md-6" : "col-md-12"}>
              <input
                type="number"
                className="form-control"
                placeholder="Amount Paid"
                value={form.AmountPaid}
                onChange={(e) => setForm({ ...form, AmountPaid: e.target.value })}
                min="0"
                step="0.01"
              />
            </div>
            <div className={editingId === null ? "col-md-6" : "col-md-12"}>
              <input
                type="date"
                className="form-control"
                placeholder="Payment Date"
                value={form.PaymentDate}
                onChange={(e) => setForm({ ...form, PaymentDate: e.target.value })}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mb-4">
            <button
              className={`btn w-100 ${editingId !== null ? 'btn-warning' : 'btn-success'}`}
              onClick={handleSubmit}
            >
              <i className={`bi me-2 ${editingId !== null ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
              {editingId !== null ? 'Update Payment' : 'Add Payment'}
            </button>

            {editingId !== null && (
              <button className="btn btn-secondary w-100" onClick={handleCancel}>
                <i className="bi bi-x-circle me-2"></i> Cancel
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th style={{ minWidth: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4">
                      <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status"></div>
                      </div>
                    </td>
                  </tr>
                ) : payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>${parseFloat(payment.AmountPaid).toFixed(2)}</td>
                      <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEdit(payment)}
                          title="Edit Payment"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(payment.id)}
                          title="Delete Payment"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-muted fst-italic">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
