import { UPLOAD_TYPE } from "src/constants";
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";

@Entity({ name: "file" })
export class FileEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  filename!: string;

  @Column({
    unique: true,
  })
  filenameOnBucket!: string;

  @Column()
  mimetype!: string;

  @Column({
    type: "enum",
    enum: UPLOAD_TYPE,
    default: UPLOAD_TYPE.UPLOADING,
  })
  uploadingStatus!: UPLOAD_TYPE;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  reasonOfFailure: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}
