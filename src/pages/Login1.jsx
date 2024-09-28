import React, { useContext, useState } from 'react';
import { Button, Form, Col, Container, Row } from 'react-bootstrap';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import eye icons
import './Login1.css';
import { Link, useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { Select, MenuItem } from '@mui/material'; // Import MenuItem
import { api } from '../Axios';
import AuthContext from "../AuthContext";

function Login1() {

    const navigate = useNavigate();
    const { setToken, setUsername } = useContext(AuthContext); // Get setUsername from context

    const [inputValue, setInputValue] = useState({
        UserName: "",
        Password: "",
        Branch: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("called");
        try {
            const { data } = await api.post(`/Accounting/login`, inputValue);
            // console.log(data.data?.token);
            // localStorage.setItem("_token_", data.data?.token);
            // setToken(data.data?.token);
            setUsername(inputValue.UserName); // Set the username in context
            navigate("/home");
        } catch (error) {
            console.log(error);
            alert("Incorrect Password or Username");
        }
    };

    return (
        <div className='login-header'>
            <Container className='login-header1'>
                <Row>
                    <Col>
                        <div className="main">
                            <div className="login-imgheader">
                                <img className='login-image' src="https://www.shutterstock.com/image-vector/man-key-near-computer-account-260nw-1499141258.jpg" alt="" />
                            </div>
                            <div className="login-form">
                                <h1>LOGIN</h1><br />
                                <Form.Label className='login-userlabel'>Username</Form.Label>
                                <FormControl>
                                    <TextField
                                        className='login-input'
                                        size="small"
                                        type="text"
                                        placeholder="Enter username"
                                        value={inputValue.UserName}
                                        onChange={(e) =>
                                            setInputValue({ ...inputValue, UserName: e.target.value })
                                        }
                                    />
                                </FormControl>
                                <Form.Label className='login-userlabel' htmlFor="inputPassword5">Password</Form.Label>
                                <FormControl>
                                    <TextField
                                        className='login-input'
                                        size="small"
                                        type="password"
                                        placeholder="Password"
                                        value={inputValue.Password}
                                        onChange={(e) =>
                                            setInputValue({ ...inputValue, Password: e.target.value })
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        {/* You can add an eye icon here */}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </FormControl>
                                <FormControl sx={{ m: 0, ml: 0, width: 350 }}>
                                    <Form.Label className='login-branchlabel' htmlFor="inputBranch" >Branches</Form.Label>
                                    <Select
                                    placeholder="Select Branch"
                                        fullWidth
                                        size="small"
                                        value={inputValue.Branch}
                                        onChange={(e) =>
                                            setInputValue({ ...inputValue, Branch: e.target.value })
                                        }
                                    >
                                        <MenuItem  value={0}>BRANCH 0</MenuItem>
                                        <MenuItem value={1}>All</MenuItem>
                                        {/* Add more MenuItem options here */}
                                    </Select>
                                </FormControl>
                                <button className='login-button' onClick={handleSubmit} type="submit">
                                    Login
                                </button>
                                <hr />
                                <div>
                                    <a href='https://www.google.co.in/' className='login-social'>
                                        <img src="https://logowik.com/content/uploads/images/985_google_g_icon.jpg" alt="" height={35} width={30} />
                                    </a>
                                    <a href='https://www.facebook.com/' className='login-social'>
                                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTImj5adg1sNvD0iCEQcjIGr-CZGuiX1or61w&usqp=CAU" alt="" height={35} width={35} />
                                    </a>
                                    <a href='https://twitter.com/?lang=en' className='login-social'>
                                        <img src="https://cdn.iconscout.com/icon/free/png-256/free-twitter-241-721979.png?f=webp" alt="" height={30} width={30} />
                                    </a>
                                </div><br />
                                <Link><h6 className='fonts'>Don't have an account yet? Sign up here</h6></Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login1;
