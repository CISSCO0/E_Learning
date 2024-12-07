import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose'; 
import * as express from 'express'; 
import * as dotenv from 'dotenv';
import * as multer from 'multer';
import { NestExpressApplication } from '@nestjs/platform-express'; // Correct import for Express Adapter
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  dotenv.config();
  
  // Create NestJS app with Express adapter
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Use cookie-parser to handle cookies
  app.use(cookieParser());

  // Enable CORS for frontend access
  app.enableCors({
    origin: process.env.CLIENT_URL || '*',   // Allow requests from the specified frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,   // Allow credentials (cookies, headers, etc.)
  });

  // MongoDB connection URI and port setup
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://clown:SE123@cluster1.llyk9cg.mongodb.net/E_Learning';
  const port = process.env.PORT || 3000;

  // Use multer for handling multipart/form-data (e.g., file uploads)
  app.use(multer().any());

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {} as mongoose.ConnectOptions);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return;  // Stop the application if connection fails
  }

  // Use Express middleware for JSON body parsing (optional since NestJS does this by default)
  app.use(express.json());

  // Start the application server
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
