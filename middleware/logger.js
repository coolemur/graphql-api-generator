import chalk from 'chalk'

const logger = (req, res, next) => {
  console.log(chalk.yellow(`~> Received ${req.method} on ${req.url}`));
  next();
}

export default logger