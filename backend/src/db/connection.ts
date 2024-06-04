import {connect as conn, disconnect} from 'mongoose';

async function connectToDatabase() {
    try {
        await conn(process.env.MONGODB_URL );
        console.log('Database connected');
    }
    catch (error) {
        console.log(error);
        throw new Error('Database connection failed');
    }
}

async function disconnectFromDatabase() {
    try {
        await disconnect();
        console.log('Database disconnected');
    }
    catch (error) {
        console.log(error);
        throw new Error('Database disconnection failed');
    }
}

export {connectToDatabase, disconnectFromDatabase};

