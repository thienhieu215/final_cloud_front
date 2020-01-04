import axios from 'axios'

/////// REGISTER NEW USER
export const register = newUser => {
  return axios
    .post('http://localhost:8081/users/register', {
      acc_email: newUser.acc_email,
      acc_username: newUser.acc_username,
      acc_pass: newUser.acc_pass,
      acc_description: newUser.acc_description,
      acc_profile_pic: newUser.acc_profile_pic
    })
    .then(response => {
      console.log('Registered', response.data)
    })
}

/////// LOG IN 
export const login = user => {
  return axios
    .post('http://localhost:8081/users/login', {
      acc_email: user.acc_email,
      acc_pass: user.acc_pass
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
