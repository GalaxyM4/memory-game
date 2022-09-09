import React from "react";
// Interfaces
interface board_inside {
    [key: number]: any
}
export function ButtonM(title: string, onclick: () => void) {
    return <button className="q_buttons" onClick={onclick}>{title}</button>;
}

export function get_board(largo: number, ancho: number, inside?: board_inside) {
    var array_filas: JSX.Element[][] = [];
    var array_columns: JSX.Element[] = [];

    var array_main = [];
    var b_area = largo * ancho;
    let pushed = [];

    for (let i = 0; i<b_area ; i++) {
        let fake_id = i + 1;
        if(inside && inside[fake_id]) {
            pushed.push(<td>{inside[fake_id]}</td>);
        }else {
            pushed.push(<td>{fake_id}</td>);
        }

        if(pushed.length === ancho) {
            //Estableciendo filas (x)
            array_filas.push(pushed);
            pushed = [];
        }
    }
    //////Uniendo filas y columnas
    for (let i = 0; i<largo ; i++) {
        // Columnas :V (y)
        array_columns.push(<tr>{array_filas[i]}</tr>)
    }
    array_main = array_columns;
    return <table>
        {array_main}
    </table>;
}

export function get_obj_buttons(largo: number, ancho: number, obj_functions: any) {
    var b_area = largo * ancho;
    var ret_obj: board_inside = {};

    for(let i = 0; i<=b_area; i++) {
        ret_obj[i] = ButtonM(i.toString(), obj_functions[i]);
    }

    return ret_obj;
}
