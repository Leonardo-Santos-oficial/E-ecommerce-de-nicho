import type { IdentificationDTO, AddressDTO } from '@/types/schemas'
import type { Identification, Address } from '@/types/domain'
import { brandCPF, brandCEP, brandEmail } from '@/types/brands'

export function toDomainIdentification(dto: IdentificationDTO): Identification {
  return {
    nome: dto.nome,
    email: brandEmail(dto.email),
    cpf: brandCPF(dto.cpf),
  }
}

export function toDomainAddress(dto: AddressDTO): Address {
  return {
    cep: brandCEP(dto.cep),
    rua: dto.rua,
    numero: dto.numero,
    complemento: dto.complemento ?? '',
    bairro: dto.bairro,
    cidade: dto.cidade,
    estado: dto.estado,
  }
}
