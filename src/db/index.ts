import { Pool } from "pg";
import config from "../config/index.js";

export const pool = new Pool({
  connectionString: config.connecting_string,
});

export const initDB = async () => {
  //   console.log(config.connectionString);

  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(15) DEFAULT 'contributor',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
      id SERIAL PRIMARY KEY,
      title VARCHAR(150),
      description TEXT CHECK (char_length(description) >=20),
      type VARCHAR(20) CHECK (type IN ('bug', 'feature_request')),
      status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved' )),
      reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )  
        `);

    console.log("database connected sucessfully");
  } catch (error) {
    console.log(error);
  }
};
