import "dotenv/config"
import app from "./app";
import connectDB from "./config/db";


const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();