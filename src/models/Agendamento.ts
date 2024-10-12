import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import Usuario from './Usuario'
import Aula from './Aula'

@Entity()
export default class Agendamento extends BaseEntity {
	  @PrimaryGeneratedColumn()
	  id!: number

	  @Column()
	  data!: Date
	  
	  @Column({default: "Sem observações"})
	  observacao!: string
  
	  @ManyToOne(() => Usuario, usuario => usuario.agendamentos)
	  usuario!: Usuario
   
	  @ManyToOne(() => Aula, aula => aula.agendamentos)
	  aula!: Aula
}