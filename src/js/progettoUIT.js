
const IMG_PATH = "/img/";

const myStore = window.sessionStorage;




window.onload = function(){


    var path = window.location.pathname;
    var display = path.split("/").pop();



    switch(display) {



        case "squadre.html":
            squadre();
            break;

        case "rosaSquadra.html":
            rosaSquadra();
            break;

        case "combina.html":
            combina();
            break;

        case "scheda.html":
            scheda();
            break;

        case "classifica.html":
            calcolaClassifica();
            break;

        case "confronto.html":
            confronto();
            break;
    }
};


//funzione che permette la visualizzazione delle squadre

function squadre()
{

    d3.json("./dataset-all.json").then( function(data) {

        var dbTot = data.pkick;
        var squadre = dbTot[2].squadre;

        const svgS = d3.select("#squadraMia");


        const nome = svgS
            .selectAll("figure")
            .data(squadre)
            .enter()
            .append("figure");

        d3.select("#squadraMia")
            .selectAll("figure")
            .append("input")
            .attr("type", "image")
            .attr("src", (d =>  IMG_PATH + d.small_img))
            .on("click", function(d) {

                d3.event.stopPropagation();
                myStore.setItem("squadra",JSON.stringify(d));

                // to-do: rosa della squadra
                window.location.href = "/src/rosaSquadra.html";

            });

        d3.select("#squadraMia")
            .selectAll("figure")
            .append("figcaption")
            .text( d => d.nome );


        d3.select("#squadraMia")
            .selectAll("figure")
            .append('input')
            .attr('type','checkbox')
            .attr('id', (d =>  "chksquadraM_" + d.nome));



        // Squadre avversarie

        const svgSA = d3.select("#squadraAvversaria");



        svgSA
            .selectAll("figure")
            .data(squadre)
            .enter()
            .append("figure");

        d3.select("#squadraAvversaria")
            .selectAll("figure")
            .append("input")
            .attr("type", "image")
            .attr("src", (d =>  IMG_PATH + d.small_img))
            .on("click", function(d) {

                d3.event.stopPropagation();
                myStore.setItem("squadra",JSON.stringify(d));

                // to-do: rosa della squadra
                window.location.href = "/src/rosaSquadra.html";

            });

        d3.select("#squadraAvversaria")
            .selectAll("figure")
            .append("figcaption")
            .text( d => d.nome );


        d3.select("#squadraAvversaria")
            .selectAll("figure")
            .append('input')
            .attr('type','checkbox')
            .attr('id', (d =>  "chksquadraA_" + d.nome));

    });

}


function rigoristi()
{

    var checkedMia = [];
    var checkedAvv = [];

    var sqMia =  d3.select("#squadraMia");

    sqMia.selectAll("input").each(function(d) {
        if (d3.select(this).attr("type") == "checkbox")
            if (d3.select(this).property("checked") == true) {
                var chkId = d3.select(this).attr("id");
                var tmp = chkId.split("_");
                var idS = tmp[1];
                checkedMia.push(idS);
            }
    });


    var sqAvv =  d3.select("#squadraAvversaria");

    sqAvv.selectAll("input").each(function(d) {
        if (d3.select(this).attr("type") == "checkbox")
            if (d3.select(this).property("checked") == true) {
                var chkId = d3.select(this).attr("id");
                var tmp = chkId.split("_");
                var idS = tmp[1];
                checkedAvv.push(idS);
            }
    });

    //   console.log(checkedMia);
    //   console.log(checkedAvv);

    if(checkedMia.length ===1 && checkedAvv.length === 1) {

        const squadreSelezionate = {
            squadraRigoristi: checkedMia[0],
            squadraPortiere:  checkedAvv[0]
        };


        myStore.setItem("squadre", JSON.stringify(squadreSelezionate));

        window.location.href = "/src/combina.html";
    }
    else
        alert("Selezionare solamente una squadra per parte");


}

//per ogni squadra checkata viene visualizzato l'elenco dei rigoristi/portieri
function  combina(){


    var squadreSelezionate = JSON.parse(myStore.getItem("squadre"));

   // console.log(squadreSelezionate);



    d3.json("./dataset-all.json").then( function(db) {

        var data = []; // giocatori della squadra
        var dataP = []; // portieri

        let pArray = db.pkick;


        var allGK = pArray[1].portieri; // tutti i portieri

        dataP = Enumerable.from(allGK)
            .where(function (x) { return x.squadra === squadreSelezionate.squadraPortiere })
            .toArray();


        var allPlayers = pArray[0].rigoristi; // tutti i rigoristi

        data = Enumerable.from(allPlayers)
            .where(function (x) { return x.squadra === squadreSelezionate.squadraRigoristi })
            .toArray();

        console.log(data);
        console.log(dataP);


    //PORTIERI
        const svgP = d3.select("#portieri")

        const nome = svgP
           .selectAll("figure")
           .data(dataP)
           .enter()
           .append("figure");

        d3.select("#portieri")
            .selectAll("figure")
            .append("input")
            .attr("type", "image")
            .attr("src", (d =>  IMG_PATH + d.small_img))
            .on("click", function(d) {

                d3.event.stopPropagation();
                myStore.setItem("giocatore",JSON.stringify(d));


                window.location.href = "/src/scheda.html";

            });


        d3.select("#portieri")
            .selectAll("figure")
            .append("figcaption")
            .text( d => d.nickname );


        if(dataP.length === 1)
            d3.select("#portieri")
                .selectAll("figure")
                .append('input')
                .attr('type','checkbox')
                .attr('id', (d =>  "chk_" + d.id))
                .property("checked", true)
                .property("disabled",true);
        else
            d3.select("#portieri")
                .selectAll("figure")
                .append('input')
                .attr('type','checkbox')
                .attr('id', (d =>  "chk_" + d.id));


        //GIOCATORI
        const svgG = d3.select("#giocatori")

        const nomeG = svgG
            .selectAll("figure")
            .data(data)
            .enter()
            .append("figure");

        d3.select("#giocatori")
            .selectAll("figure")
            .append("input")
            .attr("type", "image")
            .attr("src", (d =>  IMG_PATH + d.small_img))
            .on("click", function(d) {
                d3.event.stopPropagation();
                myStore.setItem("giocatore",JSON.stringify(d));

                window.location.href = "/src/scheda.html";

            });
        d3.select("#giocatori")
            .selectAll("figure")
            .append("figcaption")
            .text( d => d.nickname );


        d3.select("#giocatori")
            .selectAll("figure")
            .append('input')
            .attr('type','checkbox')
            .attr('id', (d =>  "chk_" + d.id));



    });



}


//rosa della squadra
function  rosaSquadra() {


    var squadraSelezionata = JSON.parse(myStore.getItem("squadra"));

    console.log(squadraSelezionata);

    d3.select("#squadra").selectAll("#imgSquadra")
        .append("p").text(squadraSelezionata.nome);

    d3.select("#squadra").selectAll('#imgSquadra')
        .append("img")
        .attr("src", (IMG_PATH + squadraSelezionata.small_img));


    d3.json("./dataset-all.json").then(function (db) {

        let pArray = db.pkick;

        var allPlayers = pArray[0].rigoristi; // tutti i rigoristi

        var allGK = pArray[1].portieri;

        let dataVisP = Enumerable.from(allPlayers)
            .where(function (x) {
                return x.squadra === squadraSelezionata.nome
            })
            .select((x) => {
                return {
                    "Numero": x.numero,
                    "Nome": x.nome,
                    "Cognome": x.cognome,
                    "Ruolo": x.ruolo,
                    "Nazionalita": x.nazionalita,
                    "Eta": (new Date().getFullYear() - x.anno_nascita)
                };
            })
            .toArray();

        let dataVisGK = Enumerable.from(allGK)
            .where(function (x) {
                return x.squadra === squadraSelezionata.nome
            })
            .select((x) => {
                return {
                    "Numero": x.numero,
                    "Nome": x.nome,
                    "Cognome": x.cognome,
                    "Ruolo": x.ruolo,
                    "Nazionalita": x.nazionalita,
                    "Eta": (new Date().getFullYear() - x.anno_nascita)
                };
            })
            .toArray();

        let dataVisAll = dataVisP.concat(dataVisGK);

        dataVisAll.sort((a, b) => a.Numero - b.Numero);



        // console.log(dataAll);

        //tabella che visualizza la classifica ordinata in base al numero
        var tr = d3.select(".objecttable tbody")
            .selectAll("tr")
            .data(dataVisAll)
            .enter().append("tr")
            .attr('id', (d => "tr_" + d.id));

        var td = tr.selectAll("td")
            .data(function (d, i) {
                player = d;
                return Object.values(d);
            })
            .enter()
            .append("td");

        td.text((d => d));


        let dataP = Enumerable.from(allPlayers)
            .where(function (x) {
                return x.squadra === squadraSelezionata.nome
            })
            .toArray();

        let dataGK = Enumerable.from(allGK)
            .where(function (x) {
                return x.squadra === squadraSelezionata.nome
            })
            .toArray();



        let dataAll = dataP.concat(dataGK);

        dataAll.sort((a, b) => a.numero - b.numero);

        let nullPlayer = {};

        dataAll.unshift(nullPlayer);

        var tr2 = d3.selectAll("tr")
            .data(dataAll)
            .append("img")
            .attr("class","icon")
            .attr("src", ('/img/soccer3.png'))
        .on("click", function (d) {
                d3.event.stopPropagation();
                myStore.setItem("giocatore", JSON.stringify(d));
                window.location.href = "/src/scheda.html?pid=" + d.id;
            });

        tr2.filter( (d,i)=> i===0)
            .attr("src", (''))
            .on('click',null);

    });
}
//fine rosa della squadra



//funzione che permette di visualizzare la scheda dei dati di ogni giocatore

 function  scheda() {

     // Slider

     const strRis = "Risoluzione: ";
     var risoluzione = 3;
     var DATA;


     var p = JSON.parse(myStore.getItem("giocatore"));

     d3.select("#scheda").selectAll("#immagine")
         .append("img")
         .attr("src", (IMG_PATH + p.small_img));

     d3.select("#dati")
         .selectAll("p#ruolo")
         .append("p").text(p.ruolo)
         .attr('style', 'display: inline-block;');

     d3.select("#dati")
         .selectAll("p#nick")
         .append("p").text(p.nickname)
         .attr('style', 'display: inline-block;');

     d3.select("#dati")
         .selectAll("p#nome")
         .append("p").text(p.nome)
         .attr('style', 'display: inline-block;');

     d3.selectAll("p#cognome")
         .append("p").text(p.cognome)
         .attr('style', 'display: inline-block;');

     d3.selectAll("p#squadra")
         .append("p").text(p.squadra)
         .attr('style', 'display: inline-block;');

     d3.selectAll("p#piede")
         .append("p").text(p.piede)
         .attr('style', 'display: inline-block;');

     if (p.ruolo === "Portiere"){
         d3.select("#dati")
             .selectAll("p#gol")
             .append("p").text(p.subiti)
             .attr('style', 'display: inline-block;');

         d3.select("#dati")
             .selectAll("p#errori")
             .append("p").text(p.difesi)
             .attr('style', 'display: inline-block;');
     }
     else {

         d3.select("#dati")
             .selectAll("p#gol")
             .append("p").text(p.segnati)
             .attr('style', 'display: inline-block;');

         d3.select("#dati")
             .selectAll("p#errori")
             .append("p").text(p.sbagliati)
             .attr('style', 'display: inline-block;');
     }
     // Grafico porta in d3
     //-----------------------------------------------------
     var width = 700;
     var height = 433;

     var svg = d3.select("#porta").append("svg");
     svg.attr("width", width);
     svg.attr("height", height);

     svg.append('image')
         .attr('xlink:href', '/img/portaSemplice.png')
         .attr('width', 600)
         .attr('height', 350);


     // Simple slider
     var data = [3, 4, 5];

     var sliderSimple = d3
         .sliderBottom()
         .min(d3.min(data))
         .max(d3.max(data))
         .width(300)
         .tickFormat(d3.format('1'))
         .ticks(3)
         .step(1)
         .tickValues(data)
         .default(3)
         .on('onchange', val => {


             val = d3.format('1')(val);

             var ptext = strRis + val + " X " + val;
             d3.select('p#risoluzione').text((ptext));

             if (val == 3) {
                 console.log("3X3");
                 risoluzione = 3;
                 draw9(svg, p);

             }
                 else if (val == 4) {
                 console.log("4X4");
                 if (p.statP4X4 !== undefined) {
                     risoluzione = 4;
                   draw16(svg,p);

                 } else {
                     alert("Non sono disponibili ulteriori dati");
                     sliderSimple.value(risoluzione);
                     d3.event.stopPropagation();

                 }
             } else if (val == 5) {

                 console.log("5X5");
                 if (p.statP5X5 !== undefined) {
                     risoluzione = 5;
                     draw25(svg,p);

                 } else {
                     alert("Non sono disponibili ulteriori dati");
                     sliderSimple.value(risoluzione);
                     d3.event.stopPropagation();
                 }
             }


         });

     var gSimple = d3
         .select('div#slider-simple')
         .append('svg')
         .attr('width', 450)
         .attr('height', 100)
         .append('g')
         .attr('transform', 'translate(30,30)');

     gSimple.call(sliderSimple);

     let initVal = d3.format('1')(sliderSimple.value());
     var ptext = strRis + initVal + " X " + initVal;
     d3.select('p#risoluzione').text(ptext);


     //----------------------------------------------


     if (risoluzione == 3)
     {

     draw9(svg,p);
 }
     else if (risoluzione == 4)
     {

         //----------------------------------------------

     }
     else if (risoluzione == 5)
     {
            alert("Non disponibile");
     }


 }

//funzione che visualizza quale rigorista abbiamo scelto da combinare con il portiere avversario
     function classifica() {

        var checked = [];

         var checkedGiocatori = [];
         var checkedPortieri = [];

         let divGiocatori =  d3.select("#giocatori");

         let divPortieri =  d3.select("#portieri");


         divGiocatori.selectAll("input").each(function(d){
             if(d3.select(this).attr("type") == "checkbox")
                 if(d3.select(this).property("checked") == true) {
                     var chkId = d3.select(this).attr("id");
                     var tmp = chkId.split("_");
                     var idG = tmp[1];
                     checkedGiocatori.push(idG);
                 }
         });

             divPortieri.selectAll("input").each(function(d){
                 if(d3.select(this).attr("type") == "checkbox")
                     if(d3.select(this).property("checked") == true) {
                         var chkId = d3.select(this).attr("id");
                         var tmp = chkId.split("_");
                         var idG = tmp[1];
                         checkedPortieri.push(idG);
                     }
             });

                 if(checkedPortieri.length != 1)
                    alert("Si può effettuare il confronto con un solo portiere per volta");
                 else{
                     checked  = checkedGiocatori.concat(checkedPortieri);
                     myStore.setItem("selezionati",JSON.stringify(checked));
                     window.location.href = "/src/classifica.html";
                 }



    }


    function calcolaClassifica()
    {
        var selezionati = JSON.parse(myStore.getItem("selezionati"));
         console.log(selezionati);

        d3.json("./dataset-all.json").then( function(db) {

           let pArray = db.pkick;

            var allPlayers = pArray[0].rigoristi;  // tutti i rigoristi

            var allGK = pArray[1].portieri; // tutti i portieri

            var giocatoriS = [];
            var p = {};



            selezionati.forEach( function (idG) {

                var queryResult = Enumerable.from(allPlayers)
                    .where(function (x) { return x.id == idG })
                    .toArray();

                var row = queryResult[0];
                if(row !== undefined)
                    giocatoriS.push(queryResult[0]);

            });

            selezionati.forEach( function (idG) {
                var queryResult = Enumerable.from(allGK)
                    .where(function (x) { return x.id == idG  })
                    .toArray();

                var row = queryResult[0];
                if (row !== undefined)
                     p = row;
            });

         //   console.log(giocatoriS);

            calcolaTop5(giocatoriS,p)

        });


    }


//dopo aver salvato i rigoristi scelti calcoliamo chi sarebbe opportuno scegliere in base al portiere avversario
    function  calcolaTop5(giocatoriS,p){

    var punteggi = [];

    giocatoriS.forEach(function (g){

         var M1 = g.statP3X3;
         var sbagliatiG = g.sbagliati/100;

         var M2 = p.statP3X3;
         var difesiP = p.difesi/100;


         var datiConfronto= calcolaPunteggio(g,p,sbagliatiG,difesiP);

         var punt = (datiConfronto.score*100).toFixed(2);

         var punteggio = punt+"%";

        var playerScore = {
            id : g.id,
            score: punteggio,
            nome: g.nome,
            cognome: g.cognome,
            nick: g.nickname,
            squadra: g.squadra,
            datiGol9: datiConfronto.datiGol9,
            img : IMG_PATH + g.small_img,
            datiGol16: datiConfronto.datiGol16,
            datiGol25: datiConfronto.datiGol25
        };

        punteggi.push(playerScore);

     });


     var classifica = punteggi.sort(function(a, b){return b.score-a.score});

     var Top5 = classifica.slice(0,5);

     //tabella che visualizza la classifica in base al punteggio
        var tr = d3.select(".objecttable tbody")
            .selectAll("tr")
            .data(Top5)
            .enter().append("tr")
            .attr('id', (d =>  "tr_" + d.id));

        var player ={};
        var td = tr.selectAll("td")
            .data(function(d, i) {player = d; return Object.values(d).slice(1,-4); })
            .enter()
            .append("td");

        td.text((d => d));



        var nullPlayer = {
            id : -1,
            score: 0,
            img : "",
            nome: "",
            cognome: "",
            nick: "",
            datiGol: []
        };

        Top5.unshift(nullPlayer);




        var tr2 = d3.selectAll("tr")
            .data(Top5)
            .append("img")
            .attr("class","icon")
            .attr("src", ('/img/Street_Fighter_VS_logo.png'))
            .on("click", function (d) {
                d3.event.stopPropagation();
                myStore.setItem("giocatore",JSON.stringify(d));
                myStore.setItem("portiere",JSON.stringify(p));
                window.location.href = "/src/confronto.html?pid="+d.id;
            });

        tr2.filter( (d,i)=> i===0)
            .attr("src", (''))
            .on('click',null);


    }


//calcolo il punteggio di ogni giocatore, rispetto al portiere

function  calcolaPunteggio(p,gk,sbagliatiG,paratiP){
// calcolo

var Pe = sbagliatiG*paratiP; // Probabilità del giocatore di sbagliare e del portiere di evitare il gol

// prodotto matriciale con somma dei prodotti punto per punto

var M9 = prodDotMat(p.statP3X3,gk.statP3X3);
var M16,M25;

if( p.statP4X4 !== undefined && gk.statP4X4 !== undefined )
    M16 = prodDotMat(p.statP4X4,gk.statP4X4);

if( p.statP5X5 !== undefined && gk.statP5X5 !== undefined )
    M25 = prodDotMat(p.statP5X5,gk.statP5X5);

 // console.log(M);

var Pgol = math.sum(M9);   // probalità totale della porta (n punti)



var finalScore = Pgol

//  creiamo array da matrice
var statPorta9 = math.multiply(M9,100); // utilizziamo i numeri come percentuali 0.8 -> 8%
    var statPorta16,statPorta25;

if( M16 !== undefined)
    statPorta16 = math.multiply(M16,100);

if( M25 !== undefined)
    statPorta25 = math.multiply(M25,100);


var statArray9 = [];  // è utile avere la matrice appiattita in un array
var statArray16 = [];
var statArray25 = [];

math.forEach(statPorta9, d => statArray9.push(d.toFixed(2)) );  //

statArray9.push((Pe*100).toFixed(2));

if(statPorta16 !== undefined)
{
    math.forEach(statPorta16, d => statArray16.push(d.toFixed(2)) );
}

if(statPorta25 !== undefined)
{
    math.forEach(statPorta25, d => statArray25.push(d.toFixed(2)) );
}

console.log(M16);
console.log(M25);
console.log(statArray16);
console.log(statArray25);

// matrice + score totale del confronto
var datiConfronto = {
datiGol9: statArray9,
datiGol16: statArray16,
datiGol25: statArray25,
score: finalScore.toFixed(4)
};
return datiConfronto;
}

//prodotto tra matrici
function prodDotMat(M1, M2) {

const  m1 = math.matrix(M1);
const  m2 = math.matrix(M2);

return math.dotMultiply(m1,m2);
}


function confronto() {

// Slider

const strRis = "Risoluzione: ";
var risoluzione = 3;
var DATA;

var p = JSON.parse(myStore.getItem("giocatore"));
var gk = JSON.parse(myStore.getItem("portiere"));
console.log(p);
console.log(gk);
//Rigorista
    d3.select("#rigorista").selectAll("#immagineR")
        .append("img")
        .attr("src",  (p.img));

    d3.select("#datiR")
        .selectAll("p#nickR")
        .append("p").text(p.nick)
        .attr('style', 'display: inline-block;');

    d3.selectAll("p#squadraR")
        .append("p").text(p.squadra)
        .attr('style', 'display: inline-block;');

    d3.select("#porta")
        .append("img")
        .attr("src", (IMG_PATH + "Street_Fighter_VS_logo.png"))
        .attr('style', 'display: inline-block;');

//Portiere

    d3.select("#portiere").selectAll("#immagineP")
        .append("img")
        .attr("src", (IMG_PATH + gk.small_img))


    d3.select("#datiP")
        .selectAll("p#nickP")
        .append("p").text(gk.nickname)
        .attr('style', 'display: inline-block;');


    d3.selectAll("p#squadraP")
        .append("p").text(gk.squadra)
        .attr('style', 'display: inline-block;');


    var width = 700;
    var height = 400;

    var svg = d3.select("#porta").append("svg");
    svg.attr("width", width);
    svg.attr("height", height);

    svg.append('image')
        .attr('xlink:href', '/img/portaSemplice.png')
        .attr('width', 600)
        .attr('height', 350);

    // Simple slider
    var data = [3, 4, 5];

    var sliderSimple = d3
        .sliderBottom()
        .min(d3.min(data))
        .max(d3.max(data))
        .width(240)
        .tickFormat(d3.format('1'))
        .ticks(3)
        .step(1)
        .tickValues(data)
        .default(3)
        .on('onchange', val => {


            val = d3.format('1')(val);

            var ptext = strRis + val + " X " + val;
            d3.select('p#risoluzione').text((ptext));

            if (val == 3) {
                console.log("3X3");
                risoluzione = 3;
                drawMatch9(svg,p);

            }
            else if (val == 4) {
                console.log("4X4");
                if (p.datiGol16.length > 0) {
                    risoluzione = 4;
                    drawMatch16(svg,p);

                } else {
                    alert("Non sono disponibili ulteriori dati");
                    sliderSimple.value(risoluzione);
                    d3.event.stopPropagation();
                }
            } else if (val == 5) {

                console.log("5X5");
                if (p.datiGol25.length > 0) {
                    risoluzione = 5;
                    drawMatch25(svg,p);

                } else {
                    alert("Non sono disponibili ulteriori dati");
                    sliderSimple.value(risoluzione);
                    d3.event.stopPropagation();
                }
            }


        });

    var gSimple = d3
        .select('div#slider-simple')
        .append('svg')

        .attr('width', 350)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(20,20)');

    gSimple.call(sliderSimple);

    let initVal = d3.format('1')(sliderSimple.value());
    var ptext = strRis + initVal + " X " + initVal;
    d3.select('p#risoluzione').text(ptext);



// Grafico porta in d3
//-----------------------------------------------------
drawMatch9(svg,p);
}


function draw9(svg,p)
{
    svg.selectAll("*").remove();

    svg.append('image')
        .attr('xlink:href', '/img/portaSemplice.png')
        .attr('width', 600)
        .attr('height', 350);

    // dataset base con le coordinate delle zone della porta
    var dataset9 = [
        {
            gol: 0,
            x: 100,
            y: 50
        },
        {
            gol: 0,
            x: 300,
            y: 50
        },
        {
            gol: 0,
            x: 500,
            y: 50
        },
        {
            gol: 0,
            x: 100,
            y: 170
        },
        {
            gol: 0,
            x: 300,
            y: 170
        },
        {
            gol: 0,
            x: 500,
            y: 170
        },
        {
            gol: 0,
            x: 100,
            y: 290
        },
        {
            gol: 0,
            x: 300,
            y: 290
        },
        {
            gol: 0,
            x: 500,
            y: 290
        },
        {
            gol: 0,
            x: 650,
            y: 150
        }
    ];

    const m1 = math.matrix(p.statP3X3);
    var statPorta = math.multiply(m1, 100); // utilizziamo i numeri come percentuali 0.8 -> 8%

    var statArray = [];  // è utile avere la matrice appiattita in un array

    math.forEach(statPorta, d => statArray.push(d.toFixed(2)));  //

    var ruolo;

    if (p.ruolo === "Portiere") {
        ruolo = "Portiere";
        statArray.push(p.difesi);
    } else {
        ruolo = "Altro";
        statArray.push(p.sbagliati);
    }

    // combiniamo i dati del dataset di base delle zone con le statistiche del giocatore
    for (i = 0; i < 10; i++) {
        dataset9[i].gol = statArray[i];
    }


    //visualizziamo i dati attraverso dei cerchi posizionati nella porta
    //la dimensione del cerchio cambia in base alla percentuale dei gol segnati se si visualizza la scheda del rigorista
    // e dei gol parati se visulizziamo la scheda del portiere
    // lo stesso vale per i colori verde => più gol segnati/parati; rosso => pochi segnati/parati; gialli => nella media

    DATA = dataset9;

    var circles = svg.selectAll("circle")
        .data(dataset9)
        .enter()
        .append("g");


    circles
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => {
            if (d.gol < 10) return 30; else if (d.gol >= 10 && d.gol < 20) return 40; else return 50;
        })
        .attr("fill", (d, i) => {
            if (ruolo === "Altro") {
                if (i === 9)
                    return "#e61919";
                else if (d.gol < 10)
                    return "#FF9900";
                else if (d.gol >= 10 && d.gol < 20)
                    return "#FFFF40";
                else
                    return "#6BE619";
            } else {
                if (i === 9)
                    return "#6BE619";
                else if (d.gol < 10)
                    return "#FFFF40";
                else if (d.gol >= 10 && d.gol < 20)
                    return "#FF9900";
                else
                    return "#e61919";

            }


        })
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

    circles
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .text(d => d.gol + "%")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif");


    //----------------------------------------------

}

function draw16(svg,p)
{

    svg.selectAll("*").remove();

    svg.append('image')
        .attr('xlink:href', '/img/portaSemplice.png')
        .attr('width', 600)
        .attr('height', 350);

    // dataset base con le coordinate delle zone della porta
    var dataset16 = [
        {
            gol: 0,
            x: 80,
            y: 50
        },
        {
            gol: 0,
            x: 220,
            y: 50
        },
        {
            gol: 0,
            x: 360,
            y: 50
        },

        {
            gol: 0,
            x: 500,
            y: 50
        },
        {
            gol: 0,
            x: 80,
            y: 130
        },
        {
            gol: 0,
            x: 220,
            y: 130
        },
        {
            gol: 0,
            x: 360,
            y: 130
        },
        {
            gol: 0,
            x: 500,
            y: 130
        },
        {
            gol: 0,
            x: 80,
            y: 210
        },
        {
            gol: 0,
            x: 220,
            y: 210
        },
        {
            gol: 0,
            x: 360,
            y: 210
        },
        {
            gol: 0,
            x: 500,
            y: 210
        },
        {
            gol: 0,
            x: 80,
            y: 290
        },
        {
            gol: 0,
            x: 220,
            y: 290
        },
        {
            gol: 0,
            x: 360,
            y: 290
        },
        {
            gol: 0,
            x: 500,
            y: 290
        },
        {
            gol: 0,
            x: 650,
            y: 150
        }
    ];

    const m1 = math.matrix(p.statP4X4);
    var statPorta = math.multiply(m1, 100); // utilizziamo i numeri come percentuali 0.8 -> 8%

    var statArray = [];  // è utile avere la matrice appiattita in un array

    math.forEach(statPorta, d => statArray.push(d.toFixed(2)));  //

    var ruolo;

    if (p.ruolo === "Portiere") {
        ruolo = "Portiere";
        statArray.push(p.difesi);
    } else {
        ruolo = "Altro";
        statArray.push(p.sbagliati);
    }

    // combiniamo i dati del dataset di base delle zone con le statistiche del giocatore
    for (i = 0; i < 17; i++) {
        dataset16[i].gol = statArray[i];
    }


    //visualizziamo i dati attraverso dei cerchi posizionati nella porta
    //la dimensione del cerchio cambia in base alla percentuale dei gol segnati se si visualizza la scheda del rigorista
    // e dei gol parati se visulizziamo la scheda del portiere
    // lo stesso vale per i colori verde => più gol segnati/parati; rosso => pochi segnati/parati; gialli => nella media





    var circles = svg.selectAll("circle")
        .data(dataset16)
        .enter()
        .append("g");


    circles
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => {
            if (d.gol < 10) return 30; else if (d.gol >= 10 && d.gol < 20) return 40; else return 50;
        })
        .attr("fill", (d, i) => {
            if (ruolo === "Altro") {
                if (i === 16)
                    return "#e61919";
                else if (d.gol < 5)
                    return "#FF9900";
                else if (d.gol >= 5 && d.gol < 15)
                    return "#FFFF40";
                else
                    return "#6BE619";
            } else {
                if (i === 16)
                    return "#6BE619";
                else if (d.gol < 10)
                    return "#FFFF40";
                else if (d.gol >= 10 && d.gol < 20)
                    return "#FF9900";
                else
                    return "#e61919";

            }


        })
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

    circles
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .text(d => d.gol + "%")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif");


}

function draw25(svg,p)
{

    svg.selectAll("*").remove();

    svg.append('image')
        .attr('xlink:href', '/img/portaSemplice.png')
        .attr('width', 600)
        .attr('height', 350);


// dataset base con le coordinate delle zone della porta
var dataset25 = [
    {
        gol: 0,
        x: 85,
        y: 50
    },
    {
        gol: 0,
        x: 185,
        y: 50
    },
    {
        gol: 0,
        x: 285,
        y: 50
    },

    {
        gol: 0,
        x: 385,
        y: 50
    },
    {
        gol: 0,
        x: 485,
        y: 50
    },
    {
        gol: 0,
        x: 85,
        y: 115
    },
    {
        gol: 0,
        x: 185,
        y: 115
    },
    {
        gol: 0,
        x: 285,
        y: 115
    },
    {
        gol: 0,
        x: 385,
        y: 115
    },
    {
        gol: 0,
        x: 485,
        y: 115
    },
    {
        gol: 0,
        x: 85,
        y: 180
    },
    {
        gol: 0,
        x: 185,
        y: 180
    },
    {
        gol: 0,
        x: 285,
        y: 180
    },
    {
        gol: 0,
        x: 385,
        y: 180
    },
    {
        gol: 0,
        x: 485,
        y: 180
    },
    {
        gol: 0,
        x: 85,
        y: 245
    },
    {
        gol: 0,
        x: 185,
        y: 245
    },
    {
        gol: 0,
        x: 285,
        y: 245
    },
    {
        gol: 0,
        x: 385,
        y: 245
    },
    {
        gol: 0,
        x: 485,
        y: 245
    },
    {
        gol: 0,
        x: 85,
        y: 310
    },
    {
        gol: 0,
        x: 185,
        y: 310
    },
    {
        gol: 0,
        x: 285,
        y: 310
    },
    {
        gol: 0,
        x: 385,
        y: 310
    },
    {
        gol: 0,
        x: 485,
        y: 310
    },
    {
        gol: 0,
        x: 650,
        y: 110
    }
];

const m1 = math.matrix(p.statP5X5);
var statPorta = math.multiply(m1, 100); // utilizziamo i numeri come percentuali 0.8 -> 8%

var statArray = [];  // è utile avere la matrice appiattita in un array

math.forEach(statPorta, d => statArray.push(d.toFixed(2)));  //

var ruolo;

if (p.ruolo === "Portiere") {
    ruolo = "Portiere";
    statArray.push(p.difesi);
} else {
    ruolo = "Altro";
    statArray.push(p.sbagliati);
}

// combiniamo i dati del dataset di base delle zone con le statistiche del giocatore
for (i = 0; i < 26; i++) {
    dataset25[i].gol = statArray[i];
}


//visualizziamo i dati attraverso dei cerchi posizionati nella porta
//la dimensione del cerchio cambia in base alla percentuale dei gol segnati se si visualizza la scheda del rigorista
// e dei gol parati se visulizziamo la scheda del portiere
// lo stesso vale per i colori verde => più gol segnati/parati; rosso => pochi segnati/parati; gialli => nella media





var circles = svg.selectAll("circle")
    .data(dataset25)
    .enter()
    .append("g");


circles
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => {
        if (d.gol < 4) return 26; else if (d.gol >= 4 && d.gol < 8) return 29; else return 33;
    })
    .attr("fill", (d, i) => {
        if (ruolo === "Altro") {
            if (i === 25)
                return "#e61919";
            else if (d.gol < 4)
                return "#FF9900";
            else if (d.gol >= 4 && d.gol < 8)
                return "#FFFF40";
            else
                return "#6BE619";
        } else {
            if (i === 25)
                return "#6BE619";
            else if (d.gol < 10)
                return "#FFFF40";
            else if (d.gol >= 10 && d.gol < 20)
                return "#FF9900";
            else
                return "#e61919";

        }


    })
    .attr("stroke", "gray")
    .attr("stroke-width", 1);

circles
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .text(d => d.gol + "%")
    .attr("fill", "black")
    .attr("font-size", 16)
    .attr("font-weight", "bold")
    .attr("font-family", "sans-serif");


}

function drawMatch9(svg,p) {

    svg.selectAll("*").remove();

    svg.append('image')
        .attr('xlink:href', '/img/portaSemplice.png')
        .attr('width', 600)
        .attr('height', 350);



// dataset base con le coordinate delle zone della porta
    var dataset = [
        { gol:0,
            x:100,
            y:50
        },
        { gol:0,
            x:300,
            y:50
        },
        { gol:0,
            x:500,
            y:50
        },
        { gol:0,
            x:100,
            y:150
        },
        { gol:0,
            x:300,
            y:150
        },
        { gol:0,
            x:500,
            y:150
        },
        { gol:0,
            x:100,
            y:250
        },
        { gol:0,
            x:300,
            y:250
        },
        { gol:0,
            x:500,
            y:250
        }
        /*,

        { gol:0,
            x:650,
            y:150
        }
        */

    ];



// combiniamo i dati del dataset di base delle zone con le statistiche del giocatore


    for(i=0;i<9;i++)
    {
        dataset[i].gol = p.datiGol9[i];
    }


    //visualizziamo i dati attraverso dei cerchi posizionati nella porta, questa volta vediamo una visualizzazione dal punto di vista del rigorista
    //la dimensione del cerchio cambia in base alla percentuale dei gol che si segnerebbero in quel punto, rispetto ai gol parati dal portiere
    //in quel punto
    // lo stesso vale per i colori verde => maggiore probabilità di segnare; rosso => poca probabilità; gialli => nella media
    var circles = svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("g");


    circles
        .append("circle")
        .attr("cx",d => d.x )
        .attr("cy",d => d.y)
        .attr("r",d => {
            if(d.gol<1) return 30;
            else if(d.gol>=1 && d.gol <2) return 40;
            else return 50;})
        .attr("fill", (d,i) => {
            if(i===9)
                return "gray";
            else if(d.gol<1)
                return "#ff9900";
            else if(d.gol>=1 && d.gol <2)
                return "#FFFF40";
            else
                return "#6BE619";
        })
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

    circles
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x",d => d.x )
        .attr("y",d => d.y)
        .text(d => d.gol + "%")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("font-weight","bold")
        .attr("font-family", "sans-serif");


}


function drawMatch16(svg, p) {

    svg.selectAll("*").remove();

    svg.append('image')
        .attr('xlink:href', '/img/portaSemplice.png')
        .attr('width', 600)
        .attr('height', 350);

    // dataset base con le coordinate delle zone della porta
    var dataset16 = [
        {
            gol: 0,
            x: 80,
            y: 50
        },
        {
            gol: 0,
            x: 220,
            y: 50
        },
        {
            gol: 0,
            x: 360,
            y: 50
        },

        {
            gol: 0,
            x: 500,
            y: 50
        },
        {
            gol: 0,
            x: 80,
            y: 130
        },
        {
            gol: 0,
            x: 220,
            y: 130
        },
        {
            gol: 0,
            x: 360,
            y: 130
        },
        {
            gol: 0,
            x: 500,
            y: 130
        },
        {
            gol: 0,
            x: 80,
            y: 210
        },
        {
            gol: 0,
            x: 220,
            y: 210
        },
        {
            gol: 0,
            x: 360,
            y: 210
        },
        {
            gol: 0,
            x: 500,
            y: 210
        },
        {
            gol: 0,
            x: 80,
            y: 290
        },
        {
            gol: 0,
            x: 220,
            y: 290
        },
        {
            gol: 0,
            x: 360,
            y: 290
        },
        {
            gol: 0,
            x: 500,
            y: 290
        },

    ];

    // combiniamo i dati del dataset di base delle zone con le statistiche del giocatore
    for (i = 0; i < 16; i++) {
        dataset16[i].gol = p.datiGol16[i];
    }


    //visualizziamo i dati attraverso dei cerchi posizionati nella porta
    //la dimensione del cerchio cambia in base alla percentuale dei gol segnati se si visualizza la scheda del rigorista
    // e dei gol parati se visulizziamo la scheda del portiere
    // lo stesso vale per i colori verde => più gol segnati/parati; rosso => pochi segnati/parati; gialli => nella media





    var circles = svg.selectAll("circle")
        .data(dataset16)
        .enter()
        .append("g");


    circles
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => {
            if (d.gol < 0.15) return 27; else if (d.gol >= 0.15 && d.gol < 0.75) return 32; else return 40;
        })
        .attr("fill", (d, i) => {

                if (i === 16)
                    return "#e61919";
                else if (d.gol < 0.15)
                    return "#FF9900";
                else if (d.gol >= 0.15 && d.gol < 0.75)
                    return "#FFFF40";
                else
                    return "#6BE619";



        })
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

    circles
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .text(d => d.gol + "%")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif");




}


function drawMatch25(svg, p) {

    svg.selectAll("*").remove();

    svg.append('image')
        .attr('xlink:href', '/img/portaSemplice.png')
        .attr('width', 600)
        .attr('height', 350);


// dataset base con le coordinate delle zone della porta
    var dataset25 = [
        {
            gol: 0,
            x: 85,
            y: 50
        },
        {
            gol: 0,
            x: 185,
            y: 50
        },
        {
            gol: 0,
            x: 285,
            y: 50
        },

        {
            gol: 0,
            x: 385,
            y: 50
        },
        {
            gol: 0,
            x: 485,
            y: 50
        },
        {
            gol: 0,
            x: 85,
            y: 115
        },
        {
            gol: 0,
            x: 185,
            y: 115
        },
        {
            gol: 0,
            x: 285,
            y: 115
        },
        {
            gol: 0,
            x: 385,
            y: 115
        },
        {
            gol: 0,
            x: 485,
            y: 115
        },
        {
            gol: 0,
            x: 85,
            y: 180
        },
        {
            gol: 0,
            x: 185,
            y: 180
        },
        {
            gol: 0,
            x: 285,
            y: 180
        },
        {
            gol: 0,
            x: 385,
            y: 180
        },
        {
            gol: 0,
            x: 485,
            y: 180
        },
        {
            gol: 0,
            x: 85,
            y: 245
        },
        {
            gol: 0,
            x: 185,
            y: 245
        },
        {
            gol: 0,
            x: 285,
            y: 245
        },
        {
            gol: 0,
            x: 385,
            y: 245
        },
        {
            gol: 0,
            x: 485,
            y: 245
        },
        {
            gol: 0,
            x: 85,
            y: 310
        },
        {
            gol: 0,
            x: 185,
            y: 310
        },
        {
            gol: 0,
            x: 285,
            y: 310
        },
        {
            gol: 0,
            x: 385,
            y: 310
        },
        {
            gol: 0,
            x: 485,
            y: 310
        },

    ];


// combiniamo i dati del dataset di base delle zone con le statistiche del giocatore
    for (i = 0; i < 25; i++) {
        dataset25[i].gol = p.datiGol25[i];
    }


//visualizziamo i dati attraverso dei cerchi posizionati nella porta
//la dimensione del cerchio cambia in base alla percentuale dei gol segnati se si visualizza la scheda del rigorista
// e dei gol parati se visulizziamo la scheda del portiere
// lo stesso vale per i colori verde => più gol segnati/parati; rosso => pochi segnati/parati; gialli => nella media





    var circles = svg.selectAll("circle")
        .data(dataset25)
        .enter()
        .append("g");


    circles
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => {
            if (d.gol < 0.05) return 25; else if (d.gol >= 0.05 && d.gol < 0.3) return 29; else return 33;
        })
        .attr("fill", (d, i) => {

                if (i === 25)
                    return "#e61919";
                else if (d.gol < 0.05)
                    return "#FF9900";
                else if (d.gol >= 0.05 && d.gol < 0.3)
                    return "#FFFF40";
                else
                    return "#6BE619";

        })
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

    circles
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .text(d => d.gol + "%")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif");


}









