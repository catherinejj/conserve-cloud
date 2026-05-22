import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateConserveUseCase } from '../../application/use-cases/conserves/create-conserve.use-case';
import { DeleteConserveUseCase } from '../../application/use-cases/conserves/delete-conserve.use-case';
import { GetConserveByIdUseCase } from '../../application/use-cases/conserves/get-conserve-by-id.use-case';
import { GetConservesUseCase } from '../../application/use-cases/conserves/get-conserves.use-case';
import { UpdateConserveUseCase } from '../../application/use-cases/conserves/update-conserve.use-case';
import { JwtAuthGuard } from '../../infrastructure/security/jwt.guard';
import { CreateConserveDto } from '../dto/create-conserve.dto';
import { UpdateConserveDto } from '../dto/update-conserve.dto';

@ApiTags('Conserves')
@ApiBearerAuth()
@Controller('api/conserves')
@UseGuards(JwtAuthGuard)
export class ConservesController {
  constructor(
    private readonly getConservesUseCase: GetConservesUseCase,
    private readonly getConserveByIdUseCase: GetConserveByIdUseCase,
    private readonly createConserveUseCase: CreateConserveUseCase,
    private readonly updateConserveUseCase: UpdateConserveUseCase,
    private readonly deleteConserveUseCase: DeleteConserveUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: "Liste des conserves de l'utilisateur connecté" })
  @ApiResponse({ status: 200, description: 'Liste retournée' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  findAll(@Req() req: any) {
    return this.getConservesUseCase.execute(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une conserve" })
  @ApiResponse({ status: 200, description: 'Conserve retournée' })
  @ApiResponse({ status: 404, description: 'Introuvable' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.getConserveByIdUseCase.execute(id, req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle conserve' })
  @ApiResponse({ status: 201, description: 'Conserve créée' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  create(@Req() req: any, @Body() dto: CreateConserveDto) {
    return this.createConserveUseCase.execute(req.user.sub, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une conserve' })
  @ApiResponse({ status: 200, description: 'Conserve modifiée' })
  @ApiResponse({ status: 404, description: 'Introuvable' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateConserveDto) {
    return this.updateConserveUseCase.execute(id, req.user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une conserve' })
  @ApiResponse({ status: 200, description: 'Conserve supprimée' })
  @ApiResponse({ status: 404, description: 'Introuvable' })
  async delete(@Req() req: any, @Param('id') id: string) {
    await this.deleteConserveUseCase.execute(id, req.user.sub);
    return { deleted: true };
  }
}
