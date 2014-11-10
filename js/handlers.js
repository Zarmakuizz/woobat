// Event handlers
// first form view: enter data about the tournament
document.querySelector('#id_form').action="javascript:void(0);";
document.querySelector('#id_form_submit').addEventListener('click', idToPlayers);
document.querySelector('#id_form_submit').addEventListener('touchend', idToPlayers);

// second form view: players management
var KnownList = new PlayerList('#known tbody');
var RegisteredList = new PlayerList('#registered tbody');
KnownList.setEvent(playerKnownSelect);

var thead = document.querySelectorAll('#known thead th');
thead[0].addEventListener('click',function(e){KnownList.sortByPid();});
thead[0].addEventListener('touchend',function(e){KnownList.sortByPid();});
thead[1].addEventListener('click',function(e){KnownList.sortByFirstName();});
thead[1].addEventListener('touchend',function(e){KnownList.sortByFirstName();});
thead[2].addEventListener('click',function(e){KnownList.sortByLastName();});
thead[2].addEventListener('touchend',function(e){KnownList.sortByLastName();});
thead[3].addEventListener('click',function(e){KnownList.sortByBirthDate();});
thead[3].addEventListener('touchend',function(e){KnownList.sortByBirthDate();});
thead[4].addEventListener('click',function(e){KnownList.sortByAgeGroup();});
thead[4].addEventListener('touchend',function(e){KnownList.sortByAgeGroup();});
thead = document.querySelectorAll('#registered thead th');
thead[0].addEventListener('click',function(e){KnownList.sortByPid();});
thead[0].addEventListener('touchend',function(e){KnownList.sortByPid();});
thead[1].addEventListener('click',function(e){KnownList.sortByFirstName();});
thead[1].addEventListener('touchend',function(e){KnownList.sortByFirstName();});
thead[2].addEventListener('click',function(e){KnownList.sortByLastName();});
thead[2].addEventListener('touchend',function(e){KnownList.sortByLastName();});
thead[3].addEventListener('click',function(e){KnownList.sortByBirthDate();});
thead[3].addEventListener('touchend',function(e){KnownList.sortByBirthDate();});
thead[4].addEventListener('click',function(e){KnownList.sortByAgeGroup();});
thead[4].addEventListener('touchend',function(e){KnownList.sortByAgeGroup();});
document.querySelector('#secret_load_players_xml').action="javascript:void(0);";
document.querySelector('#lpx_input').addEventListener('change', importPlayers);
document.querySelector('#load_players_xml').addEventListener('click',loadPlayerFile);
document.querySelector('#load_players_xml').addEventListener('touchend',loadPlayerFile);
document.querySelector('#export_players_xml').addEventListener('click',exportPlayers);
document.querySelector('#export_players_xml').addEventListener('touchend',exportPlayers);

document.querySelector('#add_player_form').action="javascript:void(0);";
document.querySelector('#add_form_submit').addEventListener('click', addFormPlayer);
document.querySelector('#add_form_submit').addEventListener('touchend', addFormPlayer);
// third and last form view: tournament configuration
var JuniorDivision = null;
var SeniorDivision = null;
var JuniorSeniorDivision = null;
var MasterDivision = null;
var SeniorMasterDivision = null;
var AllDivision = null;
document.querySelector('#radio_swiss').addEventListener('click',onSwissEvent);
document.querySelector('#radio_swiss').addEventListener('touchend',onSwissEvent);
document.querySelector('#radio_single').addEventListener('click',onSingleEvent);
document.querySelector('#radio_single').addEventListener('touchend',onSingleEvent);
document.querySelector('#pairing_top_yes').addEventListener('click',onSwissTop);
document.querySelector('#pairing_top_yes').addEventListener('touchend',onSwissTop);
document.querySelector('#pairing_top_no').addEventListener('click',onSwissNoTop);
document.querySelector('#pairing_top_no').addEventListener('touchend',onSwissNoTop);
document.querySelector('#small_final_yes').addEventListener('click',onSmallFinal);
document.querySelector('#small_final_yes').addEventListener('touchend',onSmallFinal);
document.querySelector('#small_final_no').addEventListener('click',onNoSmallFinal);
document.querySelector('#small_final_no').addEventListener('touchend',onNoSmallFinal);
document.querySelector('#less_round_yes').addEventListener('click',onLessRound);
document.querySelector('#less_round_yes').addEventListener('touchend',onLessRound);
document.querySelector('#less_round_no').addEventListener('click',onNormalRound);
document.querySelector('#less_round_no').addEventListener('touchend',onNormalRound);
