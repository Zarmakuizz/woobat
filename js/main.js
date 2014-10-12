// Class, methods, etc
/** Class representing a player */
function Player(pid, firstName, lastName, birthDate) {
    this.pid = pid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate; // TODO manage date
    this.ageGroup = getAgeDivision(birthDate);
    // TODO add pairing management
};
/** Takes a table line and makes it into a player */
var trToPlayer = function(tr){
    var tds = tr.querySelectorAll('td');
    // TODO defensive programing
    return new Player(tds[0].innerHTML,tds[1].innerHTML,
                      tds[2].innerHTML,tds[3].innerHTML);
};

/** Add a player to a list of players.     @param player a Player object.
@param id The id to the list of players. Currently supported are #known and
#registered.*/ 
var addPlayer = function(player, id, event){
    // TODO defensive programming     v
    var target = document.querySelector(id+' tbody');
    var newRow = document.createElement('tr');
    
    var newCell = newRow.insertCell(0);
    var newText = document.createTextNode(player.pid);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(1);
    newText = document.createTextNode(player.firstName);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(2);
    newText = document.createTextNode(player.lastName);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(3);
    newText = document.createTextNode(player.birthDate);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(4);
    newText = document.createTextNode(player.ageGroup);
    newCell.appendChild(newText);
    
    target.appendChild(newRow);
    // TODO improve insertion. Or offer some auto-filtering somewhere.
    // Add event if any
    if(event != undefined && event != ""){
        newRow.addEventListener('click',event);
        newRow.addEventListener('touchend',event);
    }
};
/** Checks the date to determine the age division
    TODO analyse date */
var getAgeDivision = function(date){
    // return "Junior";
    // return "Senior";
    return "Master";
};

// Transition methods 
/** Select a file when clicking on "load players.xml" */
var loadPlayerFile = function(evt){
    document.querySelector('#lpx_input').click();
}; /** Import list of players */
var importPlayers = function(evt){
    console.log(evt);     
    var xmlFile = evt.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function(){
        var strContent = this.result;
        // TODO defensive programming
        var parsed = new DOMParser().parseFromString(strContent, "text/xml");
        var players = parsed.querySelectorAll('player');
        for(var i=0; i<players.length; i++){
            var p = new Player(players[i].getAttribute('userid'),
            players[i].querySelector('firstname').innerHTML,
            players[i].querySelector('lastname').innerHTML,
            players[i].querySelector('birthdate').innerHTML);
            addPlayer(p,'#known',playerKnownSelect);         
        }
    }
    reader.readAsText(xmlFile); 
}; 
/** Export list of players following the syntax in data/players.xml */
var exportPlayers = function(evt){
    var playersTr = document.querySelectorAll('#known tbody tr');
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<players>\n';
    for(var i=0; i<playersTr.length; i++){
        var player = trToPlayer(playersTr[i]);
        xml += '\t<player userid="'+player.pid+'">\n';
        xml += '\t\t<firstname>'+player.firstName+'</firstname>\n';
        xml += '\t\t<lastname>'+player.lastName+'</lastname>\n';
        xml += '\t\t<birthdate>'+player.birthDate+'</birthdate>\n';
        xml += '\t\t<creationdate>'+'09/20/2014 10:10:14'+'</creationdate>\n';
        xml += '\t\t<lastmodifieddate>'+'09/20/2014 10:10:14'+'</lastmodifieddate>\n';
        // TODO get current date
        xml += '\t</player>\n;'
    }
    xml+='\n</players>'

    // Offer a file to download
    var pom = document.querySelector('#lpx_export'); // get a hidden <a>
    pom.setAttribute('href','data:application/xml;charset=utf-8,'+encodeURIComponent(xml));
    pom.setAttribute('download','players.xml');
    pom.click();

};
/** Event fired when a player is added to the
tournament     using the add form. */ 
var addFormPlayer = function(evt){     
    //Check if the form has some empty values or incorrect ones     
    var addForm = document.querySelector('#add_player_form');     
    var allInputs = addForm.querySelectorAll('input');     
    if(allInputs[0].value === "" || isNaN(parseInt(allInputs[0].value))){
        allInputs[0].value = "";
        return;
    }     
    if(allInputs[1].value === ""){return;}
    if(allInputs[2].value === ""){return;} 
    if(allInputs[3].value === ""){return;}     
    // TODO check pid and birth_date values

    // Here it seems that all field have been provided with value
    var newPlayer = new Player(
        addForm.querySelector('#pid').value,
        addForm.querySelector('#first_name').value,
        addForm.querySelector('#last_name').value,
        addForm.querySelector('#birth_date').value);
    
    addPlayer(newPlayer,'#registered');
    // TODO check if the player isn't already known
    // TODO add player to xml
    addPlayer(newPlayer, '#known',playerKnownSelect);
    
    // Clean out the add form
    setTimeout(function(){addForm.reset();},50);
};
var playerKnownSelect = function(elt){
    console.log("elt.target.nodeName = "+elt.target.nodeName);
    var tr = (elt.target.nodeName.toLowerCase() === "td" ?
                        elt.target.parentNode : elt.target);
    var player = trToPlayer(tr);
    addPlayer(player,'#registered');
};
var playerRegSelect = function(elt){
    if(elt.className.contains('selected')){
        elt.className = elt.className.replace('selected','');
    }else{
        elt.className+=' selected';
    }
};

/** Event fired when the first view is done. */
var idToPlayers = function(evt){
    document.querySelector('#add_players').style.display="block";
    document.querySelector('#home').style.display="none";
    
    /** TODO load from user's given file
    // Loads the players stored in the data/players.xml file
    var playersXml = loadXMLDoc('data/players.xml');
    var players = playersXml.querySelectorAll('player');
    for(var i=0;i<players.length;i++){
        var p = new Player(players[i].getAttribute('userid'),
                           players[i].querySelector('firstname').innerHTML,
                           players[i].querySelector('lastname').innerHTML,
                           players[i].querySelector('birthdate').innerHTML);
        addPlayer(p,'#known',playerKnownSelect);
    }
    //*/
};
// Event handlers
document.querySelector('#id_form').action="javascript:void(0);";
document.querySelector('#id_form_submit').addEventListener('click', idToPlayers);
document.querySelector('#id_form_submit').addEventListener('touchend', idToPlayers);

document.querySelector('#secret_load_players_xml').action="javascript:void(0);";
document.querySelector('#lpx_input').addEventListener('change', importPlayers);
document.querySelector('#load_players_xml').addEventListener('click',loadPlayerFile);
document.querySelector('#load_players_xml').addEventListener('touchend',loadPlayerFile);
document.querySelector('#export_players_xml').addEventListener('click',exportPlayers);
document.querySelector('#export_players_xml').addEventListener('touchend',exportPlayers);

document.querySelector('#add_player_form').action="javascript:void(0);";
document.querySelector('#add_form_submit').addEventListener('click', addFormPlayer);
document.querySelector('#add_form_submit').addEventListener('touchend', addFormPlayer);
