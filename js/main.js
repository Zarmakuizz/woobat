// Class, methods, etc
/** Class representing a player */
function Player(pid, firstName, lastName, birthDate) {
    this.pid = pid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate; // TODO manage date
    this.ageGroup = getAgeDivision(birthDate);
    // TODO add pairing management
}

/** Add a player to a list of players.
    @param player a Player object. 
    @param id The id to the list of players. Currently supported are #known and #registered.*/
var addPlayer = function(player, id){
    // TODO defensive programming
    var target = document.querySelector(id+' tbody');
    var newRow = target.insertRow(target.rows.length);
    // TODO improve insertion. Or offer some auto-filtering somewhere.
    
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
}
/** Checks the date to determine the age division
    TODO analyse date */
var getAgeDivision = function(date){
    // return "Junior";
    // return "Senior";
    return "Master";
}

// Transition methods
/** Event fired when a player is added to the tournament
    using the add form. */
var addFormPlayer = function(evt){
    // Check if the form has some empty values or incorrect ones
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
    addPlayer(newPlayer, '#known');
    
    // Clean out the add form
    setTimeout(function(){addForm.reset();},50);
}
var playerRegSelect = function(elt){
    if(elt.className.contains('selected')){
        elt.className = elt.className.replace('selected','');
    }else{
        elt.className+=' selected';
    }
}

/** Event fired when the first view is done. */
var idToPlayers = function(evt){
    document.querySelector('#add_players').style.display="block";
    document.querySelector('#home').style.display="none";
    
    // Loads the players stored in the data/players.xml file
    var playersXml = loadXMLDoc('data/players.xml');
    var players = playersXml.querySelectorAll('player');
    console.log(players+" of size "+players.length);
    for(var i=0;i<players.length;i++){
        console.log('loading player '+i+'/'+players.length);
        var p = new Player(players[i].getAttribute('userid'),
                           players[i].querySelector('firstname').innerHTML,
                           players[i].querySelector('lastname').innerHTML,
                           players[i].querySelector('birthdate').innerHTML);
        addPlayer(p,'#known');
    }
}
// Event handlers
document.querySelector('#id_form').action="javascript:void(0);";
document.querySelector('#id_form_submit').addEventListener('click', idToPlayers);
document.querySelector('#id_form_submit').addEventListener('touchend', idToPlayers);

document.querySelector('#add_player_form').action="javascript:void(0);";
document.querySelector('#add_form_submit').addEventListener('click', addFormPlayer);
document.querySelector('#add_form_submit').addEventListener('touchend', addFormPlayer);
