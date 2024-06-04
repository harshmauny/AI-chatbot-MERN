import app from './app.js';
import { connectToDatabase } from './db/connection.js';
const PORT = process.env.PORT || 5000;
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on http://localhost:5000');
    });
}).catch((error) => {
    console.log(error);
});
//# sourceMappingURL=index.js.map