class FCFS{
    colaProcesos = []; //cola de procesos
    Ejecucion = null; //cola de ejecucion
    constructor(data, colorGantt){
        this.data = data;
        this.colorGantt = colorGantt;
    }

    Resultados(){
        let tiempo = this.data[0].tiempoLlegada; //tiempo de inicio de procesamiento
        let ultimaEntrada = this.data[this.data.length -1 ].tiempoLlegada;   //final de procesamiento
        let finalizado = true; 

        do{
            this.data.forEach((element, index) => {
                if (tiempo == element.tiempoLlegada) {
                    element.id = index; 
                    element.tiempoUsado = 0; 
                    element.tiempoEspera = 0; 
                    this.colaProcesos.push(element);   
                    //Pone los elementos de la tabla en la cola de procesos
                }
            });

            if(this.Ejecucion == null && this.colaProcesos.length!=0){
                this.Ejecucion = this.colaProcesos.shift(); //Sacamos de la cola y lo introducimos la cola de ejecución
                this.Ejecucion.tiempoComienzo = tiempo;
            }
            tiempo++;

            if (this.Ejecucion != null) {
                if (this.colaProcesos.length != 0) {
                    this.colaProcesos.forEach(element => {
                        element.tiempoEspera += 1;  // Para marcar en tiempo de espera a los procesos en cola
                    });
                }
                this.Ejecucion.tiempoUsado += 1; // tiempo gastado por cada proceso 
                // Comprobamos si ya realizó su tarea

                if (this.Ejecucion.tiempoUsado == this.Ejecucion.tiempoCpu){
                    this.Ejecucion.tiempoFin = tiempo; //Registrar el momento en que se completó
                    this.data[this.Ejecucion.id] = this.Ejecucion; // guardamos los nuevos datos
                    this.Ejecucion = null; // sacamos el proceso de ejecución
                }
            }

            if (this.Ejecucion == null && this.colaProcesos.length == 0 && tiempo <= ultimaEntrada) {
                finalizado = false;
            } else {
                finalizado = true;
            }
        }while(this.Ejecucion!=null || this.colaProcesos.length!=0 || !finalizado)
        return this.exportChart();
    }
    
    
     returnNombres() {
        return this.data.map(function(obj) {
            return obj.nombre;
        });
    }

    exportChart() {
        //Convertimos esos datos en objeto para pasarlos al grafico
        let dat = [],
            nombres = this.returnNombres();
        this.data.forEach((element, index) => {
            dat[index] = [element.tiempoComienzo, element.tiempoFin];
        });
        return {
            labels: nombres,
            datasets: [{
                data: dat,
                backgroundColor: this.colorGantt,
                borderWidth: 2,
                borderRadius: 2,
                borderSkipped: false
            }]
        }
    }

}
export default FCFS;