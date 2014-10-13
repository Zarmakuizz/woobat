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
var addRegPlayer = function(player){
    console.log(player+"; "+player.ageGroup.toLowerCase());
    var totalPlayers = document.querySelector('#reg_total').innerHTML;
    document.querySelector('#reg_total').innerHTML = parseInt(totalPlayers)+1;
    if(parseInt(totalPlayers)+1 >= 8){
        document.querySelector('#players_to_recap').setAttribute('class','button ok');
        document.querySelector('#players_to_recap').innerHTML = "End registrations";
        document.querySelector('#players_to_recap').addEventListener('click', playersToRecap);
    }
    var totalAge = document.querySelector('#reg_'+player.ageGroup.toLowerCase()).innerHTML;
    document.querySelector('#reg_'+player.ageGroup.toLowerCase()).innerHTML = parseInt(totalAge)+1;
    addPlayer(player,'#registered');
};
var addKnownPlayer = function(player){
    addPlayer(player,'#known',playerKnownSelect);
};
/** Checks the date to determine the age division.
    Age division is based solely on birthdate's year.
    However, around July 15th (enough days after US nationals), every 
    categories are redefined (because kids grow eventually).
    The exception being the World Championships. If this webapp is ever
    used for World Championships, just modify this function to set the
    limit date to after September 1st.
    @param date The date to check.
    TODO defensive programming? */
var getAgeDivision = function(date){
    // TODO defensive programming?
    var year = parseInt(date.match(/\d+/g)[2]);
    var today = new Date();
    var dayToday = today.getDate();
    var monthToday = today.getMonth()+1;
    var yearToday = today.getFullYear();
    var leap = (monthToday>7 || (dayToday>=15 && monthToday ==7) ? 0 : 1);
    var age = yearToday - year + leap; // 
    if(age <= 10){ return 'Junior';}
    if(age >=11 && age <= 14){ return 'Senior';}
    return 'Master';
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
            // TODO Check userid and birthdate
            addKnownPlayer(p);         
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
    /* #pid */ 
    if(allInputs[0].value === "" || isNaN(parseInt(allInputs[0].value))){
        allInputs[0].value = "";
        return;
    }
    if(allInputs[1].value === ""){return;} /* #first_name */
    if(allInputs[2].value === ""){return;} /* #last_name */
    /* #birth_date */
    if(allInputs[3].value === "" ||
        !allInputs[3].value.match(/^\d{1,2}\D?\d{1,2}\D?\d{4}$/g)){
        allInputs[3].value = "";
        return;
    }else{ // We need to go deeper at checking a date
        // The value matches the regex above, so we get 3 strings of digits
        var raw = allInputs[3].value.match(/\d+/g);
        var date = [parseInt(raw[0]),parseInt(raw[1]),parseInt([raw2])];
        // wrong month and day
        if(date[0] > 12 && date[1] > 12){return;}
        // days are the 1st argument - as things should be, but aren't in Murica
        if(date[0] > 12 && date[1] <=12){
            date = date.swapItems(0,1);
        }
        // Let's rebuild the raw before formatting the date
        raw[0] = pad(day[0],2);
        raw[1] = pad(day[1],2);
        allInputs[3].value = raw[0]+"/"+raw[1]+"/"+raw[2];
    }

    // Here it seems that all field have been provided with value
    var newPlayer = new Player(
        allInputs[0].value,  /* #pid */
        allInputs[1].value,  /* #first_name */
        allInputs[2].value,  /* #last_name */
        allInputs[3].value); /* #birth_date */
    // TODO check if the player's id matches the tournament organizer's id
    // TODO check if the player isn't already registered
    addRegPlayer(newPlayer);
    // TODO check if the player isn't already known
    addKnownPlayer(newPlayer);
    
    // Clean out the add form
    setTimeout(function(){addForm.reset();},50);
};
var playerKnownSelect = function(elt){
    var tr = (elt.target.nodeName.toLowerCase() === "td" ?
                        elt.target.parentNode : elt.target);
    var player = trToPlayer(tr);
    addRegPlayer(player);
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
    var initForm = document.querySelector('#id_form');
    var toID = initForm.querySelector('#to_id').value;
    var tournyId = initForm.querySelector('#tourny_id').value;
    // TODO others
    // TODO validity checks
    if(toID == "" || isNaN(parseInt(toID)) ){
        return false;
    }else if(tournyId == "" || !tournyId.match(/^\d{2}-\d{2}-\d{6}$/g)){
        return false; // Currently tournaments ID look like 00-00-000000
    }
    // All checks are well done
    // TODO update a global object maybe?
    document.querySelector('#add_players').style.display="block";
    document.querySelector('#home').style.display="none";
};
var playersToRecap = function(evt){
    document.querySelector('#recap').style.display="block";
    document.querySelector('#add_players').style.display="none";
}
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
