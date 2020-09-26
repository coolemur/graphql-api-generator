const authorization = (req, res, next) => {
  const accessDenied = false
  if (accessDenied) res.end('No token!')
  next()
}


export default authorization