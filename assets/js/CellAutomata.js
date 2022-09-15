
    
class Vector2D {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(xvalue) {
        this._x = xvalue;
    }
    set y(yvalue) {
        this._y = yvalue;
    }
    add(vector) {
        this._x += vector.x;
        this._y += vector.y;
    }
}
class Cell {
    
    constructor(index, location) {
        this._index = index;
        this._location = location;
        this._gravity = 9.81;
        this._velocity = new Vector2D(0, 0);
        this._flammable = false;
        this._type = 0;
    }
    get flammable() {
        return this._flammable;
    }
    get type() {
        return this._type;
    }
    get index() {
        return this._index;
    }
    get location() {
        return this._location;
    }
    set index(value) {
        this._index = value;
    }
    set location(vector) {
        this._location = vector;
    }
}
class Sand extends Cell {
    constructor(index, location) {
        super(index, location);
        this._type = 1;
    }
    drawSelf() {
        //console.log("Drawing self at: (" + this._location.x + "," + this._location.y + ")");
        cntx.fillStyle = "#cccc00";
        cntx.fillRect(this._location.x * gridUnitSize.x, this._location.y * gridUnitSize.y,
                    gridUnitSize.x, gridUnitSize.y);
    }
    updateSelf(deltaTime) {
        //apply gravity
        // let vector = new Vector2D(0, 1+this._gravity * deltaTime * 10)
        // //console.log(vector);
        // this._velocity.add(vector);
        let testLocationA = new Vector2D(this._location.x, this._location.y + 1);
        if (mainMap.checkLocationOnMap(testLocationA)) {
            mainMap.moveToOnMap(testLocationA, this);
            return;
        } 
        let testLocationB = new Vector2D(this._location.x + 1, this._location.y + 1); //test bottom right
        if (mainMap.checkLocationOnMap(testLocationB)) {
            mainMap.moveToOnMap(testLocationB, this);
            return;
        }
        let testLocationC = new Vector2D(this._location.x - 1, this._location.y + 1);
        if (mainMap.checkLocationOnMap(testLocationC)) {
            mainMap.moveToOnMap(testLocationC, this);
            return;
        }
        
        this._velocity = new Vector2D(this._velocity.x, 0);
        mainMap.moveToOnMap(this._location, this);
        
    }

}
class GunPowder extends Cell {
    constructor(index, location) {
        super(index, location);
        this._flammable = true;
        this._spread = 1;
        this._catch = false;
        this._type = 4;
    }
    get catch() {
        return this._catch;
    }
    set catch(value) {
        this._catch = value;
    }
    drawSelf() {
        cntx.fillStyle = "#1a1a1a";
        cntx.fillRect(this._location.x * gridUnitSize.x, this._location.y * gridUnitSize.y,
            gridUnitSize.x, gridUnitSize.y);
    }
    updateSelf(deltaTime) {
        if (this._catch) {
            let replaceFire = new Fire(this._index, this._location);
            replaceFire.spread = this._spread;
            replaceFire.lifetime = 100;
            mainMap.moveToOnMap(this._location, replaceFire);
            return;
        } 
        let testLocationA = new Vector2D(this._location.x, this._location.y + 1);
        if (mainMap.checkLocationOnMap(testLocationA)) {
            mainMap.moveToOnMap(testLocationA, this);
            return;
        } 
        let testLocationB = new Vector2D(this._location.x + 1, this._location.y + 1); //test bottom right
        if (mainMap.checkLocationOnMap(testLocationB)) {
            mainMap.moveToOnMap(testLocationB, this);
            return;
        }
        let testLocationC = new Vector2D(this._location.x - 1, this._location.y + 1);
        if (mainMap.checkLocationOnMap(testLocationC)) {
            mainMap.moveToOnMap(testLocationC, this);
            return;
        }
        mainMap.moveToOnMap(this._location, this);
        
    }

}
class Water extends Cell {
    constructor(index, location) {
        super(index, location);
        this._type = 5;
    }
    drawSelf() {
        //console.log("Drawing self at: (" + this._location.x + "," + this._location.y + ")");
        cntx.fillStyle = "#6699ff";
        cntx.fillRect(this._location.x * gridUnitSize.x, this._location.y * gridUnitSize.y,
                    gridUnitSize.x, gridUnitSize.y);
    }
    updateSelf(deltaTime) {
        let rndDir = Math.floor(Math.random() * 3) - 1;
        
        let testLocationA = new Vector2D(this._location.x, this._location.y + 1);
        if (mainMap.checkLocationOnMap(testLocationA)) {
            mainMap.moveToOnMap(testLocationA, this);
            return;
        } 
        let testLocationB = new Vector2D(this._location.x + 1, this._location.y + 1); //test bottom right
        if (mainMap.checkLocationOnMap(testLocationB)) {
            mainMap.moveToOnMap(testLocationB, this);
            return;
        }
        let testLocationC = new Vector2D(this._location.x - 1, this._location.y + 1);
        if (mainMap.checkLocationOnMap(testLocationC)) {
            mainMap.moveToOnMap(testLocationC, this);
            return;
        }
        let testLocationD = new Vector2D(this._location.x + rndDir, this._location.y);
        if (mainMap.checkLocationOnMap(testLocationD)) {
            mainMap.moveToOnMap(testLocationD, this);
            return;
        }
        
        
        mainMap.moveToOnMap(this._location, this);
    }
}
class Smoke extends Cell {
    constructor(index, location) {
        super(index, location);
        this._lifetime = 500;
    }
    drawSelf() {
        //console.log("Drawing self at: (" + this._location.x + "," + this._location.y + ")");
        cntx.fillStyle = "#555555";
        cntx.fillRect(this._location.x * gridUnitSize.x, this._location.y * gridUnitSize.y,
                    gridUnitSize.x, gridUnitSize.y);
    }
    updateSelf(deltaTime) {
        //apply gravity
        // let vector = new Vector2D(0, 1+this._gravity * deltaTime * 10)
        // //console.log(vector);
        // this._velocity.add(vector);
        this._lifetime -= 1;
        let rndDir = Math.floor(Math.random() * 3) - 1;
        let testLocationA = new Vector2D(this._location.x + rndDir, this._location.y - 1);
        if ((mainMap.checkLocationOnMap(testLocationA)) && (this._lifetime >= 0)) {
            mainMap.moveToOnMap(testLocationA, this);
            return;
        } 
        let testLocationB = new Vector2D(this._location.x + 1, this._location.y - 1); //test bottom right
        if ((mainMap.checkLocationOnMap(testLocationB)) && (this._lifetime >= 0)) {
            mainMap.moveToOnMap(testLocationB, this);
            return;
        }
        let testLocationC = new Vector2D(this._location.x - 1, this._location.y - 1);
        if ((mainMap.checkLocationOnMap(testLocationC)) && (this._lifetime >= 0)) {
            mainMap.moveToOnMap(testLocationC, this);
            return;
        }
        
        let testLocationD = new Vector2D(this._location.x + rndDir, this._location.y);
        if ((mainMap.checkLocationOnMap(testLocationD)) && (this._lifetime >= 0)) {
            mainMap.moveToOnMap(testLocationD, this);
            //return;
        }
        
        if (this._lifetime >= 0)
        {
            mainMap.moveToOnMap(this._location, this);
        } 
        
    }
}
class Fire extends Cell {
    constructor(index, location) {
        super(index, location);
        this._color = false;
        this._lifetime = 2500;
        this._spread = 50;
        this._type = 2;
    }
    get spread() {
        return this._spread;
    }
    set spread(value) {
        this._spread = value;
    }
    get lifetime() {
        return this._lifetime;
    }
    set lifetime(value) {
        this._lifetime = value;
    }
    checkForFlammables() {
        for (let angle = 0; angle < 2 * Math.PI; angle = angle + Math.PI / 4) //point to each direction by Pi/4 radians
        {
            let rx = Math.round(Math.cos(angle)); //handles cases where (0.5, 0.5), which should be diagonals.
            let ry = Math.round(Math.sin(angle));
            let x = this._location.x + rx;
            let y = this._location.y + ry;
            mainMap.setFireToLocationOnMap(new Vector2D(x, y));
        }    
    }
    drawSelf() {
        if (this._color) {
            cntx.fillStyle = "#ff1a1a";
        } else {
            cntx.fillStyle = "#ff8c1a";
        }
        cntx.fillRect(this._location.x * gridUnitSize.x, this._location.y * gridUnitSize.y,
            gridUnitSize.x, gridUnitSize.y);
        let rndNum = Math.random() * 101;
        if (rndNum < 50) { this._color = !this._color; }
        
    }
    updateSelf(deltaTime) {
        let testLocationA = new Vector2D(this._location.x, this._location.y - 1);
        if (mainMap.checkLocationOnMap(testLocationA)) {
            let newIndex = (testLocationA.y * gridUnitSize.x) + testLocationA.x;
            let smokeObject = new Smoke(newIndex, testLocationA);
            mainMap.moveToOnMap(testLocationA, smokeObject);
        }
        
        this._lifetime -= 1;
        this._spread -= 1;
        if (this._spread <= 0) {
            this.checkForFlammables();
            this._spread = 1000;
        }
        if (this._lifetime >= 0)
        {
            mainMap.moveToOnMap(this._location, this);
        } 
    }
    
}
class Wood extends Cell {
    constructor(index, location) {
        super(index, location);
        this._flammable = true;
        this._spread = 200;
        this._catch = false;
        this._type = 3;
    }
    get catch() {
        return this._catch;
    }
    set catch(value) {
        this._catch = value;
    }
    drawSelf() {
        cntx.fillStyle = "#994d00";
        cntx.fillRect(this._location.x * gridUnitSize.x, this._location.y * gridUnitSize.y,
            gridUnitSize.x, gridUnitSize.y);
    }
    updateSelf(deltaTime) {
        if (this._catch) {
            let replaceFire = new Fire(this._index, this._location);
            replaceFire.spread = this._spread;
            mainMap.moveToOnMap(this._location, replaceFire);
        } else {
            mainMap.moveToOnMap(this._location, this);
        }
    }
    

}
class GameMap {
    constructor(mapSize) {
        this._mapGrid = []
        this._tempGrid = []
        this._mapSize = mapSize;//make sure to use Vector2D
        for (let index = 0; index < this._mapSize.x * this._mapSize.y; index++)
        {
            // let x = index % this._mapSize.x;
            // let y = Math.floor(index / this._mapSize.x);
            // let location = new Vector2D(x, y);
            this._mapGrid.push(null);//new Cell(index, 0, location));
            this._tempGrid.push(null);//new Cell(index, 0, location));
        }
    }
    get mapGrid() {
        return this._mapGrid;
    }
    get tempGrid() {
        return this._tempGrid;
    }
    get mapSize() {
        return this._mapSize;
    }
    
    moveToOnMap(location, object)
    {
        let index = (location.y * this._mapSize.x) + location.x;
        object.index = index;
        object.location = location;
        //this._mapGrid[index] = object;
        this._tempGrid[index] = object;
        
    }
    drawOnMap(location, type)
    {
        let index = (location.y * this._mapSize.x) + location.x;
        if (this._tempGrid[index]) { return; }
        switch (type) {
            case 1:
                this._tempGrid[index] = new Sand(index, location);

                break;
            case 2:
                this._tempGrid[index] = new Fire(index, location);
                break;
            case 3:
                this._tempGrid[index] = new Wood(index, location);
                break;
            case 4:
                this._tempGrid[index] = new GunPowder(index, location);
                break;
            case 5:
                this._tempGrid[index] = new Water(index, location);
            default:
                break;
        }        
               
    }
    setFireToLocationOnMap(location) {
        let index = (location.y * this._mapSize.x) + location.x;
        if (!(this._mapGrid[index] == null)) {
            let cell = this._mapGrid[index]
            if (cell.flammable) {
                cell.catch = true;
                cell.updateSelf();
            }
        }
    }
    checkLocationOnMap(location) //if empty return true, otherwise return false, check boundaries as well
    {
        if ((location.x >= this._mapSize.x) || (location.x < 0) || (location.y < 0) || (location.y >= this._mapSize.y)) { return false; }
        let index = (location.y * this._mapSize.x) + location.x;
        if ((index >= this._mapSize.x * this._mapSize.y) || (index < 0)) { return false; }
        if ((this._mapGrid[index] == null) && this._tempGrid[index] == null) { return true; }
        return false;
    }

    updateSelf()
    {
        for (let index = (this._mapSize.x * this._mapSize.y)-1; index >= 0; index--)
        {
            if (this._mapGrid[index] == null) { continue; };
            this._mapGrid[index].updateSelf(deltaTime);    
        }
        this._mapGrid = this._tempGrid;
        this._tempGrid = []; //create a new table, and copy objects over.
        for (let index = 0; index < this._mapSize.x * this._mapSize.y; index++)
        {
            this._tempGrid.push(null);//new Cell(index, 0, location));
            //this._tempGrid[index] = this._mapGrid[index];
        }
    }
    drawSelf()
    {
        for (let index = 0; index < this._mapSize.x * this._mapSize.y; index++)
        {
            if (this._mapGrid[index] === null) { continue; };
            this._mapGrid[index].drawSelf();    
        }
    }

}

const clock = new Date();
const gridUnitSize = new Vector2D(2, 2);
const canvas = document.getElementById("CellAutoCanv");
const sandbtn = document.getElementById("sandbtn");
const firebtn = document.getElementById("firebtn");
const woodbtn = document.getElementById("woodbtn");
const gpowderbtn = document.getElementById("gpowderbtn");
const waterbtn = document.getElementById("waterbtn");
const cntx = canvas.getContext("2d");
const mapSizeTemp = new Vector2D(Math.floor(canvas.width / gridUnitSize.x), Math.floor(canvas.height / gridUnitSize.y));

const mainMap = new GameMap(mapSizeTemp);
let typeSelected = 1;
let brushSize = 4;
let mouseDown = false;
let codeRunning = true;
let currentTime = clock.getTime();
let deltaTime = clock.getTime() - currentTime;


function playGame(deltaTime)
{
    cntx.fillStyle = "#333";
    cntx.fillRect(0, 0, canvas.width, canvas.height);
    //console.log(deltaTime);
    mainMap.updateSelf(deltaTime);
    mainMap.drawSelf();

}
function onMouseDown(event)
{
    mouseDown = true;
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    let mapX = Math.floor(mouseX / gridUnitSize.x);
    let mapY = Math.floor(mouseY / gridUnitSize.y);
    let location = new Vector2D(mapX, mapY);
    //console.log(location.x);
    //console.log(location.y);
    for (let r = 0; r < brushSize; r++)
    {
        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8)
        {
            let rx = Math.round(r * Math.cos(angle));
            let ry = Math.round(r * Math.sin(angle));
            let nextLocation = new Vector2D(location.x + rx, location.y + ry)
            mainMap.drawOnMap(nextLocation, typeSelected);
        }    
    }
    mainMap.drawOnMap(location, typeSelected);
}
function onMouseMove(event)
{
    if (mouseDown)
    {
        let mouseX = event.offsetX;
        let mouseY = event.offsetY;
        let mapX = Math.floor(mouseX / gridUnitSize.x);
        let mapY = Math.floor(mouseY / gridUnitSize.y);
        let location = new Vector2D(mapX, mapY);
        //console.log(location.x);
        //console.log(location.y);
        for (let r = 0; r < brushSize; r++)
        {
            for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8)
            {
                let rx = Math.round(r * Math.cos(angle));
                let ry = Math.round(r * Math.sin(angle));
                let nextLocation = new Vector2D(location.x + rx, location.y + ry)
                mainMap.drawOnMap(nextLocation, typeSelected);
            }    
        }
        mainMap.drawOnMap(location, typeSelected);
    }
}

function mainLoop()
{
    deltaTime = clock.getTime() - currentTime;
    //console.log("code is running...");
    playGame(deltaTime);
    currentTime = clock.getTime();
    //Game.playGame();
}



canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup",   () => { mouseDown = false; });
canvas.addEventListener("mousemove", onMouseMove);
sandbtn.addEventListener("click", () => { typeSelected = 1; });
firebtn.addEventListener("click", () => { typeSelected = 2; });
woodbtn.addEventListener("click", () => { typeSelected = 3; });
gpowderbtn.addEventListener("click", () => { typeSelected = 4; });
waterbtn.addEventListener("click", () => { typeSelected = 5; });
window.setInterval(mainLoop,0); //might be better ways of doing this, but I'm not an expert yet.
//restricting the framerate to about 30 fps, faster achievable, but not neccessary.
