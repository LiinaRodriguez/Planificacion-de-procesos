import FCFS from "./algoritmos/FCFS.js";
import SJF from "./algoritmos/SJF.js";
import PRIORIDAD from "./algoritmos/PRIORIDAD.js";
import Chart from "./chart.min.js";

let colorGantt = [
    "rgb(111,168,220)"
];

let sidebar_button = document.getElementById("sidebar");
let Agregar = document.getElementById("addprocess");
let AgregarRandom = document.getElementById("Submitrandom");
let nombre = document.getElementById("name");
let tiempoLlegada = document.getElementById("arrivetime");
let tiempoCpu = document.getElementById("cputime");
let prioridad = document.getElementById("prioridad");
let tbody = document.getElementById("t-body");
let data = [];
let Processchart = document.getElementById('gantt').getContext('2d');

let home_button = document.getElementById("Home");
let FCFS_Button = document.getElementById("FCFS");
let SJF_Button = document.getElementById("SJF");
let PRIORIDAD_Button = document.getElementById("PRIORIDAD");
let ROUND_ROBIN_Button = document.getElementById("ROUND-ROBIN"); 

let clear = document.getElementById("clear");


let tpe = document.getElementById("tpe");



sidebar_button.onclick=()=>{
        sidebar_button.classList.toggle("active");
}
clear.onclick = () =>{
    location.reload();
} 

home_button.onclick=()=>{
    document.getElementById("contenttable").style.display ="none";
    document.getElementById("contentresult").style.display ="none";
    document.getElementById("contentinput").style.display ="block";
}

FCFS_Button.onclick =() =>{
    if(data.length == 0){
        alert("No hay procesos");
    }else{
    Ordenar();
    let fcfs = new FCFS(data, colorGantt);
    let Resultados = fcfs.Resultados();
    diagramadeGantt.data = Resultados;
    diagramadeGantt.update();
    CrearTablaResumen(fcfs.data);
    tiempopromedio(fcfs.data);
    document.getElementById("contentinput").style.display ="none";
    }
}

SJF_Button.onclick =() =>{
    if(data.length ==0){
        alert("No hay procesos en la tabla");
    }else{
        Ordenar();
        let sjf = new SJF(data, colorGantt);
        let Resultados = sjf.Resultados();
        diagramadeGantt.data = Resultados;
        diagramadeGantt.update();
        CrearTablaResumen();
        tiempopromedio(sjf.data);
        document.getElementById("contentinput").style.display ="none";
    }
} 

PRIORIDAD_Button.onclick =() =>{
    if(data.length == 0){
        alert("No hay procesos en la tabla");
    }else{
        Ordenar();
        let prioridad = new PRIORIDAD(data, colorGantt);
        alert("Hi :)");
        let Resultados = prioridad.Resultados();
        diagramadeGantt.data = Resultados;
        diagramadeGantt.update();
        CrearTablaResumen()
        tiempopromedio(prioridad.data);
    }
}

ROUND_ROBIN_Button.onclick =() =>{
    if(data.length == 0){
        alert("No hay procesos en la tabla");
    }else{
        Ordenar();
        let round_robin = new ROUND-ROBIN(data, colorGantt);
        let Resultados = round_robin.Resultados();
        diagramadeGantt.data = Resultados;
        diagramadeGantt.update();
        CrearTablaResumen();
        tiempopromedio(round_robin.data);
    }
}

Agregar.onclick = () =>{

    if(validarCampos() && data.length<10 ){
        data[data.length] = {
            nombre: nombre.value,
            tiempoLlegada: tiempoLlegada.value,
            tiempoCpu: tiempoCpu.value,
            prioridad: prioridad.value 
    }
    Ordenar();  
    CrearTablaProcesos();
    Limpiar();
   }else{
        alert("ha llegado al límite de procesos");
    }
}

AgregarRandom.onclick = () =>{
        if(data.length<10){
        let nombre = "P-" + data.length;
        let tiempoLlegada = Math.floor(Math.random() * 10);
        let tiempoCpu = Math.floor(Math.random() * 8)+1;
        let prioridad = Math.floor(Math.random()* 5) +1;

        data[data.length] = {
            nombre: nombre,
            tiempoLlegada: tiempoLlegada,
            tiempoCpu: tiempoCpu,
            prioridad: prioridad
        }
        CrearTablaProcesos();
        Limpiar();
        }else{
            alert("Ha llegado al limite de procesos");
        }
        
    }
    
function CrearTablaProcesos(){
    tbody.innerHTML = "";
    data.forEach(element=>  {
        tbody.innerHTML += "<tr><td>" + element.nombre + "</td><td>"
         + element.tiempoLlegada + "</td><td>" + element.tiempoCpu + "</td><td>"
         + element.prioridad+"</td></tr>";
    })
}

function Ordenar(){
    data.sort(function(a, b){
        if(Number(a.tiempoLlegada)> Number(b.tiempoLlegada)){
            return 1;
        }
        if(Number(a.tiempoLlegada)< Number(b.tiempoLlegada)){
            return -1;
        }
        return 0;
    });
}

function Limpiar(){
    nombre.value = "";
    tiempoLlegada.value = "";
    tiempoCpu.value = "";
}

function validarCampos(){ 
    if(tiempoLlegada.value<30 && tiempoCpu.value<30 
        && nombre.value!="" && tiempoLlegada.value!="" 
        && tiempoCpu.value!="" && prioridad.value != ""){
        return true;
    }else{
        alert("Los campos no son válidos ");
        return false;
    }
}

function CrearTablaResumen(){
    let thead = "<thead><tr><th>Tiempo de llegada</th><th>Nombre</th><th>CPU</th>"+
    "<th>Tiempo de inicio</th><th>Tiempo de Fin</th><th>Tiempo de espera</th></tr></thead>";
    
    let tbody = "<tbody>"

    data.forEach(element => {
        tbody += "<tr><td>" + element.tiempoLlegada + "</td>";
        tbody += "<td>" + element.nombre + "</td>";
        tbody += "<td>" + element.tiempoCpu + "</td>";
        tbody += "<td>" + element.tiempoComienzo + "</td>";
        tbody += "<td>" + element.tiempoFin + "</td>";
        tbody += "<td>" + element.tiempoEspera + "</td></tr>";
    });
    document.getElementById("summaryTable").innerHTML = thead + tbody;
}

let diagramadeGantt = new Chart(Processchart, {
    type: 'bar',
    data: {
    },
    options: {
        indexAxis: 'y',
        layout: {
            padding: 0
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Diagrama de Gantt',
            }
        },
        responsive: true,
        scales: {
            y: {
                stacked: true,
            },
        },
        elements: {
            bar: {
                borderWidth: 2,
            }
        },
    }
});

const tiempopromedio = () =>{
    let tiempopromedio = 0;
    data.forEach(element => {
        tiempopromedio += element.tiempoEspera;
    });

    tiempopromedio = tiempopromedio/data.length;
    tpe = tiempopromedio.toFixed(2);

    document.getElementById("tpromedio").innerHTML = "<p>Tiempo promedio de espera: " + tpe +" ms</p>";
}