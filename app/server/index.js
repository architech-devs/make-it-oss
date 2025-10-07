import dotenv from 'dotenv';
dotenv.config();

import app from "./src/app.js";
import { PORT } from "./src/config/env.js";

app.listen(PORT, () => {
    console.log(`🚀 Server running locally at http://localhost:${PORT}`);
});

export default app;
    