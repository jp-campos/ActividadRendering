const urlDatos = 'https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json'




async function cargarEventos(promesa){
    let datos = await promesa

    const tabla = document.querySelector(".eventos")

    for(let i = 0; i< datos.length; i++){

        let dia = datos[i]
        
        const tr = document.createElement('tr')
        

        const row = document.createElement('td')
        row.textContent = i+1

        const events = document.createElement('td')
        events.textContent = dia.events.join()
        
        const squirrel = document.createElement('td')
        squirrel.textContent = dia.squirrel

        if(dia.squirrel){
            tr.style.backgroundColor = '#f9c6cb'
        }

        tr.appendChild(row)
        tr.appendChild(events)
        tr.appendChild(squirrel)

        tabla.appendChild(tr)

    }



}


//Funciones correlación

function getTotal(squirrel,datos){
    let ret = 0
    for(let dia of datos){
        if(dia.squirrel == squirrel){
            ret++
        }
    }
    
    return ret
}


function calcMcc(tn,tp,fn,fp){
    return ((tp*tn )- (fp*fn))/Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn))
}


function compare(e1,e2){
    return e1.correlacion - e2.correlacion
}


function getCorrelacionEventos(datos){

    let = dict = {}
    for (let dia of datos){
        for (let evento of dia.events){

            if(evento in dict)
            {
                
                dict[evento][dia.squirrel] += 1
              
            }else{

                dict[evento] = {}
                dict[evento][dia.squirrel] = 1
                dict[evento][!dia.squirrel] = 0
            }

        }
    }

    
    let totalSquirrel = getTotal(true, datos)
    let totalNoSquirrel = getTotal(false,datos)

    console.log(totalSquirrel)
    console.log(totalNoSquirrel)

    //lista de objetos {evento: , correlacion: }
    let listaCorr = []

    for (let evento in dict){

        let tn = totalNoSquirrel - dict[evento][false] 
        let fp = totalSquirrel - dict[evento][true]

        let fn   = dict[evento][false]
        let tp = dict[evento][true]
        

        let mcc = calcMcc(tn,tp,fn,fp)

        let dictActual = {"evento":evento, "correlacion": mcc}
        listaCorr.push(dictActual)

    }

    listaCorr.sort(compare).reverse()   
    return listaCorr

}





async function cargarCorrelacion(promesa)
{
    let datos = await promesa
    
    let listaCorr = getCorrelacionEventos(datos)


    const tabla = document.querySelector(".correlacion")


    for(let i = 0; i< listaCorr.length; i++){

        let par = listaCorr[i]
        
        const tr = document.createElement('tr')
        

        const row = document.createElement('td')
        row.textContent = i+1

        const events = document.createElement('td')
        events.textContent = par.evento
        
        const correlacion = document.createElement('td')
        console.log(par)
        correlacion.textContent = par.correlacion
        
        
        tr.appendChild(row)
        tr.appendChild(events)
        tr.appendChild(correlacion)
        

        tabla.appendChild(tr)
     

    }


}


let promesa = fetch(urlDatos).then((response)=> response.json() )

cargarEventos(promesa)
cargarCorrelacion(promesa)












