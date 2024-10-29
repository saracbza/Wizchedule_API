import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import Agendamento from './Agendamento'
import Usuario from './Usuario'
import Sala from './Sala'
import Idioma from './Idioma'
//
@Entity()
export default class Aula extends BaseEntity {
	  @PrimaryGeneratedColumn()
	  id!: number

	  @Column()
	  dia_semana!: string

	  @Column()
	  tipo!: string
  
	  @Column({ length: 5 })
	  horario_inicio!: string //HH:MM

	  @Column({ length: 5 })
	  horario_fim!: string //HH:MM
  
	  @OneToMany(() => Agendamento, agendamento => agendamento.aula)
	  agendamentos!: Agendamento[]
  
	  @ManyToOne(() => Usuario, usuario => usuario.aulas)
	  usuario!: Usuario
  
	  @ManyToOne(() => Idioma, idioma => idioma.aulas)
	  idioma!: Idioma

	  @ManyToOne(() => Sala, sala => sala.aulas)
	  sala!: Sala
}