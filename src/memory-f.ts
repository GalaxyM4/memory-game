import Events from "events";
//Funciones especiales SI MUEVES ALGO ERES GEI
function ids(largo: number, ancho: number, arr: any) {
	let ids:any = {}

	for(var i = 1; i < (largo*ancho) + 1; i++) {
		let nran_fruit = Math.floor(Math.random()*(arr.length))
		let ran_fruit = arr[nran_fruit]

		ids[i] = ran_fruit
	}
	return ids
}

//Esta funcion devuelve la tabla en string, pero creo que en este caso queda obsoleto.
function ftable(limit: number, obj: any) {
	let o = 1;

	let table = []
	let arr_f = []

	let anch_m = limit + 1;

	for(var [key, value] of Object.entries(obj)) {
		o++

		table.push(value)
		arr_f.push(value)

		if(o === anch_m) {
			table.push("\n")
			anch_m += limit
		}
	}

	let exp = {
		table: table,
		f_arr: arr_f
	}
	return exp
}

//Funcion que devolvera las respuestas en cada turno.
function rptas(arr: any[], ids: any) {
	let rptas = []
	let fru_ran_n = Math.floor(Math.random()*(arr.length))
	let pfru_ran = arr[fru_ran_n]

	let ask = pfru_ran
		
	for(const [key, value] of Object.entries(ids)) {
		if(value === pfru_ran) {
			rptas.push(key)
		}
	}

	let exp = {
		ask: ask,
		rptas: rptas
	}

	return exp
}

//Inicio de la clase osea fin de las funciones especiales
export class Memory2 extends Events{
	stats: any;
	largo: number | undefined;
	ancho: number | undefined;
	ids: any;
	in_game: boolean;
	#frutas_f: string[];
	#frutas_n: string[];
	#frutas_d: string[];
	#f_dif: any;
	#p_dif: any;
	#tiempo: number;
	#arr_fru;
	#rptas_c: string[];
	constructor(dif?: number) {
		super()
		if(!dif) dif = 1;

		if(dif === 0) {
		    this.largo = 2
		    this.ancho = 2
		}else if(dif === 1 || dif === 2) {
			this.largo = 3
			this.ancho = 3
		}

		this.#tiempo = 5000;
        //Las posibles frutas que pueden salir en el juego.
		this.#frutas_f = ["🍎","🍋","🍒","🍇"]
		this.#frutas_n = ["🍎","🍋","🍒","🍇","🥥","🍌"]
		this.#frutas_d = ["🍎","🍋","🍒","🍇","🥥","🍌","🍓","🍄"]
		this.#arr_fru = []
		this.#rptas_c = []

		this.#p_dif = {
			0: this.#frutas_f,
		    1: this.#frutas_n,
		    2: this.#frutas_d 
		}

		this.#f_dif = this.#p_dif[dif]

		this.ids = ids(this.largo!, this.ancho!, this.#f_dif)
		let fta = ftable(this.ancho!, this.ids)
		let table = fta.table;
		this.#arr_fru = fta.f_arr;
		
		this.stats = {
			table: table.join(""),
			f_ids: this.ids,
			perdida: false,
			dif: dif,
			ask: null,
			rptas: this.#rptas_c,
			score: 0,
			level: 0
		}
		this.in_game = false;
	}

    //Actualiza la dificultar, solo se puede ejecutar antes del juego.
	update_dif(new_dif: number) {
		if(this.in_game) {
			throw Error("No puedes establecer la dificultad en juego");
		}

		if(new_dif === 0) {
		    this.largo = 2
		    this.ancho = 2
		}else if(new_dif === 1 || new_dif === 2) {
			this.largo = 3
			this.ancho = 3
		}
		
		this.#arr_fru = []
		this.#rptas_c = []

		this.#p_dif = {
			0: this.#frutas_f,
		    1: this.#frutas_n,
		    2: this.#frutas_d 
		}

		this.#f_dif = this.#p_dif[new_dif]

		this.ids = ids(this.largo!, this.ancho!, this.#f_dif)
		let fta = ftable(this.ancho!, this.ids)
		let table = fta.table;
		this.#arr_fru = fta.f_arr;
		
		this.stats = {
			table: table.join(""),
			f_ids: this.ids,
			perdida: false,
			dif: new_dif,
			ask: null,
			rptas: this.#rptas_c,
			score: 0,
			level: 0
		}
		this.in_game = false;
	}
    ///El nombre lo dice xd
	iniciar() {
		this.emit("inicio", this.stats)
		let rpfunc = rptas(this.#arr_fru, this.ids)

		this.stats.ask = rpfunc.ask
		this.#rptas_c = rpfunc.rptas
		this.stats.rptas = this.#rptas_c
		this.in_game = true

		setTimeout(async () => {
			this.emit("delete", this.stats)
			this.emit("ask", this.stats)
		}, this.#tiempo)
	}
    ///Funcion pues para jugar.
	jugar(num: number) {
		this.ids = ids(this.largo!, this.ancho!, this.#f_dif)
		let f = ftable(this.ancho!, this.ids)
		this.#arr_fru = f.f_arr

		if(this.#rptas_c.includes(num.toString())) {	
			this.stats.score += 5
			this.stats.level += 1
			this.stats.table = f.table.join("")
			let nfrp = rptas(this.#arr_fru, this.ids)
		    this.stats.ask = nfrp.ask
		    this.#rptas_c = nfrp.rptas
			this.stats.rptas = nfrp.rptas
			this.stats.f_ids = this.ids

			if(this.stats.level >= 2 && this.stats.dif === 0) {
				this.#tiempo = 3000
				this.largo = 3
				this.ancho = 3
			} 

			if(this.stats.level >= 10) {
				this.#tiempo = 1000
			}else if(this.stats.level >= 8) {
				this.#tiempo = 1500
			}else if(this.stats.level >= 6) {
				this.#tiempo = 2500
			}else if(this.stats.level >= 4) {
				this.#tiempo = 3500
			}else if(this.stats.level >= 2) {
				this.#tiempo = 4500
			}
			this.emit("jugada", this.stats)

			setTimeout(() => {
				this.emit("delete", this.stats)
			    this.emit("ask", this.stats)

			}, this.#tiempo)

		}else{
			this.emit("perdida", this.stats)
		}
	}
}