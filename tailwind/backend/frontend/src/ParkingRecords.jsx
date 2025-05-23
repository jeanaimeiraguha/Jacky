import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ParkingRecord() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ id: '', EntryTime: '', ExitTime: '', Duration: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    const res = await axios.get('http://localhost:5000/api/parkingrecords');
    setRecords(res.data);
  };

  const handleSubmit = async () => {
    const { id, EntryTime, ExitTime, Duration } = form;
    if (!id.trim() || !EntryTime.trim() || !ExitTime.trim() || !Duration.trim()) {
      alert('Please fill all fields.');
      return;
    }
    if (editingId !== null) {
      await axios.put(`http://localhost:5000/api/parkingrecords/${editingId}`, { EntryTime, ExitTime, Duration });
    } else {
      await axios.post('http://localhost:5000/api/parkingrecords', form);
    }
    setForm({ id: '', EntryTime: '', ExitTime: '', Duration: '' });
    setEditingId(null);
    fetchRecords();
  };

  const handleEdit = (record) => {
    setForm(record);
    setEditingId(record.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await axios.delete(`http://localhost:5000/api/parkingrecords/${id}`);
      fetchRecords();
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white d-flex align-items-center">
          <i className="bi bi-clock-history me-2 fs-4"></i>
          <h4 className="mb-0">Parking Records</h4>
        </div>
        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="ID"
                value={form.id}
                onChange={e => setForm({ ...form, id: e.target.value })}
                disabled={editingId !== null}
              />
            </div>
            <div className="col-md-3">
              <input
                type="datetime-local"
                className="form-control"
                placeholder="Entry Time"
                value={form.EntryTime}
                onChange={e => setForm({ ...form, EntryTime: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                type="datetime-local"
                className="form-control"
                placeholder="Exit Time"
                value={form.ExitTime}
                onChange={e => setForm({ ...form, ExitTime: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Duration"
                value={form.Duration}
                onChange={e => setForm({ ...form, Duration: e.target.value })}
              />
            </div>
          </div>
          <button
            className={`btn w-100 mb-3 ${editingId !== null ? 'btn-warning' : 'btn-success'}`}
            onClick={handleSubmit}
            disabled={!form.id || !form.EntryTime || !form.ExitTime || !form.Duration.trim()}
          >
            <i className={`bi me-2 ${editingId !== null ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
            {editingId !== null ? 'Update Record' : 'Add Record'}
          </button>

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Duration</th>
                  <th style={{ minWidth: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map(record => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{new Date(record.EntryTime).toLocaleString()}</td>
                      <td>{new Date(record.ExitTime).toLocaleString()}</td>
                      <td>{record.Duration}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEdit(record)}
                          title="Edit Record"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(record.id)}
                          title="Delete Record"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-muted fst-italic">
                      No parking records found.
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

export default ParkingRecord;
