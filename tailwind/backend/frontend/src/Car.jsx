import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Car() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ plateNumber: '', DriveName: '', PhoneNumber: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const res = await axios.get('http://localhost:5000/api/cars');
    setCars(res.data);
  };

  const handleSubmit = async () => {
    if (!form.plateNumber.trim() || !form.DriveName.trim() || !form.PhoneNumber.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (editingId !== null) {
        // Update existing car
        await axios.put(`http://localhost:5000/api/cars/${editingId}`, {
          plateNumber: form.plateNumber,
          DriveName: form.DriveName,
          PhoneNumber: form.PhoneNumber,
        });
      } else {
        // Add new car, do NOT send id
        await axios.post('http://localhost:5000/api/cars', {
          plateNumber: form.plateNumber,
          DriveName: form.DriveName,
          PhoneNumber: form.PhoneNumber,
        });
      }

      setForm({ plateNumber: '', DriveName: '', PhoneNumber: '' });
      setEditingId(null);
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Failed to save car.');
    }
  };

  const handleEdit = (car) => {
    setForm({
      plateNumber: car.plateNumber,
      DriveName: car.DriveName,
      PhoneNumber: car.PhoneNumber,
    });
    setEditingId(car.id);
  };

  const handleCancel = () => {
    setForm({ plateNumber: '', DriveName: '', PhoneNumber: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      await axios.delete(`http://localhost:5000/api/cars/${id}`);
      fetchCars();
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-info text-white d-flex align-items-center">
          <i className="bi bi-truck-front-fill me-2 fs-4"></i>
          <h4 className="mb-0">Cars Management</h4>
        </div>
        <div className="card-body">
          <div className="row g-3 mb-4">
            {/* No input for id here */}
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Plate Number"
                value={form.plateNumber}
                onChange={e => setForm({ ...form, plateNumber: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Driver Name"
                value={form.DriveName}
                onChange={e => setForm({ ...form, DriveName: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                type="tel"
                className="form-control"
                placeholder="Phone Number"
                value={form.PhoneNumber}
                onChange={e => setForm({ ...form, PhoneNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mb-3">
            <button
              className={`btn w-100 ${editingId !== null ? 'btn-warning' : 'btn-success'}`}
              onClick={handleSubmit}
              disabled={!form.plateNumber.trim() || !form.DriveName.trim() || !form.PhoneNumber.trim()}
            >
              <i className={`bi me-2 ${editingId !== null ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
              {editingId !== null ? 'Update Car' : 'Add Car'}
            </button>

            {editingId !== null && (
              <button className="btn btn-secondary w-100" onClick={handleCancel}>
                <i className="bi bi-x-circle me-2"></i> Cancel
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Plate Number</th>
                  <th>Driver</th>
                  <th>Phone</th>
                  <th style={{ minWidth: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.length > 0 ? (
                  cars.map(car => (
                    <tr key={car.id}>
                      <td>{car.id}</td>
                      <td>{car.plateNumber}</td>
                      <td>{car.DriveName}</td>
                      <td>{car.PhoneNumber}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEdit(car)}
                          title="Edit Car"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(car.id)}
                          title="Delete Car"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-muted fst-italic">
                      No cars found.
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

export default Car;
