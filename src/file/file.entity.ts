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

  @Column()
  mimetype!: string;

  @Column()
  location!: string;

  @Column({
    type: "enum",
    enum: UPLOAD_TYPE,
    default: UPLOAD_TYPE.UPLOADING,
  })
  uploadingStatus!: UPLOAD_TYPE;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;
}
