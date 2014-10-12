// Class, methods, etc


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
    var registered = document.querySelector('#registered tbody');
    var newRow = registered.insertRow(registered.rows.length);
    
    var newCell = newRow.insertCell(0);
    var newText = document.createTextNode(addForm.querySelector('#pid').value);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(1);
    newText = document.createTextNode(addForm.querySelector('#first_name').value);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(2);
    newText = document.createTextNode(addForm.querySelector('#last_name').value);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(3);
    newText = document.createTextNode(addForm.querySelector('#birth_date').value);
    newCell.appendChild(newText);
    
    newCell = newRow.insertCell(4);
    newText = document.createTextNode(getAgeDivision(addForm.querySelector('#first_name').value));
    newCell.appendChild(newText);
    
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
