import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm'
import Agendamento from "./Agendamento"
import Aula from "./Aula"

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

	  @Column()
	  tipo!: string
  
	  @OneToMany(() => Aula, aula => aula.usuario)
	  aulas?: Aula[]
	  
	  @OneToMany(() => Agendamento, agendamento => agendamento.usuario)
	  agendamentos?: Agendamento[]
}