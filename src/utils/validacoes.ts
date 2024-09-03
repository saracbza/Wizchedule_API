//identificar dia da semana a partir de uma data
export function diaDaSemana(data: Date): string {
    data = new Date(data)
    const diasDaSemana = [
        "Domingo", "Segunda-feira", "Terça-feira",
        "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
    ]
    
    return diasDaSemana[data.getDay()]
}

//validar email institucional
export function emailInstitucional(email: string): boolean {
    const padraoFatec = /^[^\s@]+@fatec\.sp\.gov\.br$/i;
    return padraoFatec.test(email);
  }

//validar tipo de local
export enum TipoLocal {
    sala = "Sala",
    lab = "Laboratório",
    maker = "Espaço Maker",
    biblio = "Biblioteca"
}

//validar cursos
export enum opcoesCursos {
    ads = "Análise e Desenvolvimento de Sistemas",
    comex = "Comércio Exterior",
    dsm = "Desenvolvimento de Software Multiplataforma",
    gstS = "Gestão de Serviços",
    gstE = "Gestão Empresarial",
    log = "Logística Aeroportuária",
    vazio = ""
}
