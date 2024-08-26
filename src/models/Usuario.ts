import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm'
import Agendamento from "./Agendamento"
import Monitoria from "./Monitoria"

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
	  curso!: string
	  
	  @OneToMany(() => Monitoria, monitoria => monitoria.usuario)
	  monitorias?: Monitoria[]
	  
	  @OneToMany(() => Agendamento, agendamento => agendamento.usuario)
	  agendamentos?: Agendamento[]
}