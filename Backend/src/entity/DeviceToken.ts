import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class DeviceToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column({ unique: true })
  token!: string;

  @CreateDateColumn()
  createdAt!: Date;
}