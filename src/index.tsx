import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
//imports que yo cree
import {game_stats, game_options} from "./typescript/interfaces";
import FruitCanvas from './utils/canvas';
import {Memory2}from './typescript/memory-f';
import {get_board, get_obj_buttons} from "./utils/structures";
import { TypingEffect } from './utils/effects';
const root = ReactDOM.createRoot(document.getElementById('root')!);
var largo: number, ancho: number;
//Main Game
interface state_main_game {
    board: JSX.Element | null;
    game_status: "playing" | "end" | "null";
    title: string;
    id_title?: "title" | "title_c";
    reset_button?: JSX.Element;
    back_menu_button?: JSX.Element;
    info: {
        score: number,
        level: number,
        ask?: any
    }
};
interface props_main_game {
    dif: number;
};
class MainGame extends React.Component<props_main_game, state_main_game> {
    #game: Memory2 | null;
    constructor(props: props_main_game) {
        super(props);
        this.#game = null;
        this.state = {
            board: null,
            game_status: "null",
            title: "Inicio",
            id_title: "title",
            info: {
                score: 0,
                level: 0
            }
        };
    }
    ///Funciones privadas piolas y utiles
    #update_dimensions() {
        largo = this.#game!.largo!;
        ancho = this.#game!.ancho!;
    }

    #get_play_functions(max_id: number) {
        var obj_return: {[key: number]: () => void} = {};
        var class_var = this;
        for(let i = 0; i<=max_id; i++) {
            obj_return[i] = function () {class_var.#game!.jugar(i)};
        }
        return obj_return;
    }

    #get_array_images() {
        var arr_ez = [];
        var arr_me = [];
        var arr_ha = [];
        for(var i = 1; i <= 8; i++) {
            if(i <= 4) {
                arr_ez.push(<FruitCanvas position={i}/>);
                arr_me.push(<FruitCanvas position={i}/>);
                arr_ha.push(<FruitCanvas position={i}/>);
            }else if(i > 4 && i <= 6) {
                arr_me.push(<FruitCanvas position={i}/>);
                arr_ha.push(<FruitCanvas position={i}/>);
            }else {
                arr_ha.push(<FruitCanvas position={i}/>);
            }
        }
        var obj_ret = {
            0: arr_ez,
            1: arr_me,
            2: arr_ha
        }; 
        return obj_ret;
    }

    ///Aca se viene funciones con los eventos del juego.
    async inicio(game_stats: game_stats) {
        this.#update_dimensions();
        this.setState(() => {
            return {
                game_status: "playing",
                title: "Espera...",
                board: <img src={`${process.env.PUBLIC_URL}/images/loading.gif`} alt="loading..."/>,
                reset_button: undefined,
                back_menu_button: undefined,
                info: {
                    score: game_stats.score, 
                    level: game_stats.level
                }
            };
        });

        setTimeout(() => {
            this.setState(() => {
                return {
                    title: "Primer nivel",
                    board: get_board(largo,ancho,game_stats.f_ids),
                };
            });
        }, 900)
    }

    async ask(game_stats: game_stats) {
        this.#update_dimensions();
        let play_functions = this.#get_play_functions(largo*ancho);
        let obj_functions = get_obj_buttons(largo,ancho, play_functions);
        var arr_ask = ["Donde esta ", game_stats.ask!, "?"];
        this.setState(() => {
            return {
                title: "Responde...",
                board: get_board(largo,ancho, obj_functions),
                id_title: "title",
                info: {
                    score: game_stats.score,
                    level: game_stats.level, 
                    ask: arr_ask
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
                id_title: "title_c",
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
            var class_var = this;
            var new_titles = ["Juega otravez", "xd", "Selecciona la nueva dificultad", "Buen juego"];
            var new_title = new_titles[Math.floor(Math.random()*(new_titles.length))];
            return {
                title: title,
                board: get_board(largo,ancho, only_corrects),
                game_status: 'end',
                reset_button: <button onClick={() => {class_var.#game!.reset_game()}}>Reiniciar</button>,
                back_menu_button:  <button onClick={() => {root.render(<MainMenuGame title={new_title}/>)}}>Volver al menu</button>,
                info: {
                    score: game_stats.score, 
                    level: game_stats.level,
                }
            };
        });
    }

    //Funcion tipica cuando se renderiza el juego
    componentDidMount() {
        var game_opt: game_options = {
            fruits_array: this.#get_array_images(),
            initial_time: 5000
        };
        this.#game = new Memory2(game_opt);
        this.#game.update_dif(this.props.dif);
        this.#game.on("inicio", async (stats: game_stats) => {await this.inicio(stats)});
        this.#game.on("ask", async (stats: game_stats) => {await this.ask(stats)});
        this.#game.on("correcto", async (stats: game_stats) => {await this.correcto(stats)});
        this.#game.on("perdida", async (stats: game_stats) => {await this.perdida(stats)});
        this.#game.iniciar();
    }

    componentWillUnmount() {
        this.#game = null;
    }

    render(): React.ReactNode {
        return (
        <div id="main">
            <React.StrictMode>
                <h2 id={this.state.id_title}>{this.state.title}</h2>
                <div id="info">
                    <ul>
                        <li key="game_score">Score: {this.state.info.score}</li>
                        <li key="game_level">Level: {this.state.info.level}</li>
                    </ul>
                </div>
                <div id="board">{this.state.board}</div>
                <div id="question">{this.state.info.ask}</div>
                <div id="end_buttons">
                    {this.state.reset_button}
                    {this.state.back_menu_button}
                </div>
            </React.StrictMode>
        </div>
        )
    }
}

interface props_main_menu {
    title: string
};

class MainMenuGame extends React.Component<props_main_menu, {}> {
    #play_dif(dif: number) {
        root.render(<MainGame dif={dif}/>);
    }

    render(): React.ReactNode {
        return(
        <div>
            <h2 id="title"><TypingEffect text={this.props.title} time_join_char={95}/></h2>
            <div id="buttons_dif">
                <button className="dif_button" onClick={() => {this.#play_dif(0)}}>Facil</button>
                <button className="dif_button" onClick={() => {this.#play_dif(1)}}>Medio</button>
                <button className="dif_button" onClick={() => {this.#play_dif(2)}}>Dificil</button>
            </div>
            <p id="build">(build 8)</p>
        </div>);
    }
}
var random_titles = ["Que empieze el juego...", "Selecciona dificultad", "Bienvenido", "Esto va a ser epico", "Hola", "Escoje dificultad", "Juego 👍"];
var title = random_titles[Math.floor(Math.random()*(random_titles.length))];
root.render(<MainMenuGame title={title}/>);
reportWebVitals();