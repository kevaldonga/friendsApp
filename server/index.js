const app = require('express')();
const userRouter = require('./routes/users');
const profileRouter = require('./routes/profiles');
const userRelationRouter = require('./routes/userRelations');
const storyRouter = require('./routes/stories');
const postRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
const chatroomRouter = require('./routes/chatrooms');

const PORT = 8000;

// users
app.use("/users", userRouter);

// profiles
app.use("/profiles", profileRouter);

// user relations
app.use("/userRelations", userRelationRouter);

// stories
app.use("/stories", storyRouter);

// posts
app.use("/posts", postRouter);

// comments
app.use("/comments", commentRouter);

// chatrooms
app.use("/chatrooms", chatroomRouter);

app.listen(PORT, () => console.log("server is running..."));