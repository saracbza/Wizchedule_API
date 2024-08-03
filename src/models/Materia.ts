import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Monitoria from './Monitoria'

@Entity()
export default class Materia extends BaseEntity {
	  @PrimaryGeneratedColumn()
	  id!: number

	  @Column()
	  nome!: string
  
	  @OneToMany(() => Monitoria, monitoria => monitoria.materia)
	  monitorias!: Monitoria[]
}