class ROUNDROBIN{
    colaProcesos = [];
    Ejecucion = null;
    constructor(data, colorGantt, quantum){
        this.data = data;
        this.colorGantt = colorGantt;
        this.quantum = quantum;
    };

    Resultados(){
          let tiempo = this.data[0].tiempoLlegada;
          let ultimaEntrada = this.data[this.data.length - 1].tiempoLlegada;
          let finalizado = true;
          let cambio = false;
        
        do {
            this.data.forEach((element, index) => {
                if (tiempo == element.tiempoLlegada) {
                    element.id = index;      
                    element.posicion = index;
                    element.Entradas = 0;
                    element.procesos = [];
                    element.tiempoUsado = 0;
                    element.tiempoEjecucion = 0;
                    element.tiempoEspera = 0;
                    this.colaProcesos.push(element);
                }
            });
            if (cambio == true) {
                if (this.colaProcesos.length != 0) {
                    this.Ejecucion.tiempoEjecucion = 0;
                    this.Ejecucion.procesos[this.Ejecucion.Entradas - 1][1] = tiempo;
                    this.colaProcesos.push(this.Ejecucion);
                    this.Ejecucion = null;
                    cambio = false;
                } else {
                    this.Ejecucion.tiempoEjecucion = 0;
                
                }
            }
            if (this.Ejecucion == null && this.colaProcesos.length != 0) {
                this.Ejecucion = this.colaProcesos.shift(); 
                this.Ejecucion.Entradas += 1; //numero de veces que ha entrado a ejecutar
                this.Ejecucion.procesos[this.Ejecucion.Entradas - 1] = [tiempo];
            
                if (this.Ejecucion.Entradas == 1) this.Ejecucion.tiempoComienzo = tiempo //Tiempo en que empezó
            }
            tiempo++;
            if (this.Ejecucion != null) {
                if (this.colaProcesos.length != 0) {
                    this.colaProcesos.forEach(element => {
                        element.tiempoEspera += 1;
                    });
                }

                this.Ejecucion.tiempoUsado += 1; // tiempo gastado
                this.Ejecucion.tiempoEjecucion += 1; // Tiempo corriendo
                if (this.Ejecucion.tiempoUsado == this.Ejecucion.tiempoCpu) {
                    this.Ejecucion.tiempoFin = tiempo; //Registrar el momento que se completó
                    this.Ejecucion.procesos[this.Ejecucion.Entradas - 1][1] = tiempo;
                    this.data[this.Ejecucion.id] = this.Ejecucion;
                
                    this.Ejecucion = null;
                } else if (this.Ejecucion.tiempoEjecucion == this.quantum) {
                    if (this.colaProcesos.length == 0) {
                        cambio = true;
                    } else {
                        this.Ejecucion.tiempoEjecucion = 0;
                        this.Ejecucion.procesos[this.Ejecucion.Entradas - 1][1] = tiempo;
                        this.colaProcesos.push(this.Ejecucion);
                        this.Ejecucion = null;
                    }
                }
            }
            if (this.Ejecucion == null && this.colaProcesos.length == 0 && tiempo <= ultimaEntrada) {
                finalizado = false;
            } else finalizado = true;

        } while (this.Ejecucion != null || this.colaProcesos.length != 0 || !finalizado);
        return this.exportChart();
    }

    returnNombres() {
        return this.data.map(function(obj) {
            return obj.nombre;
        });
    }

    exportChart() {

        let dat = [];
        let Entradas = 0;
        let nombres = this.returnNombres();
        this.data.forEach((element, index) => {
            let aux = [];
            for (let i = 0; i < element.Entradas; i++) {
                aux[i] = [element.procesos[i][0], element.procesos[i][1]];
            }
            dat[index] = aux;
            if (element.Entradas > Entradas) {
                Entradas = element.Entradas;
            }
        });
        console.log(dat);
        let objet = {
            labels: nombres,
            datasets: []
        }
        for (let i = 0; i < Entradas; i++) {
            let dataset = []
            for (let j = 0; j < dat.length; j++) { 
                dataset[j] = dat[j][i];
            }
            objet.datasets[i] = {
                data: dataset,
                backgroundColor: this.colorGantt,
                borderWidth: 2,
                borderRadius: 2,
                borderSkipped: false
            }
        }
        return objet;
    }
    
}

export default ROUNDROBIN;