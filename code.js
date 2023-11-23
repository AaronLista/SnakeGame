const canvas = document.getElementById('cvs');
const pixelSize = 5;
const ctx = canvas.getContext('2d');
const glass = document.getElementById('glass');
var fps = 10;
var X = 0, Y = X;
var moviendo = 0;
var buffer = null;
var live = true;
var colorS = '#1c3b1f';
var colorF = '#7e0f25';
var colorB = '#92b66d';

function create2DArray(rows,colums){
    let x = new Array(rows);
    for(let i = 0; i < rows; i++){
        x[i] = new Array(colums);
    }
    return x;
}


var serpiente = create2DArray(2,2);
var mapa = create2DArray(50,50);
var comida = new Array(2);

//se genera la primera comida del juego

comida[0] = 25;
comida[1] = 25;
ctx.fillStyle = colorF;
ctx.fillRect(
    25*pixelSize,
    25*pixelSize,
    pixelSize,
    pixelSize
);

//se llena la matriz del mapa.

/*esta matriz sirve para ubicar donde esta la 
serpiente y evitar generar comida en el cuerpo 
de la serpiente*/ 
for(let i = 0; i<mapa.length;i++){
   for(let j = 0; j<mapa.length;j++){
        mapa[i][j]="o";
   }
}

/*se define la primera direccion de la serpiente
la variable ultima direccion sirve para evitar que la 
serpiente pueda retroceder*/
var direccion = 'd';
var ultimadireccion = 'd';

/*se inicializan las primeras posiciones de la serpiente, 
la ultima posicion del arreglo almacena la posicion de la cola de la serpiente*/
serpiente[0][0] = 10;
serpiente[0][1] = 10;
serpiente[1][0] = 9;
serpiente[1][1] = 10;

/*detectamos las teclas presionadas 
para poder decidir la direccion de la serpiente, 
la direccion m significa que el juego ah finalizado*/

document.onkeyup = evet =>{
    if(moviendo < 1 && live && direccion!='p'){
        if(evet.key.toLowerCase() == 'a' || evet.key == 'ArrowLeft'){
            ultimadireccion = direccion;
            direccion = 'a';
            moviendo++;
        }
        if(evet.key.toLowerCase() == 'w' || evet.key == 'ArrowUp'){
            ultimadireccion = direccion;
            direccion = 'w';
            moviendo++;
        }
        if(evet.key.toLowerCase() == 'd' || evet.key == 'ArrowRight'){
            ultimadireccion = direccion;
            direccion = 'd';
            moviendo++;
        }
        if(evet.key.toLowerCase() == 's' || evet.key == 'ArrowDown'){
            ultimadireccion = direccion;
            direccion = 's';
            moviendo++;
        }
    } if(moviendo == 1 && live){
        if(evet.key.toLowerCase() == 'a' || evet.key == 'ArrowLeft'){
            buffer = 'a';
        }
        if(evet.key.toLowerCase() == 'w' || evet.key == 'ArrowUp'){
            buffer = 'w';
        }
        if(evet.key.toLowerCase() == 'd' || evet.key == 'ArrowRight'){
            buffer = 'd';
        }
        if(evet.key.toLowerCase() == 's' || evet.key == 'ArrowDown'){
            buffer = 's';
        }
    }
    if(evet.key.toLowerCase() == 'p' && live){
        if(direccion!='p'){
            direccion='p'
        } else {
            direccion=ultimadireccion;
        }
    }
}

document.onclick = evt => {
    if(moviendo < 1 && live && direccion!='p' && evt.target.type == 'button'){
        ultimadireccion = direccion;
        direccion = evt.target.id;
        moviendo++;
    } if(moviendo == 1 && live && evt.target.type == 'button'){
        buffer = evt.target.id
    }
}
/* esta funcion se encarga de dibujar un 
cuadrado en la posicion a donde avanza la serpiente*/ 

function avanzar(i,j){
    ctx.fillStyle = colorS;
    ctx.fillRect(
        i*pixelSize,
        j*pixelSize,
        pixelSize,
        pixelSize
    );
    mapa[i][j]='s';
    moviendo = 0;
}

/* esta funcion se encarga de borrar
el ultimo cuadrado que conforma la serpiente*/

function borrar(i,j){
    ctx.fillStyle = colorB;
    ctx.fillRect(
        i*pixelSize,
        j*pixelSize,
        pixelSize,
        pixelSize
    );
    mapa[i][j]='o';
}

/* esta funcion se encarga de guardar la 
ultima posicion de la serpiente antes de avanzar para
 usarla en caso de que la serpeinte crezca 
*/
function guardar(){
    let  newElement = new Array(2);
    newElement[0] = serpiente[serpiente.length-1][0];
    newElement[1] = serpiente[serpiente.length-1][1];
    return newElement;
}

/*se encarga de actualizar las posiciones de la serpiente 
dependiendo de la direccion a la que este*/
function Mover(){
    if(serpiente.length > 1){
        for(let j = serpiente.length-1; j >= 1; j--){
            serpiente[j][0]=serpiente[j-1][0];
            serpiente[j][1]=serpiente[j-1][1];
        }
    }
    if(direccion == 'a' && ultimadireccion == 'd'){
        direccion = 'd';
    }
    if(direccion == 'w' && ultimadireccion == 's'){
        direccion = 's';
    }
    if(direccion == 'd' && ultimadireccion == 'a'){
        direccion='a';
    }
    if(direccion == 's' && ultimadireccion == 'w'){
        direccion='w';
    }
    if(direccion == 'a' && ultimadireccion != 'd'){
        serpiente[0][0]--;
        X = serpiente[0][0];
        Y = serpiente[0][1];
    }
    if(direccion == 'w' && ultimadireccion != 's'){
        serpiente[0][1]--;
        X = serpiente[0][0];
        Y = serpiente[0][1];
    }
    if(direccion == 'd' && ultimadireccion != 'a'){
        serpiente[0][0]++;
        X = serpiente[0][0];
        Y = serpiente[0][1];
    }
    if(direccion == 's' && ultimadireccion != 'w'){
        serpiente[0][1]++;
        X = serpiente[0][0];
        Y = serpiente[0][1];
    }
}

/*esta funcion se encarga de comprobar que la serpiente no 
choque contra su cuerpo o contra los bordes*/

function isAlive(){
    if(X > 49 || Y > 49 || X<0 || Y<0){
        live=false;
        return false;
    }
    for(let j = 1; j < serpiente.length-1; j++){
        if(X == serpiente[j][0] && Y == serpiente[j][1]){
            live=false;
            return false;
        }
    }
    return true;
}

/*esta funcion genera comida de forma aleatoria, 
luego comprueba que donde se haya generado la
comida no sea el cuerpo de la serpiente*/
function generarComida(t){
    let i = Math.floor(Math.random()*50);
    let j = Math.floor(Math.random()*50);
    let c = true;
    if(mapa[i][j] == 'o'){
        comida[0] = i;
        comida[1] = j;
        ctx.fillStyle = colorF;
        ctx.fillRect(
            i*pixelSize,
            j*pixelSize,
            pixelSize,
            pixelSize
        );
    } else {
        if(t <= 3){
            tt = t+1;
            generarComida(tt);
        }
        else{
            for(let k = 0; k < 50; k++){
                for(let l = 0; l < 50; l++){
                    if(mapa[k][l]=='o' && c){
                        comida[0] = k;
                        comida[1] = l;
                        ctx.fillStyle = colorF;
                        ctx.fillRect(
                            k*pixelSize,
                            l*pixelSize,
                            pixelSize,
                            pixelSize
                        );
                        c=false;
                    }
                }
            }
        }
    }
}

/*crea un formulario cuyo unico objetivo es reiniciar la pagina*/
function GameOver(){
    let length = serpiente.length - 1;
    document.getElementById("glass").style.display = 'flex';
    document.getElementById("lenght").innerText += ` ${length}`
}

/*funcion principal*/
function main(){
    if(buffer != null && moviendo == 0){
        ultimadireccion = direccion;
        direccion = buffer;
        buffer=null;
    }
    if(!isAlive()){
        
        GameOver();
    }
    Mover();
    let cola = guardar();
    borrar(cola[0],cola[1]);
    avanzar(X,Y);
    if(X==comida[0] && Y==comida[1]){
        serpiente.push(cola);
        generarComida(0);
    }
}

const game = setInterval(()=>{
    if(live && direccion!= 'p'){
        main();
    } if (!live){
        clearInterval(game);
    }
},1000/fps);


