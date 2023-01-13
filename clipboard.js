
const form = document.getElementById("datainput");

document.getElementById("Submitrandom").addEventListener("onclick", function(event){
    event.preventDefault();
    randomData();
    }
)

function randomData(){
    let n = Math.floor(Math.random())+1;
    insertrandomdata(n)
}

function insertrandomdata(n){
    for( i=0; i<n; i++){

    let name = "Proceso";
    let arrivetime = Math.floor(Math.random());
    let cputime = Math.floor(Math.random())+1;

    let tabledataref = document.getElementById("processtable");
    let newtablerow = tabledataref.insertRow(-1);

    newtablecell = newtablerow.insertCell(0); 
    newtablecell.textContent = name + i; 
    newtablecell = newtablerow.insertCell(1); 
    newtablecell.textContent = arrivetime; 
    newtablecell = newtablerow.insertCell(2); 
    newtablecell.textContent = cputime; 

    } 
}


    document.getElementById("addprocess").addEventListener("onclick", function(event){
        event.preventDefault();
        let informData = new FormData(form);
        inserttabledata(informData);
        

      } 
    )


    function inserttabledata(informData){
    let tabledataref = document.getElementById("processtable");
    let newtablerow = tabledataref.insertRow(-1);

    newtablecell = newtablerow.insertCell(0); 
    newtablecell.textContent = informData.get("name"); 
    newtablecell = newtablerow.insertCell(1); 
    newtablecell.textContent = informData.get("arrivetime");
    newtablecell = newtablerow.insertCell(2); 
    newtablecell.textContent = informData.get("cputime"); 
    }


    // Algoritmo viejo, funcional pero poco practico a la realidad
         results2(); {
             let dat = [],
                 labels = [];

             let last = 0,
                 total = 0;

             this.data.forEach((element, index) => {
                 labels[index] = element.name;
                 if (element.time > last) last = element.time;
                 total = last + Number(element.processingTime);
                 dat[index] = [last, total];
                 last = total;
             });


             let dataset = {
                 labels: labels,
                 datasets: [{
                     data: dat,
                     borderColor: [Utils.CHART_COLORS.red, Utils.CHART_COLORS.blue],
                     backgroundColor: this.backgroundColor,
                     borderWidth: 2,
                     borderRadius: 2,
                     borderSkipped: false
                 }]
             }
             return dataset;
        }