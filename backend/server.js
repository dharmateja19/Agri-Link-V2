import './config/env.js'

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import connectdb from './config/db.js';
import cropRoutes from './routes/cropRoutes.js'
import authMiddleware from './middleware/authMiddleware.js';
import userRoutes from './routes/userRoutes.js'
import contactRequestRoutes from './routes/contactRequestRoutes.js'
import dealRoutes from './routes/dealRoutes.js'
const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

app.get('/', (req,res) => {
    res.send("Hello from backend")
});

app.use('/auth',authRoutes);
app.use('/crops',authMiddleware,cropRoutes);
app.use('/deals', authMiddleware, dealRoutes)
app.use('/users',authMiddleware ,userRoutes);
app.use('/contact',authMiddleware,contactRequestRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: "404 Not Found" });
});

app.listen(PORT , '0.0.0.0' , async () => {
    try {
        await connectdb()
        console.log(`App running on port ${PORT}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
   
})

export default app;