import mongoose from "mongoose";
import dotenv from "dotenv"
import chalk from "chalk";

dotenv.config();

async function initialize() {
    const options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        serverSelectionTimeoutMS: 300000,
        socketTimeoutMS: 300000
    };

    try {
        await mongoose.connect(process.env.DB_URI, options);
        console.log(chalk.white.bgYellow("Connected to MongoDB..."));
    } catch (error) {
        console.log(chalk.red(`Could not connect to MongoDB... ${error.message}`));
    }
}

export default initialize;