import domready from "domready"
import SimplexNoise from "simplex-noise"
import "./style.css"
import weightedRandom from "./weightedRandom";
import Color from "./Color";

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

        const chooseCenter = weightedRandom([
            1, () => width
        ])


        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;


        function paint()
        {
            const noise = new SimplexNoise()

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);

            const tileSize = 0 | Math.min(width, height) / 7;

            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 4;

            const tile = (x, y, tileSize, distance) => {

                const radius = 0 | tileSize / 2;

                const cx = x + radius;
                const cy = y + radius;

                ctx.save();
                // move to the center of the canvas
                ctx.translate(cx, cy);
                // rotate the canvas to the specified degrees

                const colorNoiseScale = 0.02;
                const saturationNoiseScale = 0.2;

                // rotation (0-3)
                const n = 0 | (noise.noise3D(x , y, 0) + 1) * 2;

                x += tileSize;

                for (let i=0; i < n; i++)
                {
                    let h = x;
                    // noinspection JSSuspiciousNameCombination
                    x = y;
                    y = -h;
                }

                const n2 = 0.5 + noise.noise3D((0 | x/tileSize) * colorNoiseScale, (0 | y/tileSize)* colorNoiseScale, 0) * 0.5
                const n3 = 0.5 + noise.noise3D((0 | x/tileSize) * colorNoiseScale, (0 | y/tileSize)* colorNoiseScale, 1) * 0.5

                const n4 = 0.5 + noise.noise3D((0 | x/tileSize) * saturationNoiseScale, (0 | y/tileSize)* saturationNoiseScale, 2) * 0.5
                const n5 = 0.5 + noise.noise3D((0 | x/tileSize) * saturationNoiseScale, (0 | y/tileSize)* saturationNoiseScale, 3) * 0.5
                //console.log("ROTATE", n, n2, n3);
                const angle = n * TAU / 4;
                ctx.rotate(angle);

                const col0 = Color.fromHSL(n2, n4, n2 >= 1/6 && n2 < 4/6 ? 0.3 : 0.4).toRGBHex();
                const col1 = Color.fromHSL(n3, n5, n3 >= 1/6 && n3 < 4/6 ? 0.4 : 0.6).toRGBHex();

                const gradient = ctx.createConicGradient(TAU/4, 0,0)
                gradient.addColorStop(0, col1)
                gradient.addColorStop(0.75, col0)

                ctx.strokeStyle = gradient
                ctx.lineWidth = 6;
                ctx.beginPath();
                for (let r = distance * 3; r < radius+ distance; r += distance)
                {
                    ctx.moveTo(r, 0);
                    ctx.arc(0, 0, r, 0, TAU * 3 / 4, false)
                    //ctx.lineTo(tileSize, -r);
                }
                ctx.stroke();

                ctx.strokeStyle = col1
                ctx.beginPath();
                for (let r = distance * 3; r < radius+ distance; r += distance)
                {
                    ctx.moveTo(r, -distance * 3 + distance / 2);
                    ctx.lineTo(r, 0);
                }
                ctx.stroke();

                ctx.strokeStyle = col0
                ctx.beginPath();
                for (let r = distance * 3; r < radius+ distance; r += distance)
                {
                    ctx.moveTo(0, -r);
                    ctx.lineTo(tileSize, -r);
                }
                ctx.stroke();

                ctx.strokeStyle = "#000"
                ctx.lineWidth = 4;
                ctx.beginPath();
                for (let r = distance * 3 + 4; r <= radius + distance; r += distance)
                {
                    ctx.moveTo(r, 0 - distance * 3 + distance / 2);
                    ctx.lineTo(r, 0);
                    ctx.arc(0, 0, r, 0, TAU * 3 / 4, false)
                    ctx.lineTo(tileSize, -r);
                }
                ctx.stroke();
                ctx.restore();
            }

            const xOff = (width - (Math.floor(width / tileSize) * tileSize)) / 2 - tileSize / 2;

            for (let y = 0; y < height; y += tileSize)
            {
                for (let x = xOff; x < width; x += tileSize)
                {
                    tile(x, y, tileSize, 8);
                }
            }

            const bg = ctx.createLinearGradient(width/2, 0, width/2, height);
            bg.addColorStop(0, "rgba(0,0,0,0.5)")
            bg.addColorStop(0.1, "rgba(0,0,0,0.1)")
            bg.addColorStop(0.8, "rgba(0,63,255,0.2)")

            ctx.fillStyle = bg;
            ctx.fillRect(0,0,width,height)
        }


        paint();

        window.addEventListener("click", paint, true);

    }
);
