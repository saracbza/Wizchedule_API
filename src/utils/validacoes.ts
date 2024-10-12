//identificar dia da semana a partir de uma data
export function diaDaSemana(data: Date): string {
    const diasDaSemana = [
        "Segunda-feira", "Terça-feira", "Quarta-feira", 
        "Quinta-feira", "Sexta-feira", "Sábado", "Domingo", 
    ]
    return diasDaSemana[data.getDay()]
}