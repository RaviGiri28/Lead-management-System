import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("leads")
export class Lead {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  source!: string;

  @Column()
  campaignName!: string;

  @Column({
    default: "New",
  })
  status!: string;

  @Column({
    nullable: true,
  })
  assignedTo!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  remarks!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}