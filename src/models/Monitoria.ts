import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import Agendamento from './Agendamento'
import Materia from './Materia'
import Usuario from './Usuario'

@Entity()
export default class Monitoria extends BaseEntity {
	  @PrimaryGeneratedColumn()
	  id!: number

	  @Column()
	  dia_semana!: string
  
	  @Column({ length: 5 })
	  horario_inicio!: string //HH:MM

	  @Column({ length: 5 })
	  horario_fim!: string //HH:MM
  
	  @Column()
	  local!: string
  
	  @OneToMany(() => Agendamento, agendamento => agendamento.monitoria)
	  agendamentos!: Agendamento[]
  
	  @ManyToOne(() => Usuario, usuario => usuario.monitorias)
	  usuario!: Usuario
  
	  @ManyToOne(() => Materia, materia => materia.monitorias)
	  materia!: Materia
}