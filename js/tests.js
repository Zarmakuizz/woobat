function AgeDivisionSuite(){

	/** Test case with enough juniors to run on their own, but less than 6 seniors
		so that they are supposed to be mixed with the masters.
		*/
	function testSeniorMaster(){
		jsUnity.log("########## TESTS AGE DIVISIONS WITH SENIORS AND MASTERS MIXED ##########")
		// init
		var i=10;
		var RegisteredList = new PlayerList('#registered tbody');
		var d = new Date();
		for(i=10;i<21;i++){ // Setup 11 juniors -> 4 rounds top4
			var p = new Player(i,"jor"+i,"Junior","01/01/"+(d.getFullYear() -5));
			RegisteredList.addPlayer(p);
		};
		for(i=100;i<105;i++){ // Setup 5 seniors -> mixed
			var p = new Player(i,"sure"+i,"Senior","03/03/"+(d.getFullYear() -12));
			RegisteredList.addPlayer(p);
		};
		for(i=1000;i<1008;i++){ // Setup 8 masters -> mixed 3 rounds
			var p = new Player(i,"makeitreal"+i,"Master","10/10/"+(d.getFullYear() -20));
			RegisteredList.addPlayer(p);
		};
		// In single elimination, this makes a total of 24 players => 5 rounds

		var ageGroups = RegisteredList.getTotalPerGroup();
		jsUnity.log("check the number of juniors, seniors ans masters")
		assertTrue(11 == ageGroups[0]);
		assertTrue(5  == ageGroups[1]);
		assertTrue(8  == ageGroups[2]);
		jsUnity.log("checks done.")
		var divisions = getDivisions(ageGroups[0],ageGroups[1],ageGroups[2]);
		jsUnity.log("check if Juniors is selected");
		assertTrue(divisions[0]); // Juniors
		jsUnity.log("check if Seniors is unselected");
		assertFalse(divisions[1]); // Seniors
		jsUnity.log("check if Juniors&Seniors is unselected");
		assertFalse(divisions[2]); // Juniors&Seniors
		jsUnity.log("check if Masters is unselected");
		assertFalse(divisions[3]); // Masters
		jsUnity.log("check if Seniors&Masters is selected");
		assertTrue(divisions[4]); // Seniors&Masters
		jsUnity.log("check if Juniors&Seniors&Masters is unselected");
		assertFalse(divisions[5]); // Juniors&Seniors&Masters
		jsUnity.log("checks done");


		var juniors = new AgeJunior(ageGroups[0], 'swiss', true);
		var srmr 	= new AgeSeniorMaster(ageGroups[1], ageGroups[2], 'swiss', true);
		var all  	= new AgeAll(ageGroups[0],ageGroups[1],ageGroups[2],'single',false);

		jsUnity.log("check if the recaps are good.");
		jsUnity.log("check the junior swiss recap : number of players");
		assertTrue(11 == juniors.nbPlayers);
		jsUnity.log("check the junior swiss recap : number of rounds");
		assertTrue(4 == juniors.nbRounds);
		jsUnity.log("check the junior swiss recap : number of rounds in top");
		assertTrue(2 == juniors.nbRoundsTop);
		jsUnity.log("check the junior swiss recap : if there are tops");
		assertTrue(juniors.hasTops);
		jsUnity.log("check the junior swiss recap : if there is a day2");
		assertFalse(juniors.hasDay2);

		jsUnity.log("check the sr&mr swiss recap : number of players");
		assertTrue(13 == srmr.nbPlayers);
		assertTrue(5  == srmr.nbSeniors);
		assertTrue(8  == srmr.nbMasters);
		jsUnity.log("check the sr&mr swiss recap : number of rounds");
		assertTrue(3 == srmr.nbRounds);
		jsUnity.log("check the sr&mr swiss recap : if there are tops");
		assertFalse(srmr.hasTops);
		jsUnity.log("check the sr&mr swiss recap : if there is a day2");
		assertFalse(srmr.hasDay2);
		
		jsUnity.log("check the all single recap : number of players");
		assertTrue(24 == all.nbPlayers);
		assertTrue(11 == all.nbJuniors);
		assertTrue(5  == all.nbSeniors);
		assertTrue(8  == all.nbMasters);
		jsUnity.log("check the all single recap : number of rounds");
		assertTrue(5 == all.nbRounds);
		jsUnity.log("check the all single recap : if there are tops");
		assertFalse(all.hasTops);
		jsUnity.log("check the all single recap : if there is a day2");
		assertFalse(all.hasDay2);
		jsUnity.log("checks done.")
	};
/** Test case with enough players in each division. */
	function testSeparated(){
		jsUnity.log("########## Tests separated categories ##########")
		// init
		var i=10;
		var RegisteredList = new PlayerList('#registered tbody');
		var d = new Date();
		for(i=10;i<20;i++){ // Setup 10 juniors -> 4 rounds top4
			var p = new Player(i,"jor"+i,"Junior","01/01/"+(d.getFullYear() -5));
			RegisteredList.addPlayer(p);
		};
		for(i=100;i<112;i++){ // Setup 12 seniors -> 4 rounds top4
			var p = new Player(i,"sure"+i,"Senior","03/03/"+(d.getFullYear() -12));
			RegisteredList.addPlayer(p);
		};
		for(i=1000;i<1030;i++){ // Setup 30 masters -> 5 rounds top8
			var p = new Player(i,"makeitreal"+i,"Master","10/10/"+(d.getFullYear() -20));
			RegisteredList.addPlayer(p);
		};
		// In single elimination, this makes a total of 52 players => 6 rounds

		var ageGroups = RegisteredList.getTotalPerGroup();
		jsUnity.log("check the number of juniors, seniors ans masters")
		assertTrue(10 == ageGroups[0]);
		assertTrue(12 == ageGroups[1]);
		assertTrue(30 == ageGroups[2]);
		jsUnity.log("checks done.")
		var divisions = getDivisions(ageGroups[0],ageGroups[1],ageGroups[2]);
		jsUnity.log("check if Juniors is selected");
		assertTrue(divisions[0]); // Juniors
		jsUnity.log("check if Seniors is selected");
		assertTrue(divisions[1]); // Seniors
		jsUnity.log("check if Juniors&Seniors is unselected");
		assertFalse(divisions[2]); // Juniors&Seniors
		jsUnity.log("check if Masters is selected");
		assertTrue(divisions[3]); // Masters
		jsUnity.log("check if Seniors&Masters is unselected");
		assertFalse(divisions[4]); // Seniors&Masters
		jsUnity.log("check if Juniors&Seniors&Masters is unselected");
		assertFalse(divisions[5]); // Juniors&Seniors&Masters
		jsUnity.log("checks done");


		var juniors = new AgeJunior(ageGroups[0], 'swiss', true);
		var seniors = new AgeSenior(ageGroups[1], 'swiss', true);
		var masters = new AgeMaster(ageGroups[2], 'swiss', true);
		var all  	= new AgeAll(ageGroups[0],ageGroups[1],ageGroups[2],'single',false);

		jsUnity.log("check if the recaps are good.");
		jsUnity.log("check the junior swiss recap : number of players");
		assertTrue(10 == juniors.nbPlayers);
		jsUnity.log("check the junior swiss recap : number of rounds");
		assertTrue(4 == juniors.nbRounds);
		jsUnity.log("check the junior swiss recap : number of rounds in top");
		assertTrue(2 == juniors.nbRoundsTop);
		jsUnity.log("check the junior swiss recap : if there are tops");
		assertTrue(juniors.hasTops);
		jsUnity.log("check the junior swiss recap : if there is a day2");
		assertFalse(juniors.hasDay2);

		jsUnity.log("check the senior swiss recap : number of players");
		assertTrue(12 == seniors.nbPlayers);
		jsUnity.log("check the senior swiss recap : number of rounds");
		assertTrue(4 == seniors.nbRounds);
		jsUnity.log("check the senior swiss recap : number of rounds in top");
		assertTrue(2 == seniors.nbRoundsTop);
		jsUnity.log("check the senior swiss recap : if there are tops");
		assertTrue(seniors.hasTops);
		jsUnity.log("check the senior swiss recap : if there is a day2");
		assertFalse(seniors.hasDay2);

		jsUnity.log("check the master swiss recap : number of players");
		assertTrue(30 == masters.nbPlayers);
		jsUnity.log("check the master swiss recap : number of rounds");
		assertTrue(5 == masters.nbRounds);
		jsUnity.log("check the master swiss recap : number of rounds in top");
		assertTrue(3 == masters.nbRoundsTop);
		jsUnity.log("check the master swiss recap : if there are tops"+masters.recap());
		assertTrue(masters.hasTops);
		jsUnity.log("check the master swiss recap : if there is a day2");
		assertFalse(masters.hasDay2);
		
		jsUnity.log("check the all single recap : number of players");
		assertTrue(52 == all.nbPlayers);
		assertTrue(10 == all.nbJuniors);
		assertTrue(12 == all.nbSeniors);
		assertTrue(30 == all.nbMasters);
		jsUnity.log("check the all single recap : number of rounds");
		assertTrue(6 == all.nbRounds);
		jsUnity.log("check the all single recap : if there are tops");
		assertFalse(all.hasTops);
		jsUnity.log("check the all single recap : if there is a day2");
		assertFalse(all.hasDay2);
		jsUnity.log("checks done.")
	};

	function tearDown(){
		jsUnity.log("########## TEAR DOWN ##########");
		var buddy = document.querySelector('#registered tbody');
		while(buddy.firstChild){
			buddy.removeChild(buddy.firstChild);
		}
	}
};
var results = jsUnity.run(AgeDivisionSuite);
jsUnity.log = function (s) { document.querySelectorAll('p')[0].innerHTML += s + "</br>"; };
jsUnity.attachAssertions();
jsUnity.run(AgeDivisionSuite);
