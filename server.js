const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const _ = require('lodash');

const app = express();

app.use(cors());
app.options('*', cors());

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const { User } = require('./Helpers/UserClass');

require('./socket/streams')(io, User, _);
require('./socket/private')(io);

const dbConfig = require('./config/database');
const auth = require('./routes/authRoutes');
const posts = require('./routes/postRoutes');
const users = require('./routes/userRoutes');
const friends = require('./routes/friendsRoutes');
const message = require('./routes/messageRoutes');
const image = require('./routes/imageRoutes');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
// app.use(logger('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(
  dbConfig.url,
  { useNewUrlParser: true }
);

app.use('/api/spade', auth);
app.use('/api/spade', posts);
app.use('/api/spade', users);
app.use('/api/spade', friends);
app.use('/api/spade', message);
app.use('/api/spade', image);

let port = process.env.PORT || 3000;

server.listen(port, () => 
  console.log('Running on port '+port)
)