class SRTF {
    colaProcesos = [];
    Ejecucion = null;
    constructor(data, colorGantt) {
        this.data = data;
        this.colorGantt = colorGantt;
    }
    Resultados() {
        let tiempo = this.data[0].tiempoLlegada,
            ultimaEntrada = this.data[this.data.length - 1].tiempoLlegada,
            finalizado = true;

        do {
            this.data.forEach((element, index) => {
                if (tiempo == element.tiempoLlegada) {
                    element.id = index;
                    element.posicion = index;
                    element.Entradas = 0;
                    element.procesos = [];
                    element.timepoUsado = 0;
                    element.timepoEspera = 0;
                    this.colaProcesos.push(element);

                    if (this.Ejecucion != null) {
                        let tiempoRestante = this.Ejecucion.tiempoCpu - this.Ejecucion.timepoUsado;
                        if (tiempoRestante > element.tiempoCpu) {
                            let aux = this.Ejecucion;
                            this.Ejecucion = this.colaProcesos.pop();
                            this.Ejecucion.Entradas = 1; //Saber intervalos de ejecución
                            this.Ejecucion.procesos[this.Ejecucion.Entradas - 1] = [tiempo];
                            this.Ejecucion.tiempoInicio = tiempo;
                            aux.procesos[aux.Entradas - 1][1] = tiempo;
                            this.colaProcesos.push(aux);
                        }
                    }
                }
            });
            if (this.Ejecucion == null && this.colaProcesos.length != 0) {
                this.Ejecucion = this.Minimo(); 
                this.Ejecucion.Entradas += 1; 
                this.Ejecucion.procesos[this.Ejecucion.Entradas - 1] = [tiempo];
                if (this.Ejecucion.Entradas == 1) this.Ejecucion.tiempoInicio = tiempo 
            }
            tiempo++;
            if (this.Ejecucion != null) {
                if (this.colaProcesos.length != 0) {
                    this.colaProcesos.forEach(element => {
                        element.timepoEspera += 1;
                    });
                }
                this.Ejecucion.timepoUsado += 1; 
                if (this.Ejecucion.timepoUsado == this.Ejecucion.tiempoCpu) {
                    this.Ejecucion.tiempoFin = tiempo; 
                    this.Ejecucion.procesos[this.Ejecucion.Entradas - 1][1] = tiempo;
                    this.data[this.Ejecucion.id] = this.Ejecucion;
                    this.Ejecucion = null;
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

    Minimo() {
        let al = this.colaProcesos.length - 1;
        let minimo = this.colaProcesos[al];
        while (al > 0) {
            let tiempoRestante = this.colaProcesos[al - 1].tiempoCpu - this.colaProcesos[al - 1].timepoUsado;
            let minimoTiempoRestante = minimo.tiempoCpu - minimo.timepoUsado;
            if (tiempoRestante <= minimoTiempoRestante) {
                minimo = this.colaProcesos[al - 1];
            }
            al--
        }
        this.colaProcesos = this.Delete(this.colaProcesos, minimo.posicion)
        return minimo;
    };

    Delete(Lista, index) {
        let newArray = [];
        let i = 0;
        Lista.forEach((element) => {
            if (index != element.posicion) {
                element.posicion = i;
                newArray[i] = element;
                i++;
            }
        })
        return newArray;
    }
    
    exportChart() {
        let dat = [],
            Entradas = 0,
            nombres = this.returnNombres();
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
export default SRTF;