import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
    port: parseInt(process.env.PORT, 10) || 3100,
    python_api_url: process.env.PYTHON_API_URL,
}));
