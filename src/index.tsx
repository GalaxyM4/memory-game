import ReactDOM from 'react-dom/client';
import React from 'react';
import './css/index.css';
import './css/game.css';
import './css/menu.css';
import reportWebVitals from './reportWebVitals';
import { MainMenuGame, MainGame, game_events} from './app';

const root = ReactDOM.createRoot(document.getElementById('root')!);
//eventos del juego
game_events.on("to_menu", (new_title) => {
    root.render(<MainMenuGame title={new_title}/>)
});
game_events.on("start_game", (dif) => {
    root.render(<MainGame dif={dif}/>);
});
var random_titles = ["Que empieze el juego...", "Selecciona dificultad", "Bienvenido", "Esto va a ser epico", "Hola", "Escoje dificultad", "Juego 👍"];
var title = random_titles[Math.floor(Math.random()*(random_titles.length))];
class PreMenuRender extends React.Component<{}, {}> {
    render(): React.ReactNode {
        return <div id="pre_menu">
            <button onClick={() => {root.render(<MainMenuGame title={title}/>);}}>Iniciar</button>
        </div>
    }
}

root.render(<PreMenuRender />);
reportWebVitals();