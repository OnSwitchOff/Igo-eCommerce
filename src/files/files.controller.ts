import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthUser } from '../auth/types';
import { CompleteUploadDto } from './dto/complete-upload.dto';
import { PresignFileDto } from './dto/presign-file.dto';
import { FilesService } from './files.service';
import {JwtAuthGuard} from "../auth/jwt.guard";
import {Scopes} from "../auth/scopes.decorator";

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post('presign')
    @Scopes('files:write')
    async presign(
        @Req() req: Request & { user?: AuthUser },
        @Body() body: PresignFileDto
    ) {
        return this.filesService.createPresignedUpload(req.user as AuthUser, body);
    }

    @Post('complete')
    @Scopes('files:write')
    async complete(
        @Req() req: Request & { user?: AuthUser },
        @Body() body: CompleteUploadDto
    ) {
        return this.filesService.completeUpload(body.fileId, req.user as AuthUser);
    }

    @Get(':id')
    async byId(@Req() req: Request & { user?: AuthUser }, @Param('id') id: string) {
        return this.filesService.getFileById(id, req.user as AuthUser);
    }
}