import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose'; // Correct Mongoose import for TypeScript
import * as express from 'express'; // Express import for JSON parsing

async function bootstrap(): Promise<void> {
  // Create the NestJS app
  const app = await NestFactory.create(AppModule);

  // MongoDB connection string
  const mongoUri = 'mongodb+srv://clown:SE123@cluster1.llyk9cg.mongodb.net/E_Learning';

  // Connect to MongoDB
  try {
    await mongoose.connect(mongoUri, {} as mongoose.ConnectOptions); // Explicitly cast to ConnectOptions
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return; // Exit the bootstrap function if there's a connection error
  }

  // Add middleware for JSON parsing
  app.use(express.json());

  // Start the server
  const port = 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
