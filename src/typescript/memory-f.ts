import Events from "events";
import levels from "../levels.json";
import {game_stats, level_update_options} from "./interfaces";
//Funciones especiales SI MUEVES ALGO ERES GEI
function ids(largo: number, ancho: number, arr: string[]) {
	let ids:{[key: number]: string} = {};

	for(var i = 1; i < (largo*ancho) + 1; i++) {
		let nran_fruit = Math.floor(Math.random()*(arr.length));
		let ran_fruit = arr[nran_fruit];

		ids[i] = ran_fruit;
	}
	return ids;
}

//Esta funcion devuelve la tabla en string, pero creo que en este caso queda obsoleto.
function ftable(limit: number, obj: {[key: string]: string}) {
	let o = 1;

	let table: string[] = [];
	let arr_f: string[] = [];

	let anch_m = limit + 1;

	for(var key in obj) {
		var value = obj[key];
		o++;

		table.push(value);
		arr_f.push(value);

		if(o === anch_m) {
			table.push("\n");
			anch_m += limit;
		}
	}

	let obj_ret = {
		table: table,
		f_arr: arr_f
	}
	return obj_ret;
}

//Funcion que devolvera las respuestas en cada turno.
function rptas(arr: string[], ids: {[key: number]: string}) {
	let rptas = [];
	let fruit_random_num = Math.floor(Math.random()*(arr.length));
	let ask = arr[fruit_random_num];
		
	for(const [key, value] of Object.entries(ids)) {
		if(value === ask) {
			rptas.push(key)
		}
	}

	let obj_ret = {
		ask: ask,
		rptas: rptas
	};

	return obj_ret;
}


//Inicio de la clase osea fin de las funciones especiales
export class Memory2 extends Events{
	stats: game_stats;
	largo: number | undefined;
	ancho: number | undefined;
	ids: {[key: number]: string};
	game_status: "playing" | "end" | null;
	#dif: number;
	#frutas_f: string[];
	#frutas_n: string[];
	#frutas_d: string[];
	#f_dif: string[];
	#tiempo: number;
	#arr_fru: string[];
	#rptas_c: string[];
	#possible_levels: number[]
	#actual_obj_levels: {[key: number]: level_update_options}
	constructor(dif?: number) {
		super()
		if(!dif) dif = 1;
		this.#dif = dif;
		if(dif === 0) {
		    this.largo = 2
		    this.ancho = 2
		}else if(dif === 1 || dif === 2) {
			this.largo = 3
			this.ancho = 3
		}

		this.#tiempo = 5000;
        //Las posibles frutas que pueden salir en el juego.
		this.#frutas_f = ["🍎","🍋","🍒","🍇"];
		this.#frutas_n = ["🍎","🍋","🍒","🍇","🥥","🍌"];
		this.#frutas_d = ["🍎","🍋","🍒","🍇","🥥","🍌","🍓","🍐"];
		this.#arr_fru = [];

		this.#rptas_c = [];

		var obj_dif: {[key: number]: string[]} = {
			0: this.#frutas_f,
		    1: this.#frutas_n,
		    2: this.#frutas_d 
		}

		this.#f_dif = obj_dif[dif];
		this.#possible_levels = [];
		this.ids = ids(this.largo!, this.ancho!, this.#f_dif);
		let fta = ftable(this.ancho!, this.ids);
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
		this.game_status = null;
		this.#actual_obj_levels = this.#load_levels();
	}
	//Parte funciones privadas.
    #load_levels(){
        ///ggez
		var obj_: {[key: number]:  "facil" | "normal" | "dificil"} = {
			0: "facil",
			1: "normal",
			2: "dificil"
		}
		this.#possible_levels = [];
		var actual_obj_levels = levels[obj_[this.#dif]];
		var new_obj_levels: {[key: number]: level_update_options} = {};
		for(var [key, obj_lvl] of Object.entries(actual_obj_levels)) {
			let parsed_key = parseInt(key);
			this.#possible_levels.push(parsed_key);
			new_obj_levels[parsed_key] = obj_lvl;
		}
		return new_obj_levels;
    }

	#level_change() {
		if(this.#possible_levels.includes(this.stats.level)) {
			var obj_level = this.#actual_obj_levels[this.stats.level];
			this.#tiempo = obj_level.tiempo;
			this.largo = obj_level.largo;
			this.ancho = obj_level.ancho;
		}
	}

	#updating_vars() {
		this.stats.score += 5;
		this.stats.level += 1;
		this.#level_change();
		this.ids = ids(this.largo!, this.ancho!, this.#f_dif);
		let f = ftable(this.ancho!, this.ids);
		this.#arr_fru = f.f_arr;
		this.stats.table = f.table.join("");
		let nfrp = rptas(this.#arr_fru, this.ids);
		this.stats.ask = nfrp.ask;
		this.#rptas_c = nfrp.rptas;
		this.stats.rptas = nfrp.rptas;
		this.stats.f_ids = this.ids;
	}

    ///El nombre lo dice xd
	iniciar() {
        this.stats.level += 1
		this.emit("inicio", this.stats);
		let rpfunc = rptas(this.#arr_fru, this.ids);

		this.stats.ask = rpfunc.ask;
		this.#rptas_c = rpfunc.rptas;
		this.stats.rptas = this.#rptas_c;
		this.game_status = "playing";

		setTimeout(async () => {
			this.emit("ask", this.stats)
		}, this.#tiempo);
	}

	//Actualiza la dificultar, solo se puede ejecutar antes del juego.
	update_dif(new_dif: number) {
		if(this.game_status === "playing") throw Error("No puedes establecer la dificultad en juego");
		
		if(new_dif === 0) {
		    this.largo = 2
		    this.ancho = 2
		}else if(new_dif === 1 || new_dif === 2) {
			this.largo = 3
			this.ancho = 3
		}
		
		this.#arr_fru = [];
		this.#rptas_c = [];

		var obj_dif: {[key: number]: string[]} = {
			0: this.#frutas_f,
		    1: this.#frutas_n,
		    2: this.#frutas_d 
		};

		this.#f_dif = obj_dif[new_dif];
		this.#dif = new_dif;
		this.ids = ids(this.largo!, this.ancho!, this.#f_dif);
		let fta = ftable(this.ancho!, this.ids);
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
		};
		this.#actual_obj_levels = this.#load_levels();
	}

	reset_game() {
		if(this.game_status === "playing") throw Error("El juego tiene que haber terminado para reiniciarlo.");
		this.#updating_vars();
		this.stats.score = 0;
		this.stats.level = 0;
		this.#tiempo = 5000;
		
		this.update_dif(this.stats.dif);
		this.iniciar();
		this.emit("inicio", this.stats);
	}

    ///Funcion pues para jugar.
	jugar(num: number) {
		if(this.#rptas_c.includes(num.toString())) {
			this.#updating_vars();
			this.emit("correcto", this.stats);
			setTimeout(() => {
				this.emit("ask", this.stats)
			}, this.#tiempo);
		}else{
			this.game_status = "end";
			this.emit("perdida", this.stats);
		}
	}
}
