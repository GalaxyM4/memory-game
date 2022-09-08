import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Memory2}from './memory-f';
import {get_board, get_obj_buttons} from "./structures";
const root = ReactDOM.createRoot(
    document.getElementById('root')!
);

var game = new Memory2();
var largo: number, ancho: number;
function update_dimensions() {
    largo = game.largo!;
    ancho = game.ancho!;
}

//// Funciones de dificultad.
update_dimensions();
function dif_0() {
    game.update_dif(0);
    game.iniciar();
}
function dif_1() {
    game.update_dif(1);
    game.iniciar();
}
function dif_2() {
    game.update_dif(2);
    game.iniciar();
}

///Funciones de jugar
function get_play_functions(max_id: number) {
    interface f_playing {
        [key: number]: () => void
    }
    var obj_return: f_playing = {};

    for(let i = 0; i<=max_id; i++) {
        obj_return[i] = function () {game.jugar(i)};
    }

    return obj_return;
}

///Renderizando las dificultades
root.render(
<div>
    <h2 id="title">Selecciona dificultad</h2>
    <div id="buttons_dif">
        <button className="dif_button" onClick={dif_0}>Facil</button>
        <button className="dif_button" onClick={dif_1}>Medio</button>
        <button className="dif_button" onClick={dif_2}>Dificil</button>
    </div>    
</div>);

game.on("inicio", async(stats) => {
    update_dimensions();
    root.render(
    <div id="main">
        <h2 id="title">Primer nivel</h2>
        <div id="info">
            <ul>
                <li>Score: {stats.score}</li>
                <li>Level: {stats.level}</li>
            </ul>
        </div>
        <div id="board">{get_board(largo,ancho,stats.f_ids)}</div>
        <div id="question"></div>
    </div>);
});

game.on("ask", async(stats) =>{
    update_dimensions();
    let play_f = get_play_functions(largo*ancho);
    root.render(
    <div id="main">
        <h2 id="title">Responde...</h2>
        <div id="info">
            <ul>
                <li>Score: {stats.score}</li>
                <li>Level: {stats.level}</li>
            </ul>
        </div>
        <div id="board">{get_board(largo,ancho, get_obj_buttons(largo,ancho, play_f))}</div>
        <div id="question">Donde esta {stats.ask}?</div>
    </div>);
});

game.on("correcto", async (stats) => {
    var correct_titles = ["BIEN", "CORRECTO", "K GRANDE", "PIOLA", "TA BIEN", "EXELENTE", "EPICO"];
    var title = correct_titles[Math.floor(Math.random()*(correct_titles.length))];
    update_dimensions();
    root.render(
    <div id="main">
        <h2 id="title_c">{title}</h2>
        <div id="info">
            <ul>
                <li>Score: {stats.score}</li>
                <li>Level: {stats.level}</li>
            </ul>
        </div>
        <div id="board">{get_board(largo,ancho, stats.f_ids)}</div>
        <div id="question">Memorizar</div>
    </div>);
});

game.on("perdida", async (stats) => {
    update_dimensions();
    var no_correct_titles = ["PERDISTE JAJA", "FIN DEL JUEGO", "PARTIDA TERMINADA", "PERDISTE NUV", "MAL, YA PERDISTE"];
    var title = no_correct_titles[Math.floor(Math.random()*(no_correct_titles.length))];
    root.render(
    <div id="main">
        <h2 id="title">{title}</h2>
        <div id="info">
            <ul>
                <li>Final Score: {stats.score}</li>
                <li>Level: {stats.level}</li>
            </ul>
        </div>
        <div id="board">{get_board(largo,ancho, stats.f_ids)}</div>
        <div id="question">Respuestas Correctas: {stats.rptas.join(", ")}</div>
    </div>);
});
reportWebVitals();