import domready from "domready"
import QuickHull from "quickhull"
import "./style.css"
import weightedRandom from "./weightedRandom";

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

/**
 * @type CanvasRenderingContext2D
 */
let ctx;
let canvas;

domready(
    () => {

        const rounding = 16;
        const padding = 20;

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        const width = (window.innerWidth) | 0;
        const height = (window.innerHeight) | 0;


        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;


        function paint()
        {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);


                ctx.save();
                // move to the center of the canvas
                ctx.translate(width/2, height/2);
                // rotate the canvas to the specified degrees
                const angle = TAU / 8;
                ctx.rotate(TAU/4);

                ctx.strokeStyle = "#fff"
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(0,0);
                ctx.lineTo(1000,0);
                ctx.stroke();
                ctx.restore();
        }


        paint();

        window.addEventListener("click", paint, true);

    }
);
