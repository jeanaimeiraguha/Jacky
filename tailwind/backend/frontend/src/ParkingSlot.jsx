import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function ParkingSlot() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ id: '', slotNumber: '', slotStatus: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/parkingslots');
      setSlots(res.data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (
      (editingId === null && !form.id.trim()) ||
      !form.slotNumber.trim() ||
      !form.slotStatus.trim()
    ) {
      setMessage({ type: 'danger', text: 'Please fill all fields including ID.' });
      return;
    }

    try {
      if (editingId !== null) {
        await axios.put(`http://localhost:5000/api/parkingslots/${editingId}`, {
          slotNumber: form.slotNumber,
          slotStatus: form.slotStatus,
        });
        setMessage({ type: 'warning', text: 'Slot updated successfully.' });
      } else {
        await axios.post('http://localhost:5000/api/parkingslots', form);
        setMessage({ type: 'success', text: 'Slot added successfully.' });
      }

      setForm({ id: '', slotNumber: '', slotStatus: '' });
      setEditingId(null);
      fetchSlots();
    } catch (err) {
      console.error('Error saving slot:', err);
      setMessage({ type: 'danger', text: 'Error saving slot.' });
    }
  };

  const handleEdit = (slot) => {
    setForm({ id: slot.id.toString(), slotNumber: slot.slotNumber, slotStatus: slot.slotStatus });
    setEditingId(slot.id);
    setMessage(null);
  };

  const handleCancel = () => {
    setForm({ id: '', slotNumber: '', slotStatus: '' });
    setEditingId(null);
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await axios.delete(`http://localhost:5000/api/parkingslots/${id}`);
        fetchSlots();
        setMessage({ type: 'danger', text: 'Slot deleted.' });
      } catch (err) {
        setMessage({ type: 'danger', text: 'Error deleting slot.' });
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex align-items-center">
          <i className="bi bi-car-front-fill me-2 fs-4"></i>
          <h4 className="mb-0">Parking Slots Management</h4>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          <div className="row mb-4">
            <div className="col-md-5">
              {editingId === null && (
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="ID"
                  value={form.id}
                  onChange={e => setForm({ ...form, id: e.target.value })}
                />
              )}

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Slot Number"
                value={form.slotNumber}
                onChange={e => setForm({ ...form, slotNumber: e.target.value })}
              />

              <select
                className="form-control mb-3"
                value={form.slotStatus}
                onChange={e => setForm({ ...form, slotStatus: e.target.value })}
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
              </select>

              <button
                className={`btn w-100 ${editingId !== null ? 'btn-warning' : 'btn-success'}`}
                onClick={handleSubmit}
              >
                <i className={`bi me-2 ${editingId !== null ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
                {editingId !== null ? 'Update Slot' : 'Add Slot'}
              </button>

              {editingId !== null && (
                <button className="btn btn-secondary w-100 mt-2" onClick={handleCancel}>
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Slot Number</th>
                  <th>Status</th>
                  <th style={{ minWidth: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4">
                      <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status" />
                      </div>
                    </td>
                  </tr>
                ) : slots.length > 0 ? (
                  slots.map(slot => (
                    <tr key={slot.id} className="align-middle">
                      <td>{slot.id}</td>
                      <td>{slot.slotNumber}</td>
                      <td>
                        <span
                          className={`badge px-3 py-2 fs-6 ${
                            slot.slotStatus.toLowerCase() === 'available' ? 'bg-success' : 'bg-danger'
                          }`}
                          style={{ transition: 'background-color 0.3s ease' }}
                        >
                          {slot.slotStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(slot)}
                          title="Edit Slot"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(slot.id)}
                          title="Delete Slot"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-muted fst-italic">
                      No parking slots found.
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

export default ParkingSlot;
