import monk from 'monk';
const db = monk(process.env.DB_STR);
export default db;