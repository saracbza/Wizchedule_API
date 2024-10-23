import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm'
import Agendamento from "./Agendamento"
import Monitoria from "./Monitoria"
import { opcoesCursos } from '../utils/validacoes'
import { IsEnum } from 'class-validator'

@Entity()
@Unique(["email"])
export default class Usuario extends BaseEntity {
	  @PrimaryGeneratedColumn()
	  id!:number

	  @Column({default: 1})
	  idFoto!: number
	  
	  @Column()
	  email!: string

	  @Column()
	  nome!: string

	  @Column()
	  senha!: string
	  
	  @Column({
        type: 'text',
        enum: opcoesCursos,
		nullable: true,
		default: ""
    })
	  @IsEnum(opcoesCursos, { message: 'Curso inválido' })
	  curso?: opcoesCursos

	  @Column()
	  tipo!: string
  
	  @OneToMany(() => Monitoria, monitoria => monitoria.usuario)
	  monitorias?: Monitoria[]
	  
	  @OneToMany(() => Agendamento, agendamento => agendamento.usuario)
	  agendamentos?: Agendamento[]
}