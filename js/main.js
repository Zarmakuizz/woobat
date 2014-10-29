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

/** Class representing an element of the list of possible age divisions.
    AgeDivision's constructor also initializes the relevant number of rounds.
 */
function AgeDivision(nbPlayers, roundMode, hasTops){
    this.nbJuniors = function(){throw Error('This should have been overriden if relevant.')};
    this.nbSeniors = function(){throw Error('This should have been overriden if relevant.')};
    this.nbMasters = function(){throw Error('This should have been overriden if relevant.')};
    this.nbPlayers = nbPlayers;
    this.hasTops = hasTops;
    AgeDivision(nbPlayers, roundMode, hasTops); // FIXME inheritance in Javascript
    if(roundMode == "single"){
        var i=0;
        do{i++}while(nbPlayers/Math.pow(2,i) > 1.0);
        this.nbRoundsTop=0;
        this.nbRounds = i;
        this.hasDay2 = false;
    }else if(roundMode == "swiss"){
        // TODO read rules
        if(nbPlayers <= 8){
            nbRounds = 3;
            nbRoundsTop = 0;
            this.hasDay2 = false;
            this.day2Rounds = 0;
        }else if(nbPlayers <= 12){
            nbRounds = 4;
            nbRoundsTop = (hasTops ? 2 : 0);
            this.hasDay2 = false;
            this.day2Rounds = 0;
        }else if(nbPlayers <= 20){
            nbRounds = 5;
            nbRoundsTop = (hasTops ? 2 : 0);
            this.hasDay2 = false;
            this.day2Rounds = 0;
        }else if(nbPlayers <= 32){
            nbRounds = 5;
            nbRoundsTop = (hasTops ? 3 : 0);
            this.hasDay2 = false;
            this.day2Rounds = 0;
        }else if(nbPlayers <= 64){
            nbRounds = 6;
            nbRoundsTop = (hasTops ? 3 : 0);
            this.hasDay2 = false;
            this.day2Rounds = 0;
        }else if(nbPlayers <= 128){
            nbRounds = 7;
            nbRoundsTop = (hasTops ? 3 : 0);
            this.hasDay2 = false;
            this.day2Rounds = 0;
        }else if(nbPlayers <= 227){// Not sure about that number
            nbRounds = 8;
            nbRoundsTop = (hasTops ? 3 : 0);
            this.hasDay2 = false;
            this.day2Rounds = 0;
        }else if(true /* TODO */){
            // TODO
            nbRounds = 9;
            nbRoundsTop = (hasTops ? 3 : throw Error('This case might not be covered by the rules.'));
            this.hasDay2 = true;
            this.day2Rounds = 5;
        }
    }else{
        throw Error('We don\'t know which round mode you are talking about');
    }
};
function AgeJunior(nbPlayers, roundMode, hasTops){
    AgeDivision(nbPlayers, roundMode, hasTops);// TODO check inheritance system
    this.nbJuniors = nbPlayers;
}
function AgeSenior(nbPlayers, roundMode, hasTops){
    AgeDivision(nbPlayers, roundMode, hasTops);// TODO check inheritance system
    this.nbSeniors = nbPlayers;
}
function AgeMaster(nbPlayers, roundMode, hasTops){
    AgeDivision(nbPlayers, roundMode, hasTops);// TODO check inheritance system
    this.nbMasters = nbMasters;
}
function AgeJuniorSenior(nbJuniors, nbSeniors, roundMode, hasTops){
    // Only one of the two age divisions can be big enough to still have tops in swiss, despite being mixed to the other age division.
    if(nbJuniors > 8 && roundMode == "swiss"){
        AgeDivision(nbJuniors, roundMode, hasTops);
    }else if(nbSeniors > 8 && roundMode == "swiss"){
        AgeDivision(nbSeniors, roundMode, hasTops);
    }else if(roundMode == "single"){
        AgeDivision(nbJuniors+nbSeniors, roundMode, hasTops);
    }else{
        AgeDivision(nbJuniors, roundMode, false);
    }
    this.nbJuniors = nbJuniors;
    this.nbSeniors = nbSeniors;
    this.nbPlayers = nbJuniors + nbSeniors;
}
function AgeSeniorMaster(nbSeniors, nbMasters, roundMode, hasTops){
    // Only one of the two age divisions can be big enough to still have tops in swiss, despite being mixed to the other age division.
    if(nbSeniors > 8 && roundMode == "swiss"){
        AgeDivision(nbSeniors, roundMode, hasTops);
    }else if(nbMasters > 8 && roundMode == "swiss"){
        AgeDivision(nbMasters, roundMode, hasTops);
    }else if(roundMode == "single"){
        AgeDivision(nbSeniors+nbMasters, roundMode, hasTops);
    }else{
        AgeDivision(nbSeniors, roundMode, false);
    }
    this.nbSeniors = nbSeniors;
    this.nbMasters = nbMasters;
    this.nbPlayers = nbSeniors + nbMasters;
}
function AgeAll(nbJuniors, nbSeniors, nbMasters, roundMode, hasTops){
    // Only one of the two age divisions can be big enough to still have tops in swiss, despite being mixed to the other age division.
    if(nbJuniors > 8 && roundMode == "swiss"){
        AgeDivision(nbJuniors, roundMode, hasTops);
    }else if(nbSeniors > 8 && roundMode == "swiss"){
        AgeDivision(nbSeniors, roundMode, hasTops);
    }else if(nbMasters > 8 && roundMode == "swiss"){
        AgeDivision(nbMasters, roundMode, hasTops);
    }else if(roundMode == "single"){
        AgeDivision(nbJuniors+nbSeniors+nbMasters, roundMode, hasTops);
    }else{
        AgeDivision(nbJuniors, roundMode, false);
    }
    this.nbJuniors = nbJuniors;
    this.nbSeniors = nbSeniors;
    this.nbMasters = nbMasters;
    this.nbPlayers = nbJuniors + nbSeniors + nbMasters;
}
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
/** Determines the allowed categories and the number of rounds that should be played.
    TODO unit testing : no more than 3 age groups, no collision, right group construction.
    TODO defensive programming, we are assuming at least 8 players.
    @param nbJuniors number of registered juniors
    @param nbSeniors number of registered seniors
    @param nbMasters number of registered masters
    @return array of bools deciding if a row should be displayed.
    */
var getDivisions = function(nbJuniors, nbSeniors, nbMasters){
    var result = [false,false,false,false,false,false];
    // In which group do the Juniors go?
    if(nbJuniors >=6 && nbSeniors + nbMasters >= 6){ 
        // Juniors may go alone
        result[0]=true;
    }else if(nbJuniors <6 && nbJuniors + nbSeniors >= 6 && nbMasters >= 6){
        // Juniors aren't enough alone, they are mixed with Seniors
        // (implies Seniors not alone and Masters alone)
        result[2]=true;
    }else{
        // Juniors might be big enough but there is a lack of older players
        // or not enough players (implies no age group alone)
        result[5]=true;
    }
    // In which group do the Seniors go? (partially already answered)
    if(nbJuniors >=6 && nbSeniors >= 6 && nbMasters >=6){
        // Seniors may go alone (implies Juniors and Masters are alone too)
        result[1]=true

    }else if(nbJuniors >= 6 && nbSeniors + nbMasters >=6){
        // Seniors are mixed to masters (implies Juniors alone)
        result[4]=true;
    }
    if(nbJuniors + nbSeniors >=6 && nbMasters >=6){
        // Masters may go alone
        result[3]=true;
    }
    return result;
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
/** When Swiss is chosen */
var onSwissEvent = function(evt){
    console.log("Swiss mode yeah");
    // TODO manage consequences on round calculation for players
    var form = document.querySelector('#pairing_system');
    var radio = form.querySelectorAll('input[name="pairing_top"]');
    radio[0].disabled = false;
    radio[1].disabled = false;
    if(radio[0].checked){ // If there are tops, select next options
        radio = form.querySelectorAll('input[name="small_final"]');
        radio[0].disabled = false;
        radio[1].disabled = false;
        /*
        radio = form.querySelectorAll('input[name="day2"]');
        radio[0].disabled = false;
        radio[1].disabled = false;
        //*/
    }else{
        radio = form.querySelectorAll('input[name="small_final"]');
        radio[0].disabled = true;
        radio[1].disabled = true;
    }
};
var onSingleEvent = function(evt){
    console.log("Single Elimination mode yeah");
    // TODO manage consequences on round calculation for players
    var form = document.querySelector('#pairing_system');
    var radio = form.querySelectorAll('input[name="pairing_top"]');
    radio[0].disabled = true;
    radio[1].disabled = true;
    radio = form.querySelectorAll('input[name="small_final"]');
    radio[0].disabled = false;
    radio[1].disabled = false;
    /*
    radio = form.querySelectorAll('input[name="day2"]');
    radio[0].disabled = true;
    radio[1].disabled = true;
    //*/
};
var onSwissTop = function(evt){
    var form = document.querySelector('#pairing_system');
    radio = form.querySelectorAll('input[name="small_final"]');
    radio[0].disabled = false;
    radio[1].disabled = false;
    /*
    radio = form.querySelectorAll('input[name="day2"]');
    radio[0].disabled = false;
    radio[1].disabled = false;
    //*/
    radio = form.querySelectorAll('input[name="less_round"]');
    radio[0].disabled = false;
    radio[1].disabled = false;
}
var onSwissNoTop = function(evt){
    var form = document.querySelector('#pairing_system');
    radio = form.querySelectorAll('input[name="small_final"]');
    radio[0].disabled = true;
    radio[1].disabled = true;
    /*
    radio = form.querySelectorAll('input[name="day2"]');
    radio[0].disabled = true;
    radio[1].disabled = true;
    //*/
    radio = form.querySelectorAll('input[name="less_round"]');
    radio[0].disabled = true;
    radio[1].disabled = true;
}
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
/** Switches view.
 */
var playersToRecap = function(evt){
    // Count players and display relevant categories
    var nbJuniors = parseInt(document.querySelector('#reg_junior').innerHTML);
    var nbSeniors = parseInt(document.querySelector('#reg_senior').innerHTML);
    var nbMasters = parseInt(document.querySelector('#reg_master').innerHTML);
    var divisions = document.querySelectorAll('#divisions_recap li');
    var show = getDivisions(nbJuniors, nbSeniors, nbMasters);
    if(show[0]){
        divisions[0].style.display="block";
        divisions[0].querySelectorAll('span')[0].innerHTML = nbJuniors;
        divisions[0].querySelectorAll('input[type="number"]')[0].min="3";
        divisions[0].querySelectorAll('input[type="number"]')[0].max="3";
        //divisions[0].querySelectorAll('input[type="number"]')[0].value="3";
        // TODO calculate min and max for input
        // FIXME: TOM has strange behaviors…
    }else{
        divisions[0].style.display="none";
        divisions[0].querySelectorAll('span')[0].innerHTML = 0;
        divisions[0].querySelectorAll('input[type="number"]')[0].min="0";
        divisions[0].querySelectorAll('input[type="number"]')[0].max="0";
        divisions[0].querySelectorAll('input[type="number"]')[0].value="0";
    }
    if(show[1]){
        divisions[1].style.display="block";
        divisions[1].querySelectorAll('span')[0].innerHTML = nbSeniors;
    }else{
        divisions[1].style.display="none";
        divisions[1].querySelectorAll('span')[0].innerHTML = 0;
    }
    if(show[2]){
        divisions[2].style.display="block";
        divisions[2].querySelectorAll('span')[0].innerHTML = nbJuniors + nbSeniors;
    }else{
        divisions[2].style.display="none";
        divisions[2].querySelectorAll('span')[0].innerHTML = 0;
    }
    if(show[3]){
        divisions[3].style.display="block";
        divisions[3].querySelectorAll('span')[0].innerHTML = nbMasters;
    }else{
        divisions[3].style.display="none";
        divisions[3].querySelectorAll('span')[0].innerHTML = 0;
    }
    if(show[4]){
        divisions[4].style.display="block";
        divisions[4].querySelectorAll('span')[0].innerHTML = nbSeniors + nbMasters;
    }else{
        divisions[4].style.display="none";
        divisions[4].querySelectorAll('span')[0].innerHTML = 0;
    }
    if(show[5]){
        divisions[5].style.display="block";
        divisions[5].querySelectorAll('span')[0].innerHTML = nbJuniors + nbSeniors + nbMasters;
    }else{
        divisions[5].style.display="none";
        divisions[5].querySelectorAll('span')[0].innerHTML = 0;
    }
    // Update view
    document.querySelector('#recap').style.display="block";
    document.querySelector('#add_players').style.display="none";
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

document.querySelector('#radio_swiss').addEventListener('click',onSwissEvent);
document.querySelector('#radio_swiss').addEventListener('touchend',onSwissEvent);
document.querySelector('#radio_single').addEventListener('click',onSingleEvent);
document.querySelector('#radio_single').addEventListener('touchend',onSingleEvent);
document.querySelector('#pairing_top_yes').addEventListener('click',onSwissTop);
document.querySelector('#pairing_top_yes').addEventListener('touchend',onSwissTop);
document.querySelector('#pairing_top_no').addEventListener('click',onSwissNoTop);
document.querySelector('#pairing_top_no').addEventListener('touchend',onSwissNoTop);

