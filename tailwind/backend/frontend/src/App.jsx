import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import ParkingSlot from './ParkingSlot';
import Car from './Car';
import ParkingRecord from './ParkingRecords';
import Payment from './Payment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          {/* Default redirect to parking slots */}
          <Route index element={<Navigate to="parkingslots" replace />} />
          <Route path="parkingslots" element={<ParkingSlot />} />
          <Route path="cars" element={<Car />} />
          <Route path="parkingrecords" element={<ParkingRecord />} />
          <Route path="payments" element={<Payment />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
