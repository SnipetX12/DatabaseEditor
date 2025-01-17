let driverStatTitle = document.getElementById("driverStatsTitle")
let statPanelShown = 0;

function removeStatsDrivers(){
    document.getElementById("fulldriverlist").innerHTML = ""
}

function place_drivers_editStats(driversArray) {
    let divPosition;
    driversArray.forEach((driver) => {
        divPosition = "fulldriverlist"

        let newDiv = document.createElement("div");
        let ovrDiv = document.createElement("div");
        
        newDiv.className = "col normal-driver";
        newDiv.dataset.driverid = driver[1];
        newDiv.innerHTML = driver[0];
        let statsString = '';

        for (let i = 4; i <= 14; i++) {
            statsString += driver[i] + ' ';
        }
        newDiv.dataset.stats = statsString;
        newDiv.addEventListener('click', () => {
            let elementosClicked = document.querySelectorAll('.clicked');
            elementosClicked.forEach(item => item.classList.remove('clicked'));
            newDiv.classList.toggle('clicked');
            driverStatTitle.innerHTML = manage_stats_title(newDiv.textContent);
            load_stats(newDiv)
            if(statPanelShown == 0){
                document.getElementById("editStatsPanel").className = "left-panel-stats"
                statPanelShown = 1
            }
            
            document.getElementById("confirmbtn").className = "btn custom-confirm disabled"
            recalculateOverall()
            
        });
        ovr = calculateOverall(statsString)
        ovrDiv.innerHTML = ovr
        newDiv.appendChild(ovrDiv)
        document.getElementById(divPosition).appendChild(newDiv)

        
    })

    document.querySelectorAll(".custom-input-number").forEach(function(elem) {
        elem.addEventListener("change", function(){
            document.getElementById("confirmbtn").className = "btn custom-confirm"
            if(elem.value > 99){
                elem.value = 99;
            }
            recalculateOverall()
        });
    });
}

function recalculateOverall(){
    let stats = ""
    document.querySelectorAll(".custom-input-number").forEach(function(elem){
        stats += elem.value + " "
    })
    stats = stats.slice(0, -1);
    let oldovr = document.getElementById("ovrholder").innerHTML;
    let ovr = calculateOverall(stats);
    if (oldovr != ovr){
        document.getElementById("ovrholder").innerHTML = ovr;
        document.getElementById("ovrholder").className = "overall-holder bold-font alert";
        setTimeout(() =>{
            document.getElementById("ovrholder").className = "overall-holder bold-font"
        }, 500);
    
    }
    


}

document.getElementById("confirmbtn").addEventListener("click", function(){
    let stats = ""
    document.querySelectorAll(".custom-input-number").forEach(function(elem){
        stats += elem.value + " "
    })

    let id = document.querySelector(".clicked").dataset.driverid
    let driverName = manage_stats_title(document.querySelector(".clicked").textContent)
    document.querySelector(".clicked").dataset.stats = stats
    let new_ovr = calculateOverall(stats)
    document.querySelector(".clicked").childNodes[1].innerHTML = new_ovr

    let dataStats = {
        command: "editStats",
        driverID: id,
        driver: driverName,
        statsArray: stats
    }

    socket.send(JSON.stringify(dataStats))

})

function calculateOverall(stats) {
    let statsArray = stats.split(" ").map(Number);

    let cornering = statsArray[0];
    let braking = statsArray[1];
    let control = statsArray[2];
    let smoothness = statsArray[3];
    let adaptability = statsArray[4];
    let overtaking = statsArray[5];
    let defence = statsArray[6];
    let reactions = statsArray[7];
    let accuracy = statsArray[8];

    let rating = (cornering + braking * 0.75 + reactions * 0.5 + control * 0.5 + smoothness * 0.5 + accuracy * 0.75 + adaptability * 0.25 + overtaking * 0.25 + defence * 0.25) / 4.75;

    return Math.round(rating)
}

function load_stats(div){
    let statsArray = div.dataset.stats.split(" ").map(Number);

    let inputArray = document.querySelectorAll(".custom-input-number")
    inputArray.forEach(function (input, index) {
        inputArray[index].value = statsArray[index]
    });
}


function manage_stats_title(html){
    let name = html.substring(0, html.length - 2).trim();

    return name;

}