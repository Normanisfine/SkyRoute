import db from './db';

/**
 * Utility function to safely execute database queries with proper connection management
 * @param {Function} queryFn - Function that takes a connection and performs queries
 * @returns {Promise<any>} - The result of the queryFn
 */
export async function executeQuery(queryFn) {
  const connection = await db.getConnection();
  
  try {
    return await queryFn(connection);
  } finally {
    // Always release the connection back to the pool
    connection.release();
  }
}

/**
 * Utility function to execute database transactions with proper connection management
 * @param {Function} transactionFn - Function that takes a connection and performs queries within a transaction
 * @returns {Promise<any>} - The result of the transactionFn
 */
export async function executeTransaction(transactionFn) {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await transactionFn(connection);
    await connection.commit();
    return result;
  } catch (error) {
    // Rollback transaction if an error occurs
    await connection.rollback();
    throw error;
  } finally {
    // Always release the connection back to the pool
    connection.release();
  }
}