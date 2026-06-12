import "reflect-metadata";
import { DataSource } from "typeorm";
import { Lead } from "../entity/Lead";
import { User } from "../entity/User";
import { Notification } from "../entity/Notification";
import { DeviceToken } from "../entity/DeviceToken";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Lead, User, Notification, DeviceToken ]
});