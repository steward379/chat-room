const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrismaConnection() {
  try {
    // 測試數據庫連接
    await prisma.$connect();
    console.log('Successfully connected to the database via Prisma');

    // 獲取當前數據庫名稱
    const result = await prisma.$queryRaw`SELECT current_database()`;
    console.log('Current database:', result[0].current_database);

    // 獲取所有表名
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;

    console.log('Tables in the database:');
    for (let table of tables) {
      const tableName = table.table_name;

      // 獲取表的列信息
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, character_maximum_length, is_nullable
        FROM information_schema.columns
        WHERE table_name = ${tableName}
        ORDER BY ordinal_position
      `;

      const tableData = columns.map(column => ({
        Column: column.column_name,
        Type: column.character_maximum_length 
          ? `${column.data_type}(${column.character_maximum_length})` 
          : column.data_type,
        Nullable: column.is_nullable
      }));

      console.log(`\nTable: ${tableName}`);
      console.table(tableData);
    }

  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();