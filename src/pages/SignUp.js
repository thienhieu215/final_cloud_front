import React, { Component } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import './../css/style.css'
import withStyles from "@material-ui/core/styles/withStyles";
import { register } from '../action/UserFunctions'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Link } from 'react-router-dom';
import axios from 'axios';


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


class SignUp extends Component {
  constructor() {
    super()
    this.state = {
      acc_username: '',
      acc_email: '',
      acc_pass: '',
      acc_description: '',
      errors: {},

      notify: false,
      usernameErr: false,
      emailErr: false,
      passErr: false,
      descErr: false,
      imagePreviewUrl: [],
      files: []
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleDescChange = this.handleDescChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(e) {
    e.preventDefault()
    const newUser = {
      acc_email: this.state.acc_email,
      acc_pass: this.state.acc_pass,
      acc_username: this.state.acc_username,
      acc_description: this.state.acc_description,
      acc_profile_pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQnRM7I0HLiujP2nRnyulNuzAwFRVgWKo16YMsYUvFYKJLWA5lyA&s"
    }
    if (this.state.acc_username === "" || this.state.acc_username === "admin") {
      this.setState({
        emailErr: false,
        passErr: false,
        usernameErr: true
      })

    } else if (this.state.acc_email === "" || this.state.acc_email.includes("admin") || validEmailRegex.test(this.state.acc_email) === false) {
      this.setState({
        emailErr: true,
        passErr: false,
        usernameErr: false
      })
    } else if (this.state.acc_pass === "") {
      this.setState({
        emailErr: false,
        passErr: true,
        usernameErr: false
      })
    } else if (this.state.acc_description === "") {
      this.setState({
        emailErr: false,
        passErr: false,
        usernameErr: false,
        descErr: true
      })
    } else {
      this.setState({
        emailErr: false,
        passErr: false,
        usernameErr: false,
        descErr: false
      })
      register(newUser).then(res => {
        // this.props.history.push(`/`)
      })

      this.setState({ notify: true })
    }
  }



  handleUsernameChange(e) {
    this.setState({
      acc_username: e.target.value
    });
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

  handleDescChange(e) {
    this.setState({
      acc_description: e.target.value
    });
  }

  fileSelectedHandler = (e) => {
    let reader = new FileReader();
    this.setState({
      files: [...e.target.files],
    })
    reader.readAsDataURL(e.target.files[0])
    this.state.imagePreviewUrl.pop()
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: [reader.result]
      })
    }
  }

  removePreview(e) {
    let recent = this.state.files
    let recent2 = this.state.imagePreviewUrl
    recent.splice(e, 1)
    recent2.splice(e, 1)
    this.setState({
      files: recent,
      imagePreviewUrl: recent2
    })
  }

  fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('image', )
    axios.post(`localhost:8081/photo/basic//0303019/upload`);
  }

  render() {
    console.log(this.state)
    const classes = this.props;
    return (
      <Container component="main" maxWidth="xs" className="Min-height">
        <br /><br /><br /><br /><br />
        <Modal isOpen={this.state.notify}>
          <ModalBody><h5 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>You've successfully created your account!</h5></ModalBody>
          <ModalBody><h5 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>You will be redirected to Sign In page.</h5></ModalBody>
          <ModalBody>
            <Link to={`/sign-in`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button className="btn btn-success btn-sm">
                Confirm
              </button>
            </Link>
          </ModalBody>
        </Modal>
        <CssBaseline />
        <div className={classes.paper}>
          <Typography className="signIn" component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={this.onSubmit} noValidate>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              margin="normal"
              fullWidth
              id="username"
              label="Organization Name"
              autoFocus
              value={this.state.acc_username}
              onChange={this.handleUsernameChange}
            />
            {this.state.usernameErr &&
              <span className='error'>Please enter your organization name!</span>}
            <TextField
              variant="outlined"
              required
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={this.state.acc_email}
              onChange={this.handleEmailChange}
            />
            {this.state.emailErr &&
              <span className='error'>Please enter a valid email!</span>}
            <TextField
              variant="outlined"
              required
              margin="normal"
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
            <TextField
              variant="outlined"
              required
              margin="normal"
              fullWidth
              name="description"
              label="Description"
              type="description"
              id="description"
              multiline={true}
              rows={4}
              rowsMax={10}
              value={this.state.acc_description}
              onChange={this.handleDescChange}
            />
            {this.state.descErr &&
              <span className='error'>Please enter the description of your organizer!</span>}
            <br /><br />
            {/* <div>
              <Typography className="signIn" component="h1" variant="h5">
                Profile picture
              </Typography>
              <br />
              <input type="file" onChange={this.fileSelectedHandler} />
            </div>
            <div className="imgPreview">
              {this.state.imagePreviewUrl.map((url, index) =>
                <div style={{ display: "inline-block" }}>
                  <div class="modal-dialog" >
                    <div class="modal-content">
                      <div class="modal-header">
                        <img style={{ backgroundSize: "cover", width: "100px", height: "100px" }} class="img-responsive" src={url} />
                        <button type="button" class="close"
                          onClick={() => { this.removePreview(index) }}
                          style={{ fontSize: "20px" }}>&times;</button>
                      </div>
                    </div>
                  </div>
                  &nbsp;
                </div>
              )}
            </div> */}

            <br />
            <button className="btn noHoverButton  btn-block" type="submit" on>Sign Up</button>
            <br />
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/sign-in" variant="body2">
                  Already have an account? Sign In !
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
        </Box>
      </Container>
    );

  }

}
export default withStyles(styles)(SignUp); 