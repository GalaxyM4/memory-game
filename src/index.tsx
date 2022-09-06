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
root.render(<div>
    <h2>Selecciona dificultad</h2>
    <button onClick={dif_0}>Facil</button>
    <button onClick={dif_1}>Medio</button>
    <button onClick={dif_2}>Dificil</button>
</div>);

game.on("inicio", async(stats) => {
    update_dimensions();
    root.render(<div>
        <h2>Juego piola</h2>
        <div id="score">Score: {stats.score}       Level: {stats.level}</div>
        <div id="board">{get_board(largo,ancho,stats.f_ids)}</div>
        <div id="question"></div>
    </div>);
});

game.on("ask", async(stats) =>{
    update_dimensions();
    console.log(stats.table);
    let play_f = get_play_functions(largo*ancho);
    root.render(<div>
        <h2>Juego piola</h2>
        <div id="score">Score: {stats.score}       Level: {stats.level}</div>
        <div id="board">{get_board(largo,ancho, get_obj_buttons(largo,ancho, play_f))}</div>
        <div id="question">Donde esta {stats.ask}?</div>
    </div>);
});

game.on("correcto", async (stats) => {
    update_dimensions();
    root.render(<div>
        <h2>Juego piola</h2>
        <div id="score">Score: {stats.score}       Level: {stats.level}  CORRECTO!</div>
        <div id="board">{get_board(largo,ancho, stats.f_ids)}</div>
        <div id="question">Memorizar</div>
    </div>);
});

game.on("perdida", async (stats) => {
    update_dimensions();
    root.render(<div>
        <h2>FIN DEL JUEGO</h2>
        <div id="score">Final Score: {stats.score}</div>
        <div id="board">{get_board(largo,ancho, stats.f_ids)}</div>
        <div id="question">Respuestas: {stats.rptas.join(", ")}</div>
    </div>);
});
reportWebVitals();