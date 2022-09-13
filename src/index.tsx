import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {game_stats} from "./typescript/interfaces";

//imports que yo cree
import {Memory2}from './typescript/memory-f';
import {get_board, get_obj_buttons} from "./utils/structures";
import { TypingEffect } from './utils/effects';
const root = ReactDOM.createRoot(
    document.getElementById('root')!
);
var game = new Memory2();
var largo: number, ancho: number;
///Funciones utiles 👍, solo una xd
function get_play_functions(max_id: number) {
    var obj_return: {[key: number]: () => void} = {};
    for(let i = 0; i<=max_id; i++) {
        obj_return[i] = function () {game.jugar(i)};
    }
    return obj_return;
}

//Main Game
interface state_main_game {
    board: JSX.Element | null;
    game_status: "playing" | "end" | "null";
    title: string;
    info: {
        score: number,
        level: number,
        ask?: string
    }
};
interface props_main_game {
    dif: number;
};
class MainGame extends React.Component<props_main_game, state_main_game> {
    constructor(props: props_main_game) {
        super(props);
        this.state = {
            board: null,
            game_status: "null",
            title: "Inicio",
            info: {
                score: 0,
                level: 0
            }
        };
    }
    ///Funciones privadas piolas y utiles
    #update_dimensions() {
        largo = game.largo!;
        ancho = game.ancho!;
    }

    ///Aca se viene funciones con los eventos del juego.
    async inicio(game_stats: game_stats) {
        this.#update_dimensions();
        this.setState(() => {
            return {
                game_status: "playing",
                title: "Primer nivel",
                board: get_board(largo,ancho,game_stats.f_ids),
                info: {
                    score: game_stats.score, 
                    level: game_stats.level
                }
            };
        });
    }

    async ask(game_stats: game_stats) {
        this.#update_dimensions();
        let play_functions = get_play_functions(largo*ancho);
        let obj_functions = get_obj_buttons(largo,ancho, play_functions)
        this.setState(() => {
            return {
                title: "Primer nivel",
                board: get_board(largo,ancho, obj_functions),
                info: {
                    score: game_stats.score,
                    level: game_stats.level, 
                    ask: `Donde esta ${game_stats.ask!}?`
                }
            };
        });
    }

    async correcto(game_stats: game_stats) {
        this.#update_dimensions();
        var correct_titles = ["BIEN", "CORRECTO", "K GRANDE", "PIOLA", "TA BIEN", "EXELENTE", "EPICO"];
        var title = correct_titles[Math.floor(Math.random()*(correct_titles.length))];
        this.setState(() => {
            return {
                title: title,
                board: get_board(largo,ancho, game_stats.f_ids),
                info: {
                    score: game_stats.score, 
                    level: game_stats.level
                }
            };
        });
    }

    async perdida(game_stats: game_stats) {
        this.#update_dimensions();
        var no_correct_titles = ["PERDISTE JAJA", "FIN DEL JUEGO", "PARTIDA TERMINADA", "PERDISTE NUV", "MAL, YA PERDISTE"];
        var title = no_correct_titles[Math.floor(Math.random()*(no_correct_titles.length))];
        var only_corrects: {[key: number]: string} = {};
        for(var i=1; i<=largo*ancho; i++) {
            if(game_stats.rptas.includes(i.toString())) {
                only_corrects[i] = game_stats.f_ids[i];
            }else {
                only_corrects[i] = "❌";
            }
        }
        this.setState(() => {
            return {
                title: title,
                board: get_board(largo,ancho, only_corrects),
                game_status: 'end',
                info: {
                    score: game_stats.score, 
                    level: game_stats.level,
                }
            };
        });
    }

    //Funcion tipica cuando se renderiza el juego
    componentDidMount() {
        game.update_dif(this.props.dif);
        game.on("inicio", async (stats: game_stats) => {await this.inicio(stats)});
        game.on("ask", async (stats: game_stats) => {await this.ask(stats)});
        game.on("correcto", async (stats: game_stats) => {await this.correcto(stats)});
        game.on("perdida", async (stats: game_stats) => {await this.perdida(stats)});
        game.iniciar();
    } 

    render(): React.ReactNode {
        return (
        <div id="main">
            <React.StrictMode>
                <h2 id="title">{this.state.title}</h2>
                <div id="info">
                    <ul>
                        <li key="game_score">Score: {this.state.info.score}</li>
                        <li key="game_level">Level: {this.state.info.level}</li>
                    </ul>
                </div>
                <div id="board">{this.state.board}</div>
                <div id="question">{this.state.info.ask}</div>
            </React.StrictMode>
        </div>
        )
    }
}


//// Funciones de dificultad.
function dif_0() {
    root.render(<MainGame dif={0}/>);
}
function dif_1() {
    root.render(<MainGame dif={1}/>);
}
function dif_2() {
    root.render(<MainGame dif={2}/>);
}


///Renderizando las dificultades
var random_titles = ["Que empieze el juego...", "Selecciona dificultad", "Bienvenido", "Esto va a ser epico", "Hola", "Escoje dificultad", "Juego 👍"];
var title = random_titles[Math.floor(Math.random()*(random_titles.length))];

root.render(
<div>
    <h2 id="title"><TypingEffect text={title} time_join_char={95}/></h2>
    <div id="buttons_dif">
        <button className="dif_button" onClick={dif_0}>Facil</button>
        <button className="dif_button" onClick={dif_1}>Medio</button>
        <button className="dif_button" onClick={dif_2}>Dificil</button>
    </div>
    <p id="build">(build 5)</p>
</div>);
reportWebVitals();