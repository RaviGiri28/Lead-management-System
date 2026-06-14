import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: "new"})
  type: string;       // 'new_lead', 'followup', 'summary', 'converted'

  @Column()
  title: string;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  source: string;     // 'Meta', 'Google', null

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}