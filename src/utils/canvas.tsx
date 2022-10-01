import { useRef, useEffect } from 'react';

interface CanvasProps {
    width: number;
    height: number;
    position: number;
}

function get_coors(pos: number, max_x: number, max_y: number) {
    var res_ex = max_y*(Math.floor(pos/max_y) + 1) - pos; //Basicamente 2 horas para esto.

    var obj_return: {x: number, y: number};
    var x = (pos%max_x === 0) ? max_x : pos%max_x;
    var y = (pos%max_y === 0) ? pos/max_y : (pos + res_ex)/max_y;

    obj_return = {x: x, y: y};
    return obj_return;
}

function FruitCanvas ({ width, height, position }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        var coors = get_coors(position, 3, 3);
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if(ctx === null) throw Error("Context no aviable.");
        var img_f = new Image();
        img_f.src = process.env.PUBLIC_URL + "/images/fruits.png";
        var x = 256*(coors.x - 1);
        var y = 256*(coors.y - 1);

        img_f.onload = () => {
            ctx.drawImage(img_f, 
                x, y, 
                256, 256,
                0, 0, 
                width, height
            );
        };
    });

    return <canvas ref={canvasRef} height={height} width={width} />;
};

FruitCanvas.defaultProps = {
    width: 35,
    height: 35
};

export default FruitCanvas;