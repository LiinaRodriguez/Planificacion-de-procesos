class SJF{
    colaProcesos = [];
    Ejecucion = null;
    constructor(data, colorGantt){
        this.data = data;
        this.colorGantt = colorGantt;
    };

    Resultados(){
        let tiempo = this.data[0].tiempoLlegada;
        let ultimaEntrada =this.data[this.data.length -1].tiempoLlegada;
        let finalizado = true;

        do{
            this.data.forEach((element, index) => {
                if (tiempo == element.tiempoLlegada) {
                    element.id = index; 
                    element.posicion = index;
                    element.tiempoUsado = 0; 
                    element.Entradas = 0;
                    element.tiempoEspera = 0; 
                    this.colaProcesos.push(element);   
                }
            }); 
        if (this.Ejecucion == null && this.colaProcesos.length!=0) {
            this.Ejecucion = this.Minimotiempocpu();
            this.Ejecucion.tiempoComienzo = tiempo;
        }
        tiempo++;

        if (this.Ejecucion!=null) {
            if (this.colaProcesos!=0) {
                this.colaProcesos.forEach(element=>{
                    element.tiempoEspera += 1;
                });
            }
            this.Ejecucion.tiempoUsado +=1;
            if (this.Ejecucion.tiempoUsado == this.Ejecucion.tiempoCpu) {
                this.Ejecucion.tiempoFin = tiempo;
                this.data[this.Ejecucion.id] = this.Ejecucion;
                this.Ejecucion = null;
            }
        }
 
        if (this.Ejecucion == null && this.colaProcesos.length == 0 && tiempo <= ultimaEntrada) {
            finalizado = false;
        } else 
            finalizado = true;
        }while(this.Ejecucion != null || this.colaProcesos.length !=0 || !finalizado);
       
        return this.exportChart();
    }


    returnNombres() {
        return this.data.map(function(obj) {
            return obj.nombre;
        });
    }

    Minimotiempocpu(){
        let ultimo = this.colaProcesos.length -1;
        let minimo = this.colaProcesos[ultimo];
        while (ultimo>0) {
            if(this.colaProcesos[ultimo -1].tiempoCpu <= minimo.tiempoCpu){
                minimo = this.colaProcesos[ultimo -1];
            }
            ultimo --;
        }
        this.colaProcesos = this.Eliminar(this.colaProcesos, minimo.posicion)
        return minimo;
    };

    Eliminar(Lista, Index){
        let newArray = [];
        let i = 0;
        Lista.forEach(element => {
            if (Index!= element.posicion) {
                element.posicion = i;
                newArray[i] = element;
                i++;
            }         
        })
        return newArray;
    }

    exportChart(){
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
export default SJF;