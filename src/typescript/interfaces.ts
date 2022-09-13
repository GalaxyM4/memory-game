export interface game_stats {
    table: string,
    f_ids: {[key: number]: string},
    perdida: boolean,
    dif: number,
    ask: string | null,
    rptas: string[],
    score: number,
    level: number
}

export interface level_update_options {
	tiempo: number, 
	largo: number, 
	ancho: number
}