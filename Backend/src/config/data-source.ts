import "reflect-metadata";
import { DataSource } from "typeorm";
import { Lead } from "../entity/Lead";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Lead, User]
});