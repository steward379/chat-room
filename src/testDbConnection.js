const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    
    const res = await client.query('SELECT current_database()');
    console.log('Current database:', res.rows[0].current_database);
    
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);

    console.log('Tables in the database:');

    for (let table of tablesRes.rows) {
        
        const tableName = table.table_name;

        const columnsRes = await client.query(`
          SELECT column_name, data_type, character_maximum_length, is_nullable
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position
        `, [tableName]);
             
        const tableData = columnsRes.rows.map(column => ({
          Column: column.column_name,
          Type: column.character_maximum_length 
            ? `${column.data_type}(${column.character_maximum_length})` 
            : column.data_type,
          Nullable: column.is_nullable
        }));

        // console.log(`\n${tableName}:`);

        // columnsRes.rows.forEach(column => {
        //   let columnInfo = `  - ${column.column_name} (${column.data_type}`;
        //   if (column.character_maximum_length) {
        //     columnInfo += `(${column.character_maximum_length})`;
        //   }
        //   columnInfo += `, ${column.is_nullable === 'YES' ? 'nullable' : 'not nullable'}`;
        //   columnInfo += ')';
        //   console.log(columnInfo);
        // });
  
        console.log(`\nTable: ${tableName}`);
        console.table(tableData);
      }
      
    // tablesRes.rows.forEach(row => {
    //   console.log('-', row.table_name);
    // });
    
    client.release();
  } catch (err) {
    console.error('Error connecting to the database', err);
  } finally {
    await pool.end();
  }
}

testConnection();