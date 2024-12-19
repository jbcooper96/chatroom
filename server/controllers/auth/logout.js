const Account = require('../../models/Account')

async function logout(request, response, next) {
  try {
    response.clearCookie('token');
    response.status(200).json({
      message: 'Logged out'
    })
  } catch (error) {
    console.error(error)
    response.status(500).send()
  }
}

module.exports = logout
