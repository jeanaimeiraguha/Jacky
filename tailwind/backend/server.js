import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pssms',
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected');
});

// ------------------- PARKING SLOT -------------------
app.get('/api/parkingslots', (req, res) => {
  db.query('SELECT * FROM parkingslot', (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

app.post('/api/parkingslots', (req, res) => {
  const { id, slotNumber, slotStatus } = req.body;
  const query = id
    ? 'INSERT INTO parkingslot (id, slotNumber, slotStatus) VALUES (?, ?, ?)'
    : 'INSERT INTO parkingslot (slotNumber, slotStatus) VALUES (?, ?)';
  const values = id ? [id, slotNumber, slotStatus] : [slotNumber, slotStatus];

  db.query(query, values, (err) => {
    if (err) return res.json(err);
    res.json('Parking slot added');
  });
});

app.put('/api/parkingslots/:id', (req, res) => {
  const { id } = req.params;
  const { slotNumber, slotStatus } = req.body;
  db.query(
    'UPDATE parkingslot SET slotNumber=?, slotStatus=? WHERE id=?',
    [slotNumber, slotStatus, id],
    (err) => {
      if (err) return res.json(err);
      res.json('Parking slot updated');
    }
  );
});

app.delete('/api/parkingslots/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM parkingslot WHERE id=?', [id], (err) => {
    if (err) return res.json(err);
    res.json('Parking slot deleted');
  });
});

// ------------------- CAR -------------------
app.get('/api/cars', (req, res) => {
  db.query('SELECT * FROM car', (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

app.post('/api/cars', (req, res) => {
  const { id, plateNumber, DriveName, PhoneNumber } = req.body;
  const query = id
    ? 'INSERT INTO car (id, plateNumber, DriveName, PhoneNumber) VALUES (?, ?, ?, ?)'
    : 'INSERT INTO car (plateNumber, DriveName, PhoneNumber) VALUES (?, ?, ?)';
  const values = id
    ? [id, plateNumber, DriveName, PhoneNumber]
    : [plateNumber, DriveName, PhoneNumber];

  db.query(query, values, (err) => {
    if (err) return res.json(err);
    res.json('Car added');
  });
});

app.put('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const { plateNumber, DriveName, PhoneNumber } = req.body;
  db.query(
    'UPDATE car SET plateNumber=?, DriveName=?, PhoneNumber=? WHERE id=?',
    [plateNumber, DriveName, PhoneNumber, id],
    (err) => {
      if (err) return res.json(err);
      res.json('Car updated');
    }
  );
});

app.delete('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM car WHERE id=?', [id], (err) => {
    if (err) return res.json(err);
    res.json('Car deleted');
  });
});

// ------------------- PARKING RECORD -------------------
app.get('/api/parkingrecords', (req, res) => {
  db.query('SELECT * FROM parkingrecord', (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

app.post('/api/parkingrecords', (req, res) => {
  const { id, EntryTime, ExitTime, Duration } = req.body;
  const query = id
    ? 'INSERT INTO parkingrecord (id, EntryTime, ExitTime, Duration) VALUES (?, ?, ?, ?)'
    : 'INSERT INTO parkingrecord (EntryTime, ExitTime, Duration) VALUES (?, ?, ?)';
  const values = id
    ? [id, EntryTime, ExitTime, Duration]
    : [EntryTime, ExitTime, Duration];

  db.query(query, values, (err) => {
    if (err) return res.json(err);
    res.json('Parking record added');
  });
});

app.put('/api/parkingrecords/:id', (req, res) => {
  const { id } = req.params;
  const { EntryTime, ExitTime, Duration } = req.body;
  db.query(
    'UPDATE parkingrecord SET EntryTime=?, ExitTime=?, Duration=? WHERE id=?',
    [EntryTime, ExitTime, Duration, id],
    (err) => {
      if (err) return res.json(err);
      res.json('Parking record updated');
    }
  );
});

app.delete('/api/parkingrecords/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM parkingrecord WHERE id=?', [id], (err) => {
    if (err) return res.json(err);
    res.json('Parking record deleted');
  });
});

// ------------------- PAYMENT -------------------
app.get('/api/payments', (req, res) => {
  db.query('SELECT * FROM payment', (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

app.post('/api/payments', (req, res) => {
  const { id, AmountPaid, PaymentDate } = req.body;
  const query = id
    ? 'INSERT INTO payment (id, AmountPaid, PaymentDate) VALUES (?, ?, ?)'
    : 'INSERT INTO payment (AmountPaid, PaymentDate) VALUES (?, ?)';
  const values = id
    ? [id, AmountPaid, PaymentDate]
    : [AmountPaid, PaymentDate];

  db.query(query, values, (err) => {
    if (err) return res.json(err);
    res.json('Payment added');
  });
});

app.put('/api/payments/:id', (req, res) => {
  const { id } = req.params;
  const { AmountPaid, PaymentDate } = req.body;
  db.query(
    'UPDATE payment SET AmountPaid=?, PaymentDate=? WHERE id=?',
    [AmountPaid, PaymentDate, id],
    (err) => {
      if (err) return res.json(err);
      res.json('Payment updated');
    }
  );
});

app.delete('/api/payments/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM payment WHERE id=?', [id], (err) => {
    if (err) return res.json(err);
    res.json('Payment deleted');
  });
});

// ------------------- SERVER -------------------
app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
