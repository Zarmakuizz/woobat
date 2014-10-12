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
    var known = document.querySelector('#known tbody');
    var registered = document.querySelector('#registered tbody');
    var newRow = registered.insertRow(registered.rows.length);
    
    var newCell = newRow.insertCell(0); // TODO better insertion
    var newText = document.createTextNode(newPlayer.pid);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(1);
    newText = document.createTextNode(newPlayer.firstName);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(2);
    newText = document.createTextNode(newPlayer.lastName);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(3);
    newText = document.createTextNode(newPlayer.birthDate);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(4);
    newText = document.createTextNode(newPlayer.ageGroup);
    newCell.appendChild(newText);
    
    // TODO check if the player isn't already known
    // TODO add player to xml
    var copyRow = newRow.cloneNode(true);
    known.appendChild(copyRow);
    
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
// TODO analyse date
var getAgeDivision = function(date){
    // return "Junior";
    // return "Senior";
    return "Master";
}
// Transition methods


var idToPlayers = function(evt){
    document.querySelector('#add_players').style.display="block";
    document.querySelector('#home').style.display="none";
}
// Event handlers
document.querySelector('#id_form').action="javascript:void(0);";
document.querySelector('#id_form_submit').addEventListener('click', idToPlayers);
document.querySelector('#id_form_submit').addEventListener('touchend', idToPlayers);

document.querySelector('#add_player_form').action="javascript:void(0);";
document.querySelector('#add_form_submit').addEventListener('click', addFormPlayer);
document.querySelector('#add_form_submit').addEventListener('touchend', addFormPlayer);
