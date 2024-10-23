import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import Aula from './Aula'

@Entity()
export default class Idioma extends BaseEntity {
	  @PrimaryGeneratedColumn()
	  id!: number

	  @Column()
	  nome!: string
  
	  @OneToMany(() => Aula, aula => aula.idioma)
	  aulas!: Aula[]
}