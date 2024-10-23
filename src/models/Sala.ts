import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import Aula from './Aula'
//
@Entity()
export default class Sala extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ default: "" })
    numero?: number

    @OneToMany(() => Aula, aula => aula.sala)
    aulas!: Aula[]
}