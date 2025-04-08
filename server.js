const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const User = require('./model/user');

app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb+srv://puran:2237436@cluster0.pmgw5mw.mongodb.net/recipeApp?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err.message));

app.use((req, res, next) => {
  console.log(req.url, req.path, req.method);
  next();
})

app.use("/signup", async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).send('User signed up successfully');
    } catch (error) {
      res.status(500).send('Error signing up user');
    }
  })

  app.use('/signin', async (req, res) => {
    try {
      console.log(req.body);
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const isPasswordValid = (req.body.password===user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Invalid credentials');
      }
  
      res.status(200).send('User signed in successfully');
    } catch (error) {
      res.status(500).send('Error signing in user');
    }
  });

app.use('/', (req, res) => {
  res.render("/login.html");
})
app.listen(3000, () => {
  console.log(`Example app listening on port ${port}`)
})