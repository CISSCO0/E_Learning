import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose'; 
import * as express from 'express'; 
import * as dotenv from 'dotenv';

async function bootstrap(): Promise<void> {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  });

  const mongoUri = process.env.MONGO_URI || 'your-default-mongo-uri';
  const port = process.env.PORT || 3000;

  try {
    await mongoose.connect(mongoUri, {} as mongoose.ConnectOptions); 
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return; 
  }


  app.use(express.json());



  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
