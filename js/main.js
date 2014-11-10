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


var addRegPlayer = function(player){
    RegisteredList.addPlayer(player);
    var totalPlayers = RegisteredList.getTotalPlayers();
    if(totalPlayers >= 8){
        document.querySelector('#players_to_recap').setAttribute('class','button ok');
        document.querySelector('#players_to_recap').innerHTML = "End registrations";
        document.querySelector('#players_to_recap').addEventListener('click', playersToRecap);
    }
    document.querySelector('#reg_total').innerHTML = totalPlayers;
    document.querySelector('#reg_junior').innerHTML = RegisteredList.getTotalPerGroup()[0];
    document.querySelector('#reg_senior').innerHTML = RegisteredList.getTotalPerGroup()[1];
    document.querySelector('#reg_master').innerHTML = RegisteredList.getTotalPerGroup()[2];
};
var addKnownPlayer = function(player){
    KnownList.addPlayer(player);
};

/** Class representing a list of players. May be used for both
    known players or registered players. 
    @param source The querySelector pointing the tbody to fill */
function PlayerList(source){
    var players = [];
    var evt = null;
    var view = document.querySelector(source);
    /** Adds a player to the player's list.
        @param player a Player object
        @returns true if insertion has been successful, false if a player with the same ID was already there */
    function addP(player){
        for(var i=0;i<players.length;i++){
            if(player.pid == players[i].pid){ return false};
        }
        players.push(player);
        sortP('pid');
        return true;
    }
    /** Removes a player to the player's list.
        @param player a Player object
        @returns true if deletion has been successful, false if the player wasn't in the list */
    function rmP(player){
        var id = players.indexOf(player);
        if(id < 0){ return false;}
        players.splice(id,1);
        return true;
    }
    function setE(e){
        evt = e;
    }
    /** Sort the player's list using a criteria.
        Inherited methods should update their views just after a sort, if they are in charge of any view listing players.
        @param criteria A string with one of a Player's attribute
        */
    function sortP(criteria){
        switch(criteria){
            case "firstName":
                players.sort(function(a,b){return a.firstName.toLowerCase() < b.firstName.toLowerCase();});
                break;
            case "lastName":
                players.sort(function(a,b){return a.lastName.toLowerCase() < b.lastName.toLowerCase();});
                break;
            case "birthDate":
                // TODO is birthdate a Date object?
                break;
            case "ageGroup":
                players.sort(function(a,b){
                    return  (a.ageGroup == 'Master')
                        ||  (a.ageGroup == 'Senior' && b.ageGroup != 'Master');
                });
                break;
            case "pid":
            default:
                players.sort(function(a,b){return a.pid - b.pid;});
                break;
        }
    }
    /** Import players from XML 
        TODO */
    function importP(){
        // TODO
    };
    /** Export players for a XML file
        TODO */
    function exportP(){
        // TODO
    };
    /** Updates the view with the current state of the list*/
    function updateView(){
        // Clean the view
        while(view.firstChild){
            view.removeChild(view.firstChild);
        }
        players.forEach(function(player, index, array){
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.innerHTML = player.pid;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = player.firstName;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = player.lastName;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = player.birthDate;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = player.ageGroup;
            tr.appendChild(td);
            if(evt != null && evt != undefined){
                tr.addEventListener('click', evt);
                tr.addEventListener('touchend', evt);
            }
            view.appendChild(tr);
        });
    };
    return {
        addPlayer:   function(player){ addP(player); updateView();},
        removePlayer:function(player){ rmP(player);         updateView();},
        setEvent:    function(evt)   { setE(evt);           updateView();},
        sortByPid:         function(){ sortP('pid');        updateView();},
        sortByFirstName:   function(){ sortP('firstName');  updateView();},
        sortByLastName:    function(){ sortP('lastName');   updateView();},
        sortByBirthDate:   function(){ sortP('birthDate');  updateView();},
        sortByAgeGroup:    function(){ sortP('ageGroup');   updateView();},
        getTotalPlayers:   function(){ return players.length},
        getTotalPerGroup:  function(){ return [
            players.filter(function(p){return p.ageGroup == 'Junior';}).length,
            players.filter(function(p){return p.ageGroup == 'Senior';}).length,
            players.filter(function(p){return p.ageGroup == 'Master';}).length]},
        getEvent:          function(){ return evt;                       },
        importPlayers:     function(){ importP();                        },
        exportPlayers:     function(){ exportP();                        }
    }
};
/** Class representing an element of the list of possible age divisions.
    AgeDivision's constructor also initializes the relevant number of rounds.
 */
function AgeDivision(){
    this.setup = function(nbPlayers, roundMode, hasTops){
        this.nbJuniors = 0;
        this.nbSeniors = 0;
        this.nbMasters = 0;
        this.nbPlayers = nbPlayers;
        this.roundMode = roundMode;
        this.hasTops = hasTops;
        this.nbRounds = 0; // number of rounds
        this.hasDay2 = false; // whether you take the bests players from day 1 swiss and make them play a new set of rounds
        this.day2Rounds = 0; // number of rounds from the "day 2" tournament
        this.hasTops = false; // whether there are tops or not.
        this.nbRoundsTop = 0; // number of rounds in tops. number of players in tops is 2^nbRoundsTop.
        if(roundMode == "single"){
            var i=0;
            do{i++}while(nbPlayers/Math.pow(2,i) > 1.0);
            this.nbRoundsTop=0;
            this.nbRounds = i;
            this.hasTops = false;
            this.hasDay2 = false;
        }else if(roundMode == "swiss"){
            if(nbPlayers <= 8){
                this.nbRounds = 3;
                this.nbRoundsTop = 0;
                this.hasTops = false;
                this.hasDay2 = false;
                this.day2Rounds = 0;
            }else if(nbPlayers <= 12){
                this.nbRounds = 4;
                this.hasTops = hasTops;
                this.nbRoundsTop = (hasTops ? 2 : 0);
                this.hasDay2 = false;
                this.day2Rounds = 0;
            }else if(nbPlayers <= 20){
                this.nbRounds = 5;
                this.nbRoundsTop = (hasTops ? 2 : 0);
                this.hasDay2 = false;
                this.day2Rounds = 0;
            }else if(nbPlayers <= 32){
                this.nbRounds = 5;
                this.nbRoundsTop = (hasTops ? 3 : 0);
                this.hasDay2 = false;
                this.day2Rounds = 0;
            }else if(nbPlayers <= 64){
                this.nbRounds = 6;
                this.nbRoundsTop = (hasTops ? 3 : 0);
                this.hasDay2 = false;
                this.day2Rounds = 0;
            }else if(nbPlayers <= 128){
                this.nbRounds = 7;
                this.nbRoundsTop = (hasTops ? 3 : 0);
                this.hasDay2 = false;
                this.day2Rounds = 0;
            }else if(nbPlayers <= 226){
                this.nbRounds = 8;
                this.nbRoundsTop = (hasTops ? 3 : 0);
                this.hasDay2 = false;
                this.day2Rounds = 0;
            }else if(nbPlayers <= 409){
                this.nbRounds = 9;
                this.nbRoundsTop = (hasTops ? 3 : 0);
                this.hasDay2 = true; // TODO it seems possible to make it a 1-day event
                this.day2Rounds = 5;
            }else{
                this.nbRounds = 10; // 9 if single day event
                // TODO the above isn't covered in case of no top
                this.nbRoundsTop = (hasTops ? 3 : 0);
                this.hasDay2 = true;// TODO it is possible to make it a 1-day event
                this.day2Rounds = 6;
            }
        }else{
            throw Error('We don\'t know which round mode you are talking about');
        }
    };
    this.playLess = function(){ this.nbRounds--;};
    this.playMore = function(){ this.nbRounds++;};
};
function AgeJunior(nbPlayers, roundMode, hasTops){
    AgeJunior.prototype.setup(nbPlayers, roundMode, hasTops);
    this.nbJuniors = nbPlayers;
    this.recap = function(){
        var result = this.nbPlayers + " Juniors will play "+this.nbRounds+ " rounds";
        if(this.hasDay2){
            result += " on day 1, followed by "+this.day2Rounds+" rounds on day 2,";
        }
        if(this.hasTops){
            result += " with a top"+Math.pow(2,this.nbRoundsTop)+".";
        }else{
            result += ".";
        }
        return result;
    };
}
AgeJunior.prototype = new AgeDivision();
function AgeSenior(nbPlayers, roundMode, hasTops){
    AgeSenior.prototype.setup(nbPlayers, roundMode, hasTops);
    this.nbSeniors = nbPlayers;
    this.recap = function(){
        var result = this.nbPlayers + " Seniors will play "+this.nbRounds+ " rounds";
        if(this.hasDay2){
            result += " on day 1, followed by "+this.day2Rounds+" rounds on day 2,";
        }
        if(this.hasTops){
            result += " with a top"+Math.pow(2,this.nbRoundsTop)+".";
        }else{
            result += ".";
        }
        return result;
    };
}
AgeSenior.prototype = new AgeDivision();
function AgeMaster(nbPlayers, roundMode, hasTops){
    AgeMaster.prototype.setup(nbPlayers, roundMode, hasTops);
    this.nbMasters = nbPlayers;
    this.recap = function(){
        var result = this.nbPlayers + " Masters will play "+this.nbRounds+ " rounds";
        if(this.hasDay2){
            result += " on day 1, followed by "+this.day2Rounds+" rounds on day 2,";
        }
        if(this.hasTops){
            result += " with a top"+Math.pow(2,this.nbRoundsTop)+".";
        }else{
            result += ".";
        }
        return result;
    };
}
AgeMaster.prototype = new AgeDivision();
function AgeJuniorSenior(nbJuniors, nbSeniors, roundMode, hasTops){
    // Only one of the two age divisions can be big enough to still have tops in swiss, despite being mixed to the other age division.
    if(nbJuniors > 8 && roundMode == "swiss"){
        AgeJuniorSenior.prototype.setup(nbJuniors, roundMode, hasTops);
    }else if(nbSeniors > 8 && roundMode == "swiss"){
        AgeJuniorSenior.prototype.setup(nbSeniors, roundMode, hasTops);
    }else if(roundMode == "single"){
        AgeJuniorSenior.prototype.setup(nbJuniors + nbSeniors, roundMode, hasTops);
    }else{
        AgeJuniorSenior.prototype.setup(nbJuniors, roundMode, false);
    }
    this.nbJuniors = nbJuniors;
    this.nbSeniors = nbSeniors;
    this.nbPlayers = nbJuniors + nbSeniors;
    this.recap = function(){
        var result = this.nbPlayers + " players ("+this.nbJuniors+" Juniors and "+this.nbSeniors+" Seniors) will play "+this.nbRounds+ " rounds";
        if(this.hasDay2){
            result += " on day 1, followed by "+this.day2Rounds+" rounds on day 2,";
        }
        if(this.hasTops){
            result += " with a top"+Math.pow(2,this.nbRoundsTop)+".";
        }else{
            result += ".";
        }
        return result;
    };
}
AgeJuniorSenior.prototype = new AgeDivision();
function AgeSeniorMaster(nbSeniors, nbMasters, roundMode, hasTops){
    // Only one of the two age divisions can be big enough to still have tops in swiss, despite being mixed to the other age division.
    if(nbSeniors > 8 && roundMode == "swiss"){
        AgeSeniorMaster.prototype.setup(nbSeniors, roundMode, hasTops);
    }else if(nbMasters > 8 && roundMode == "swiss"){
        AgeSeniorMaster.prototype.setup(nbMasters, roundMode, hasTops);
    }else if(roundMode == "single"){
        AgeSeniorMaster.prototype.setup(nbSeniors+nbMasters, roundMode, hasTops);
    }else{
        AgeSeniorMaster.prototype.setup(nbSeniors, roundMode, false);
    }
    this.nbSeniors = nbSeniors;
    this.nbMasters = nbMasters;
    this.nbPlayers = nbSeniors + nbMasters;
    this.recap = function(){
        var result = this.nbPlayers + " players ("+this.nbSeniors+" Seniors and "+this.nbMasters+" Masters) will play "+this.nbRounds+ " rounds";
        if(this.hasDay2){
            result += " on day 1, followed by "+this.day2Rounds+" rounds on day 2,";
        }
        if(this.hasTops){
            result += " with a top"+Math.pow(2,this.nbRoundsTop)+".";
        }else{
            result += ".";
        }
        return result;
    };
}
AgeSeniorMaster.prototype = new AgeDivision();
function AgeAll(nbJuniors, nbSeniors, nbMasters, roundMode, hasTops){
    // Only one of the two age divisions can be big enough to still have tops in swiss, despite being mixed to the other age division.
    if(nbJuniors > 8 && roundMode == "swiss"){
        AgeAll.prototype.setup(nbJuniors, roundMode, hasTops);
    }else if(nbSeniors > 8 && roundMode == "swiss"){
        AgeAll.prototype.setup(nbSeniors, roundMode, hasTops);
    }else if(nbMasters > 8 && roundMode == "swiss"){
        AgeAll.prototype.setup(nbMasters, roundMode, hasTops);
    }else if(roundMode == "single"){
        AgeAll.prototype.setup(nbJuniors+nbSeniors+nbMasters, roundMode, false);
    }else{
        AgeAll.prototype.setup(nbJuniors, roundMode, false);
    }
    this.nbJuniors = nbJuniors;
    this.nbSeniors = nbSeniors;
    this.nbMasters = nbMasters;
    this.nbPlayers = nbJuniors + nbSeniors + nbMasters;
    this.recap = function(){
        var result = this.nbPlayers + " players ("+this.nbJuniors+" Juniors, "+this.nbSeniors+" Seniors and "+this.nbMasters+" Masters) will play "+this.nbRounds+ " rounds";
        if(this.hasDay2){
            result += " on day 1, followed by "+this.day2Rounds+" rounds on day 2,";
        }
        if(this.hasTops){
            result += " with a top"+Math.pow(2,this.nbRoundsTop)+".";
        }else{
            result += ".";
        }
        return result;
    };
}
AgeAll.prototype = new AgeDivision();
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
    result[0]: Juniors
    result[1]: Seniors
    result[2]: Juniors&Seniors
    result[3]: Masters
    result[4]: Seniors&Masters
    result[5]: Juniors&Seniors&Masters
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
    if( (nbJuniors >= 6 && nbSeniors >= 6 && nbMasters >=6) ||
        (nbJuniors <= 6 && nbJuniors + nbSeniors >=6 && nbMasters >= 6) ||
        (nbSeniors >= 6 && nbJuniors + nbSeniors >=6 && nbMasters >= 6)){
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
/** Event fired when a player is added to the tournament
    using the add form. */ 
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
        var date = [parseInt(raw[0]),parseInt(raw[1]),parseInt([raw[2]])];
        // wrong month and day
        if(date[0] > 12 && date[1] > 12){return;}
        // days are the 1st argument - as things should be, but aren't in Murica
        if(date[0] > 12 && date[1] <=12){
            date = date.swapItems(0,1);
        }
        // Let's rebuild the raw before formatting the date
        raw[0] = pad(date[0],2);
        raw[1] = pad(date[1],2);
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
    // Update form
    var form = document.querySelector('#pairing_system');
    var radio = form.querySelectorAll('input[name="pairing_top"]');
    radio[0].disabled = false;
    radio[1].disabled = false;
    if(radio[0].checked){ // If there are tops, select next options
        radio = form.querySelectorAll('input[name="small_final"]');
        radio[0].disabled = false;
        radio[1].disabled = false;
        radio = form.querySelectorAll('input[name="less_round"]');
        radio[0].disabled = false;
        radio[1].disabled = false;
    }else{
        radio = form.querySelectorAll('input[name="small_final"]');
        radio[0].disabled = true;
        radio[1].disabled = true;
        radio = form.querySelectorAll('input[name="less_round"]');
        radio[0].disabled = true;
        radio[1].disabled = true;
    }
    // empty previous age divisions if any
    var divisions = document.querySelector('#divisions_recap');
    while(divisions.firstChild){
        divisions.removeChild(divisions.firstChild);
    }
    // Display relevant age divisions
    var ageCounts = RegisteredList.getTotalPerGroup()
    var categories = getDivisions(ageCounts[0],ageCounts[1],ageCounts[2]);
    var li = null;
    if(categories[0]){ // Juniors
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeJunior(ageCounts[0], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_jr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        JuniorDivision = manageAge;
    }
    if(categories[1]){ // Seniors
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeSenior(ageCounts[1], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_sr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        SeniorDivision = manageAge;
    }
    if(categories[2]){ // Juniors&Seniors
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeJuniorSenior(ageCounts[0], ageCounts[1], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_jrsr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        JuniorSeniorDivision = manageAge;
    }
    if(categories[3]){ // Masters
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeMaster(ageCounts[2], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_mr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        MasterDivision = manageAge;
    }
    if(categories[4]){ // Seniors&Masters
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeSeniorMaster(ageCounts[1], ageCounts[2], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_srmr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        SeniorMasterDivision = manageAge;
    }
    if(categories[5]){ // Juniors&Seniors&Masters
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeAll(ageCounts[0], ageCounts[1], ageCounts[2], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_jrsrmr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        AllDivision = manageAge;
    }
};
var onSingleEvent = function(evt){
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

    // empty previous age divisions if any
    var divisions = document.querySelector('#divisions_recap');
    while(divisions.firstChild){
        divisions.removeChild(divisions.firstChild);
    }
    // Display relevant age division: all categories mixed together
    var ageCounts = RegisteredList.getTotalPerGroup()
    radio = form.querySelectorAll('input[name="pairing_top"]');
    var manageAge = new AgeAll(ageCounts[0], ageCounts[1], ageCounts[2], 'single', radio[0].checked);
    radio = form.querySelectorAll('input[name="less_round"]');
    if(radio[0].checked){ manageAge.playLess();}
    li = document.createElement('li');
    li.setAttribute('id','division_jrsrmr');
    li.innerHTML = manageAge.recap();
    divisions.appendChild(li);
    AllDivision = manageAge;

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
    
    // empty previous age divisions if any
    var divisions = document.querySelector('#divisions_recap');
    while(divisions.firstChild){
        divisions.removeChild(divisions.firstChild);
    }
    // Display relevant age divisions
    var ageCounts = RegisteredList.getTotalPerGroup()
    var categories = getDivisions(ageCounts[0],ageCounts[1],ageCounts[2]);
    var li = null;
    if(categories[0]){ // Juniors
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeJunior(ageCounts[0], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_jr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        JuniorDivision = manageAge;
    }
    if(categories[1]){ // Seniors
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeSenior(ageCounts[1], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_sr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        SeniorDivision = manageAge;
    }
    if(categories[2]){ // Juniors&Seniors
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeJuniorSenior(ageCounts[0], ageCounts[1], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_jrsr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        JuniorSeniorDivision = manageAge;
    }
    if(categories[3]){ // Masters
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeMaster(ageCounts[2], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_mr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        MasterDivision = manageAge;
    }
    if(categories[4]){ // Seniors&Masters
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeSeniorMaster(ageCounts[1], ageCounts[2], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_srmr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        SeniorMasterDivision = manageAge;
    }
    if(categories[5]){ // Juniors&Seniors&Masters
        radio = form.querySelectorAll('input[name="pairing_top"]');
        var manageAge = new AgeAll(ageCounts[0], ageCounts[1], ageCounts[2], 'swiss', radio[0].checked);
        radio = form.querySelectorAll('input[name="less_round"]');
        if(radio[0].checked){ manageAge.playLess();}
        li = document.createElement('li');
        li.setAttribute('id','division_jrsrmr');
        li.innerHTML = manageAge.recap();
        divisions.appendChild(li);
        AllDivision = manageAge;
    }
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
    // Update view
    document.querySelector('#recap').style.display="block";
    document.querySelector('#add_players').style.display="none";
};
