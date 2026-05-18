require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth',    require('./routes/auth'));
app.use('/wallet',  require('./routes/wallet'));
app.use('/tickets', require('./routes/tickets'));
app.use('/events',  require('./routes/events'));

app.get('/health', (_, res) => res.json({ status: 'ok', db: 'MySQL (joj_dakar)' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`JOJ API running on http://localhost:${PORT}`));
