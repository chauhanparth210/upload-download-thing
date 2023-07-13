import { Assembler, ClassTransformerAssembler } from "@nestjs-query/core";
import { FileDTO } from "./dto/file.dto";
import { FileEntity } from "./file.entity";
import { UPLOAD_TYPE } from "src/constants";
import { BASE_URL } from "src/config";

@Assembler(FileDTO, FileEntity)
export class FileAssembler extends ClassTransformerAssembler<
  FileDTO,
  FileEntity
> {
  convertToDTO(entity: FileEntity): FileDTO {
    const dto = new FileDTO();
    dto.id = entity.id;
    dto.created = entity.created;
    dto.filename = entity.filename;
    dto.filenameOnBucket = entity.filenameOnBucket;
    dto.mimetype = entity.mimetype;
    dto.reasonOfFailure = entity.reasonOfFailure;
    dto.size = entity.size;
    dto.updated = entity.updated;
    dto.uploadingStatus = entity.uploadingStatus;

    dto.downloadLink =
      entity.uploadingStatus === UPLOAD_TYPE.COMPLETED
        ? `${BASE_URL}/download/${entity.id}`
        : null;

    return dto;
  }
}
