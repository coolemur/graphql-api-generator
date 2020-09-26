import dotenv from 'dotenv'
import monk from 'monk';

dotenv.config()
const db = monk(process.env.DB_STR);

export default db;