const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const moment = require('moment')
const saltRounds = 10;
const app = express();
const port = 8000

app.use(bodyParser.json());
app.use(cors());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Charan@123',
  database: 'dataflix_db',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Hash the password before storing it in the database
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
      username,
      email,
      password: hashedPassword,
    };

    db.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        console.error('MySQL query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('New user added with ID:', result.insertId);
      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
  } catch (error) {
    console.error('Password hashing error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = results[0];
    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      res.json({ message: 'Login successful', userData: user });
    } catch (error) {
      console.error('Password comparison error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
})

// app.post('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Session destruction error:', err);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }

//     res.json({ message: 'Logout successful' });
//   });
// });


app.post('/tasks', (req, res) => {

  const userId = req.body.id; // Assuming you store the user's ID in the session
  db.query('SELECT * FROM tasks WHERE uid = ?', [userId], (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(results);
  });
});


app.post('/addtasks', (req, res) => {
  console.log(req.body)
  const { title, description, due_date } = req.body.formData;
  const uid = req.body.uid;
  const task = {
    title,
    description,
    due_date,
    uid,
  };
  console.log(task)
  db.query('INSERT INTO tasks SET ?', task, (err, result) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('New task added with ID:', result.insertId);
    res.status(201).json({ message: 'Task created successfully', taskId: result.insertId });
  });
});


app.put('/updatetask/:taskId', (req, res) => {

  const taskId = req.params.taskId;
  const { title, description } = req.body.formData;
  const uid = req.body.uid;
  const due_date = moment(req.body.formData.due_date).format('YYYY-MM-DD')
  const updatedTask = {
    title,
    description,
    due_date,
    uid
  };

  db.query('UPDATE tasks SET ? WHERE id = ?', [updatedTask, taskId], (err) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ message: 'Task updated successfully' });
  });
}
);

app.put('/taskCompletedStatus/:status/:taskId', (req, res) => {

  const taskStatus = req.params.status;
  const taskId = req.params.taskId;


  db.query("UPDATE tasks SET completed = '" + taskStatus + "' where id ='" + taskId + "'", (err) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ message: 'Completed Status updated successfully' });
  });
}
);


app.delete('/deletetask/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Task deleted successfully');
    res.json({ message: 'Task deleted successfully' });
  });
}
);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


