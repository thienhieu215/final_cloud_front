import axios from 'axios'

/////// REGISTER NEW USER
export const register = newUser => {
  return axios
    .post('http://localhost:3000/users/register', {
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
    .post('http://localhost:3000/users/login', {
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

////// FB LOG IN
export const fb_login = user => {
    return axios
        .get('http://localhost:3000/sociallogin/auth/facebook', {
            // acc_email: user.acc_email,
            // acc_pass: user.acc_pass
        })
        .then(response => {
                    localStorage.setItem('usertoken', response.data)
                    console.log("TOi DAY ROI NE")
                        return response.data
                    })
        .catch(err => {
            console.log(err)
        })
}



