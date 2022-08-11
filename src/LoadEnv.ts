import dotenv from 'dotenv';

// Set the env file
const result = dotenv.config({
	path: './env/.env',
});

if (result.error) {
	throw result.error;
}
