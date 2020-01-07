import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import './../css/style.css'
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from 'react-redux'
import { login, fb_login } from '../action/UserFunctions'
import axios from "axios";
import jwtDecode from "jwt-decode";

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const styles = {
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
}

class SignIn extends Component {
  constructor() {
    super()
    this.state = {
      acc_email: '',
      acc_pass: '',

      emailErr: false,
      passErr: false,
      loginErr: false
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleFBClick = this.handleFBClick.bind(this);
    this.handleGmailClick = this.handleGmailClick.bind(this);


  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    const user = {
      acc_email: this.state.acc_email,
      acc_pass: this.state.acc_pass
    }
    if (this.state.acc_email === "" || validEmailRegex.test(this.state.acc_email) === false ) {
      this.setState({
          emailErr: true,
          passErr: false,
      })
    } else if (this.state.acc_pass === "") {
        console.log("check desc")
        this.setState({
          emailErr: false,
          passErr: true,
        })
    } else {
      this.setState({
        emailErr: false,
        passErr: false,
      })
      login(user).then(res => {
        if (res) {
          window.location.href='/#/event-list'
          window.location.reload()
          // this.props.history.push(`/event-list`)
        } else {
          this.setState({loginErr: true})
        }
      })
    }  
  }

  handleEmailChange(e) {
    this.setState({
      acc_email: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      acc_pass: e.target.value
    });
  }

  handleFBClick() {
    localStorage.setItem('socialtype', "facebook")
  }

  handleGmailClick() {
    localStorage.setItem('socialtype', "gmail")
  }


  componentDidMount() {
    axios({
      method: 'GET',
      url: `http://localhost:3000/sociallogin/logout`,
      data: null
    })
        .catch(err => {
          console.log(err)
        })
  }

  render(){
    const classes = this.props;
    localStorage.clear()
    return (
      <Container component="main" maxWidth="xs" className=" Min-height">
        <br /><br /><br /><br /><br />
        <CssBaseline />
        <div
          className={classes.paper}
        >
          <Typography className="signIn" component="h1" variant="h5">
            Sign In
        </Typography>
          <form
            onSubmit={this.onSubmit}
            className={classes.form}
            noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={this.state.acc_email}
              onChange={this.handleEmailChange}
            />
            {this.state.emailErr && 
              <span className='error'>Please enter a valid email!</span>}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={this.state.acc_pass}
              onChange={this.handlePasswordChange}
            />
            {this.state.passErr && 
              <span className='error'>Please enter your password!</span>}
            {this.state.loginErr && 
              <span className='error'>Wrong username or password!</span>}

            <br />
            <br />
            <br />
            <button className="btn noHoverButton btn-block" type="submit" role="button" on>SIGN IN</button>
            <br />
            <Grid container>
              <Grid item>
                <Link href="#/sign-up" variant="body2">
                  Don't have an account yet?
              </Link>
              </Grid>
            </Grid>

          </form>
          <a href={"/sociallogin/auth/facebook"} onClick={this.handleFBClick.bind(this)} className="btn btn-primary"><span className="fa fa-facebook"></span>Facebook</a>
          <a href={"/sociallogin/auth/google"} onClick={this.handleGmailClick.bind(this)} className="btn btn-primary"><span className="fa fa-facebook"></span>Gmail</a>

        </div>
        <Box mt={8}>
        </Box>
      </Container>
    )
  }
  
}


const mapStateToProps = state => {
  return {

  }
};

const mapDispatchToProps = (dispatch) => {
  return {

  }
};

export default withStyles(styles)(SignIn);
connect(mapStateToProps, mapDispatchToProps); 
