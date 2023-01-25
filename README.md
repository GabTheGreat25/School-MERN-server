# School-MERN-server

source :: http://172.34.150.150/moodle/mod/page/view.php?id=63
React Blog

create client and server directory

react_blog >npx create-react-app client



//app.js

import React from 'react';



const App = () => (

  <div>

    <h1>MERN CRUD</h1>

  </div>

);



export default App


//setup the back end

npm init -y
npm i
npm i cors dotenv express express-jwt jsonwebtoken mongoose morgan nodemon slugify



package.json

"start": "nodemon server.js"



server.js

const express = require('express');

const morgan = require('morgan');

const bodyParser = require('body-parser');

const cors = require('cors');

const mongoose = require('mongoose');

require('dotenv').config();



// app

const app = express();



// db

mongoose

    .connect(process.env.DATABASE, {

        useNewUrlParser: true,

        

        useUnifiedTopology: true

    })

    .then(() => console.log('DB connected'))

    .catch(err => console.log(err));



// middlewares

app.use(cors());

app.use(morgan('dev'));

app.use(express.json());



// route

app.get('*', (req, res) => {

    res.json({

        data: 'You reached nodejs api for react node crud app'

    });

});



// port

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));





server/.env

DATABASE=mongodb+srv://bsit2022:98b2uEM7VeWrZP8W@cluster0.2oio5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority







server/routes/post.js

const express = require('express');

const router = express.Router();



// import controller methods

const { create } = require('../controllers/post');



router.post('/post', create);



module.exports = router;





server.js

const postRoutes = require('./routes/post');



app.use('/api', postRoutes);



server/models/post.js

const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;



const postSchema = new mongoose.Schema(

    {

        title: {

            type: String,

            trim: true,

            min: 3,

            max: 160,

            required: true

        },

        slug: {

            type: String,

            unique: true,

            index: true,

            lowercase: true

        },

        content: {

            type: {},

            required: true,

            min: 20,

            max: 2000000

        },

        user: {

            type: String,

            default: 'Admin'

        }

    },

    { timestamps: true }

);



module.exports = mongoose.model('Post', postSchema);





controllers/post.js

const Post = require('../models/post');

const slugify = require('slugify');



exports.create = (req, res) => {

    // console.log(req.body);

    const { title, content, user } = req.body;

    const slug = slugify(title);

    // validate

    switch (true) {

        case !title:

            return res.status(400).json({ error: 'Title is required' });

            break;

        case !content:

            return res.status(400).json({ error: 'Content is required' });

            break;

    }

    // create post

    Post.create({ title, content, user, slug }, (err, post) => {

        if (err) {

            console.log(err);

            res.status(400).json({ error: 'Duplicate post. Try another title' });

        }

        res.json(post);

    });

};



client/Routes.js

import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './App';

import Create from './Create';



const RoutedApp = () => {

    return (

        <Router>

            <Routes>

                <Route path="/" exact="true" element={<App />} />

                <Route path="/create" exact="true" element={<Create />} />

            </Routes>

        </Router>

    );

};



export default RoutedApp;





client/src/create.js

import React, { useState } from 'react';



const Create = () => (

    <div className="container p-5">

        <h1>CREATE POST</h1>

        <br />

        <form>

            <div className="form-group">

                <label className="text-muted">Title</label>

                <input type="text" className="form-control" placeholder="Post title" required />

            </div>

            <div className="form-group">

                <label className="text-muted">Content</label>

                <textarea type="text" className="form-control" placeholder="Write something.." required />

            </div>

            <div className="form-group">

                <label className="text-muted">User</label>

                <input type="text" className="form-control" placeholder="Your name" required />

            </div>

            <div>

                <button className="btn btn-primary">Create</button>

            </div>

        </form>

    </div>

);



export default Create;



using state

create.js

import React, { useState } from 'react';



const Create = () => {

    // state

    const [state, setState] = useState({

        title: '',

        content: '',

        user: ''

    });

    // destructure values from state

    const { title, content, user } = state;



    // onchange event handler

    const handleChange = name => event => {

        // console.log('name', name, 'event', event.target.value);

        setState({ ...state, [name]: event.target.value });

    };



    // function handleChange(name) {

    //     return function(event) {

    //         setState({ ...state, [name]: event.target.value });

    //     };

    // }



    return (

        <div className="container p-5">

            <h1>CREATE POST</h1>

            <br />

            {JSON.stringify(state)}

            <form>

                <div className="form-group">

                    <label className="text-muted">Title</label>

                    <input

                        onChange={handleChange('title')}

                        value={title}

                        type="text"

                        className="form-control"

                        placeholder="Post title"

                        required

                    />

                </div>

                <div className="form-group">

                    <label className="text-muted">Content</label>

                    <textarea

                        onChange={handleChange('content')}

                        value={content}

                        type="text"

                        className="form-control"

                        placeholder="Write something.."

                        required

                    />

                </div>

                <div className="form-group">

                    <label className="text-muted">User</label>

                    <input

                        onChange={handleChange('user')}

                        value={user}

                        type="text"

                        className="form-control"

                        placeholder="Your name"

                        required

                    />

                </div>

                <div>

                    <button className="btn btn-primary">Create</button>

                </div>

            </form>

        </div>

    );

};



export default Create;



create.js

const handleSubmit = event => {

        event.preventDefault();

        // console.table({ title, content, user });

        axios

            .post(`${process.env.REACT_APP_API}/post`, { title, content, user })

            .then(response => {

                console.log(response);

                // empty state

                setState({ ...state, title: '', content: '', user: '' });

                // show sucess alert

                alert(`Post titled ${response.data.title} is created`);

            })

            .catch(error => {

                console.log(error.response);

                alert(error.response.data.error);

            });

    };



<form onSubmit={handleSubmit}>



client/.env

REACT_APP_API=http://localhost:8000/api





src/Nav.js

import React from 'react';

import { Link } from 'react-router-dom';



const Nav = () => (

    <nav>

        <ul className="nav nav-tabs">

            <li className="nav-item pr-3 pt-3 pb-3">

                <Link to="/">Home</Link>

            </li>

            <li className="nav-item pr-3 pt-3 pb-3">

                <Link to="/create">Create</Link>

            </li>

        </ul>

    </nav>

);



export default Nav;





App.js

import React from 'react';

import Nav from './Nav';



const App = () => (

    <div className="container pb-5">

        <Nav />

        <br />

        <h1>MERN CRUD</h1>

    </div>

);



export default App;



routes/post.js

const { create, list } = require('../controllers/post');

router.get('/posts', list);



controllers/post.js

exports.list = (req, res) => {

    Post.find({})

        .limit(10)

        .sort({ createdAt: -1 })

        .exec((err, posts) => {

            if (err) console.log(err);

            res.json(posts);

        });

};



App.js

import React, { useState, useEffect } from 'react';

import Nav from './Nav';

import axios from 'axios';



const App = () => {

    const [posts, setPosts] = useState([]);



    const fetchPosts = () => {

        axios

            .get(`${process.env.REACT_APP_API}/posts`)

            .then(response => {

                // console.log(response);

                setPosts(response.data);

            })

            .catch(error => alert('Error fetching posts'));

    };



    useEffect(() => {

        fetchPosts();

    }, []);



    return (

        <div className="container pb-5">

            <Nav />

            <br />

            <h1>MERN CRUD</h1>

            <hr />

            {posts.map((post, i) => (

                <div className="row" key={post._id} style={{ borderBottom: '1px solid silver' }}>

                    <div className="col pt-3 pb-2">

                        <h2>{post.title}</h2>

                        <p className="lead">{post.content.substring(0, 100)}</p>

                        <p>

                            Author <span className="badge">{post.user}</span> Published on{' '}

                            <span className="badge">{new Date(post.createdAt).toLocaleString()}</span>

                        </p>

                    </div>

                </div>

            ))}

        </div>

    );

};



export default App;



App.js

<Link to={`/post/${post.slug}`}>

<h2>{post.title}</h2>

         </Link>



routes/post.js

router.get('/post/:slug', read);



controllers/post.js

exports.read = (req, res) => {

    // console.log(req.pramas.slug)

    const { slug } = req.params;

    Post.findOne({ slug }).exec((err, post) => {

        if (err) console.log(err);

        res.json(post);

    });

};



singlepost.js

import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import axios from 'axios';

import Nav from './Nav';



// const SinglePost = props => {

//     return <div>{JSON.stringify(props)}

//             </div>

// };

const SinglePost = () => {



    const [post, setPost] = useState('');

    let { slug } = useParams();

    console.log(slug);



    useEffect(() => {

        axios

            .get(`${process.env.REACT_APP_API}/post/${slug}`)

            .then(response => setPost(response.data))

            // .then(response => console.log(response))

            .catch(error => alert('Error loading single post'));

    }, []);



    return (



        <div className="container pb-5">

            <Nav />

            <br />

            <h1>{post.title}</h1>

            <p className="lead">{post.content}</p>

            <p>

                Author <span className="badge">{post.user}</span> Published on{' '}

                <span className="badge">{new Date(post.createdAt).toLocaleString()}</span>

            </p>

        </div>

    );

};



export default SinglePost;







Routes.js

import Create from './Create';

<Route path="/post/:slug" exact="true" element={<SinglePost />} />



App.js

{posts.map((post, i) => (

                <div className="row" key={post._id} style={{ borderBottom: '1px solid silver' }}>

                    <div className="col pt-3 pb-2">

                        <div className="row">

                            <div className="col-md-10">

                                <Link to={`/post/${post.slug}`}>

                                    <h2>{post.title}</h2>

                                </Link>

                                <p className="lead">{post.content.substring(0, 100)}</p>

                                <p>

                                    Author <span className="badge">{post.user}</span> Published on{' '}

                                    <span className="badge">{new Date(post.createdAt).toLocaleString()}</span>

                                </p>

                            </div>



                            <div className="col-md-2">

                                <Link to={`/post/update/${post.slug}`} className="btn btn-sm btn-outline-warning">

                                    Update

                                </Link>

                                <button className="btn btn-sm btn-outline-danger ml-1">Delete</button>

                            </div>

                        </div>

                    </div>

                </div>

            ))}





controllers/post.js

exports.update = (req, res) => {

    const { slug } = req.params;

    const { title, content, user } = req.body;

    Post.findOneAndUpdate({ slug }, { title, content, user }, { new: true }).exec((err, post) => {

        if (err) console.log(err);

        res.json(post);

    });

};



exports.remove = (req, res) => {

    // console.log(req.pramas.slug)

    const { slug } = req.params;

    Post.findOneAndRemove({ slug }).exec((err, post) => {

        if (err) console.log(err);

        res.json({

            message: 'Post deleted'

        });

    });

};



routes

router.put('/post/:slug', update);

router.delete('/post/:slug', remove);



src/Update.js

import React, { useState, useEffect } from 'react';

import axios from 'axios';

import Nav from './Nav';



const UpdatePost = props => {

    const [state, setState] = useState({

        title: '',

        content: '',

        slug: '',

        user: ''

    });

    const { title, content, slug, user } = state;



    useEffect(() => {

        axios

            .get(`${process.env.REACT_APP_API}/post/${props.match.params.slug}`)

            .then(response => {

                const { title, content, slug, user } = response.data;

                setState({ ...state, title, content, slug, user });

            })

            .catch(error => alert('Error loading single post'));

    }, []);



    // onchange event handler

    const handleChange = name => event => {

        // console.log('name', name, 'event', event.target.value);

        setState({ ...state, [name]: event.target.value });

    };



    const handleSubmit = event => {

        event.preventDefault();

        // console.table({ title, content, user });

        axios

            .put(`${process.env.REACT_APP_API}/post/${slug}`, { title, content, user })

            .then(response => {

                console.log(response);

                const { title, content, slug, user } = response.data;

                // empty state

                setState({ ...state, title, content, slug, user });

                // show sucess alert

                alert(`Post titled ${title} is updated`);

            })

            .catch(error => {

                console.log(error.response);

                alert(error.response.data.error);

            });

    };



    const showUpdateForm = () => (

        <form onSubmit={handleSubmit}>

            <div className="form-group">

                <label className="text-muted">Title</label>

                <input

                    onChange={handleChange('title')}

                    value={title}

                    type="text"

                    className="form-control"

                    placeholder="Post title"

                    required

                />

            </div>

            <div className="form-group">

                <label className="text-muted">Content</label>

                <textarea

                    onChange={handleChange('content')}

                    value={content}

                    type="text"

                    className="form-control"

                    placeholder="Write something.."

                    required

                />

            </div>

            <div className="form-group">

                <label className="text-muted">User</label>

                <input

                    onChange={handleChange('user')}

                    value={user}

                    type="text"

                    className="form-control"

                    placeholder="Your name"

                    required

                />

            </div>

            <div>

                <button className="btn btn-primary">Update</button>

            </div>

        </form>

    );



    return (

        <div className="container pb-5">

            <Nav />

            <br />

            <h1>UPDATE POST</h1>

            {showUpdateForm()}

        </div>

    );

};



export default UpdatePost;





route.js

import UpdatePost from './UpdatePost';



import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';

import Nav from './Nav';



const UpdatePost = props => {

    const [state, setState] = useState({

        title: '',

        content: '',

        slug: '',

        user: ''

    });

    const { title, content, user } = state;

    let { slug }  = useParams();

    let navigate = useNavigate();



    useEffect(() => {

        axios

            .get(`${process.env.REACT_APP_API}/post/${slug}`)

            .then(response => {

                const { title, content, slug, user } = response.data;

                setState({ ...state, title, content, slug, user });

            })

            .catch(error => alert('Error loading single post'));

    }, []);



    // onchange event handler

    const handleChange = name => event => {

        // console.log('name', name, 'event', event.target.value);

        setState({ ...state, [name]: event.target.value });

    };



    const handleSubmit = event => {

        event.preventDefault();

        // console.table({ title, content, user });

        axios

            .put(`${process.env.REACT_APP_API}/post/${slug}`, { title, content, user })

            .then(response => {

                console.log(response);

                const { title, content, slug, user } = response.data;

                // empty state

                setState({ ...state, title, content, slug, user });

                // show sucess alert

                alert(`Post titled ${title} is updated`);

                return navigate("/"); 

            })

            .catch(error => {

                console.log(error.response);

                alert(error.response.data.error);

            });

    };



    const showUpdateForm = () => (

        <form onSubmit={handleSubmit}>

            <div className="form-group">

                <label className="text-muted">Title</label>

                <input

                    onChange={handleChange('title')}

                    value={title}

                    type="text"

                    className="form-control"

                    placeholder="Post title"

                    required

                />

            </div>

            <div className="form-group">

                <label className="text-muted">Content</label>

                <textarea

                    onChange={handleChange('content')}

                    value={content}

                    type="text"

                    className="form-control"

                    placeholder="Write something.."

                    required

                />

            </div>

            <div className="form-group">

                <label className="text-muted">User</label>

                <input

                    onChange={handleChange('user')}

                    value={user}

                    type="text"

                    className="form-control"

                    placeholder="Your name"

                    required

                />

            </div>

            <div>

                <button className="btn btn-primary">Update</button>

            </div>

        </form>

    );



    return (

        <div className="container pb-5">

            <Nav />

            <br />

            <h1>UPDATE POST</h1>

            {showUpdateForm()}

        </div>

    );

};



export default UpdatePost;





App.js

const deleteConfirm = slug => {

        let answer = window.confirm('Are you sure you want to delete this post?');

        if (answer) {

            deletePost(slug);

        }

    };



    const deletePost = slug => {

        // console.log('delete', slug, ' post');

        axios

            .delete(`${process.env.REACT_APP_API}/post/${slug}`)

            .then(response => {

                alert(response.data.message);

                fetchPosts();

            })

            .catch(error => alert('Error deleting post'));

    };





Nav.js

<li className="nav-item ml-auto pr-3 pt-3 pb-3">

                <Link to="/login">Login</Link>

            </li>



routes.js

<Route path="/login" exact="true" element={<Login />} />



Login.js

import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Link } from 'react-router-dom';

import Nav from './Nav';



const Login = () => {

    // create a state

    const [state, setState] = useState({

        name: '',

        password: ''

    });

    const { name, password } = state; // destructure values from state



    // onchange event handler

    const handleChange = name => event => {

        // console.log('name', name, 'event', event.target.value);

        setState({ ...state, [name]: event.target.value });

    };



    const handleSubmit = event => {

        event.preventDefault();

        console.table({ name, password });

        // axios

        //     .post(`${process.env.REACT_APP_API}/post`, { title, content, user })

        //     .then(response => {

        //         console.log(response);

        //         // empty state

        //         setState({ ...state, title: '', content: '', user: '' });

        //         // show sucess alert

        //         alert(`Post titled ${response.data.title} is created`);

        //     })

        //     .catch(error => {

        //         console.log(error.response);

        //         alert(error.response.data.error);

        //     });

    };



    return (

        <div className="container pb-5">

            <Nav />

            <br />

            <h1>LOGIN</h1>

            <br />

            <form onSubmit={handleSubmit}>

                <div className="form-group">

                    <label className="text-muted">Name</label>

                    <input

                        onChange={handleChange('name')}

                        value={name}

                        type="text"

                        className="form-control"

                        placeholder="Your Name"

                        required

                    />

                </div>

                <div className="form-group">

                    <label className="text-muted">Password</label>

                    <input

                        onChange={handleChange('password')}

                        value={password}

                        type="password"

                        className="form-control"

                        placeholder="Your Password"

                        required

                    />

                </div>

                <div>

                    <button className="btn btn-primary">Create</button>

                </div>

            </form>

        </div>

    );

};



export default Login;



routes/auth.js

const express = require('express');



const router = express.Router();



// import controller methods

const { login } = require('../controllers/auth');



router.post('/login', login);



module.exports = router;



server.js

app.use('/api', authRoutes);



controller/auth.js

const jwt = require('jsonwebtoken');

const expressJwt = require('express-jwt');



exports.login = (req, res) => {

    const { name, password } = req.body;

    if (password === process.env.PASSWORD) {

        // generate token and send to client/react

        const token = jwt.sign({ name }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.json({ token, name });

    } else {

        return res.status(400).json({

            error: 'Incorrect password!'

        });

    }

};





helpers.js

// save login  reponse > (user's name and token) to session storage

export const authenticate = (response, next) => {

    if (window !== 'undefined') {

        // console.log('authenticate', response)

        sessionStorage.setItem('token', JSON.stringify(response.data.token));

        sessionStorage.setItem('user', JSON.stringify(response.data.name));

    }

    next();

};



// access token name from session storage

export const getToken = () => {

    if (window !== 'undefined') {

        if (sessionStorage.getItem('token')) {

            return JSON.parse(sessionStorage.getItem('token'));

        } else {

            return false;

        }

    }

};



// access user name from session storage

export const getUser = () => {

    if (window !== 'undefined') {

        if (sessionStorage.getItem('user')) {

            return JSON.parse(sessionStorage.getItem('user'));

        } else {

            return false;

        }

    }

};



// remove token from session storage

export const logout = next => {

    if (window !== 'undefined') {

        sessionStorage.removeItem('token');

        sessionStorage.removeItem('user');

    }

    next();

};





Login.js

authenticate(response, () => navigate("/create"));



Nav.js

import { getUser, logout } from './helpers';

 {!getUser() && (

                <li className="nav-item ml-auto pr-3 pt-3 pb-3">

                    <Link to="/login">Login</Link>

                </li>

            )}



 {getUser() && (

                <li

                    onClick={() => logout(() => navigate('/'))}

                    className="nav-item ml-auto pr-3 pt-3 pb-3"

                    style={{ cursor: 'pointer' }}

                >

                    Logout

                </li>

            )}



Login.js

useEffect(() => {

        getUser() && navigate('/');

    }, []);





PrivateRoute.js

import React, { Component } from 'react';

import React, { Component } from 'react';

import { Route, Navigate } from 'react-router-dom';

import { getUser } from './helpers';



const PrivateRoute = ({  children, redirectTo }) => {

    console.log(children.type.name)

       return getUser() ? children :  <Navigate to={redirectTo} />;

} ;



export default PrivateRoute;





export default PrivateRoute;



Routes.js

import PrivateRoute from './PrivateRoute';

 <Route path="/create" exact="true"

                    element={

                     <PrivateRoute redirectTo="/login">

                         <Create />

                      </PrivateRoute>

                    }

                  />



<Route path="/post/:slug" exact="true"

                    element={

                     <PrivateRoute redirectTo="/login">

                         <SinglePost />

                      </PrivateRoute>

                    }

                  />



<Route path="/post/update/:slug" exact="true"

                    element={

                     <PrivateRoute redirectTo="/login">

                         <UpdatePost />

                         }

                      </PrivateRoute>

                    }

                  />





app.js

import { getUser } from './helpers';



{getUser() && (

                                <div className="col-md-2">

                                    <Link to={`/post/update/${post.slug}`} className="btn btn-sm btn-outline-warning">

                                        Update

                                    </Link>

                                    <button

                                        onClick={() => deleteConfirm(post.slug)}

                                        className="btn btn-sm btn-outline-danger ml-1"

                                    >

                                        Delete

                                    </button>

                                </div>

                            )}



routes/post.js

const { requireSignin } = require('../controllers/auth');

router.get('/secret', requireSignin, (req, res) => {

    res.json({

        data: req.user.name

    });

});



controller/auth.js

exports.requireSignin = expressJwt({

    secret: process.env.JWT_SECRET

});



create.js

import { getUser, getToken } from './helpers';

 const [state, setState] = useState({

        title: '',

        content: '',

        user: getUser()

    });

const [content, setContent] = useState('');



 axios

            .post(`${process.env.REACT_APP_API}/post`, { title, content, user },{

                    headers: {

                        authorization: `Bearer ${getToken()}`

                    }

                })

            .then(response => {

                console.log(response);

                // empty state

                setState({ ...state, title: '', content: '', user: '' });

                setContent('');

                // show sucess alert

                alert(`Post titled ${response.data.title} is created`);

                return navigate("/");

            })



update.s

import { getToken } from './helpers';

{

                    headers: {

                        authorization: `Bearer ${getToken()}`

                    }

                }