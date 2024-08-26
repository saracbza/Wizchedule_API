import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm'
import Agendamento from "./Agendamento"
import Monitoria from "./Monitoria"
import Token from './Token'

@Entity()
@Unique(["email"])
export default class Usuario extends BaseEntity {
	  @PrimaryGeneratedColumn()
	  id!:number
	  
	  @Column()
	  email!: string

	  @Column()
	  nome!: string

	  @Column()
	  senha!: string
	  
	  @Column()
	  curso?: string

	  @Column()
	  tipo!: string
  
	  @OneToMany(() => Monitoria, monitoria => monitoria.usuario)
	  monitorias?: Monitoria[]
	  
	  @OneToMany(() => Agendamento, agendamento => agendamento.usuario)
	  agendamentos?: Agendamento[]
  
	  @OneToMany(() => Token, token => token.usuario)
	  tokens?: Token[]
}