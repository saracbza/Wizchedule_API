import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import Usuario from "./Usuario"

@Entity()
export default class Token extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    token!: string

    @Column()
    refreshToken!: string

    @Column()
    expiredAt!: Date

    @Column()
    userId!: number

    @ManyToOne(() => Usuario, usuario => usuario.tokens)
    usuario !: Usuario
}