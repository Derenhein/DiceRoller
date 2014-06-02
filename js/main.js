window.onload = function () {

	'use strict';

	console.log('main.js');

	var dsystem = {
		DiceSides: 100,
		Percentual: false,
		BaseSkill: 50,
		OpenRoll: true,
		BonusSkill: 0,
		HistoryBox: 'logbox',

		CriticalTreshold: 10,
		CriticalMultiplier: 2, //multiplicador de daño en crítico
		CriticalPierceArmor: true, //crítico ignora armadura

		SpecialRoll: true,
		SpecialRollMultiplier: 1.5,
		SpecialRollTreshold: 20,
		SpecialRollPierceArmor: true,

		EpicFail: true,
		EpicFailTreshold: 10,
		EpicFailMaxTreshold: 96, // límite máximo de la pífia
		EpicFailMinTreshold: 100 // límite mínimo de la pífia

	};

	var system = D(dsystem);

	var magik = {
			arcane : [ { Name: 'Arcane', Sides : 6, Fixed : 1, Rolls : 1 } ],
			fire : [ { Name: 'Fire', Sides: 10, Fixed : 0, Rolls : 1 } ],
			frost : [ { Name: 'Frost', Sides : 6, Fixed : 0, Rolls : 2 } ],
			electric : [ { Name: 'Electric', Sides : 4, Fixed : 4, Rolls : 1 } ],
			poison : [ { Name: 'Poison', Sides : 6, Fixed : 1, Rolls : 3 } ]
	};

	var armor = {
			physic : [ { Name: 'Physic', Sides : 6, Fixed : 2, Rolls : 1 } ],
			dmgreduction : [ { Name: 'Damage Reduction', Sides : 0, Fixed : 1, Rolls : 1 } ],
			arcane : [ { Name: 'Arcane', Sides : 8, Fixed : 1, Rolls : 3 } ],
			fire : [ { Name: 'Fire', Sides : 10, Fixed : 0, Rolls : 1 } ],
			frost : [ { Name: 'Frost', Sides : 6, Fixed : 0, Rolls : 2 } ],
			electric : [ { Name: 'Electric', Sides : 0, Fixed : 4, Rolls : 0 } ],
			poison : [ { Name: 'Poison', Sides : 0, Fixed : 1, Rolls : 0 } ]
		};


	var listenclick1 = document.getElementById('button1');
	var listenclick2 = document.getElementById('button2');
	var listenclick3 = document.getElementById('button3');
	var listenclick4 = document.getElementById('button4');
	var listenclick5 = document.getElementById('button5');
	var listenclick6 = document.getElementById('button6');
	var listenclick6 = document.getElementById('button6');

	var listencheckbox1 = document.getElementById('ChkTechDamage');

	listenclick1.addEventListener('click',function(){
		D(dsystem).roll(3,6,0);
	}, true);
	listenclick2.addEventListener('click',function(){

		dsystem.Percentual = false;
		/* dsystem.BaseSkill = 99;
		dsystem.CriticalTreshold = 20;
		dsystem.EpicFailTreshold = 10;*/
		//dsystem.EpicFailMaxTreshold = 96;

		//D(dsystem).skill(1,0,10,false);
		D(dsystem).skill(1,0,10,50,50);

	}, true);
	listenclick3.addEventListener('click',function(){
		system.Percentual = true;

		//var SkillResult = D(dsystem).skill(1,0,10,false,false);

		var DmgResult = system.damage({
			Sides : [ 100, 100, 8, 4 ],
			ModDamage: [ 20, -25, -1, -3 ],
			Rolls: [ 2, 1, 2, 1 ],
			TypeDamage:['Physic', 'arcane', 'fire', 'poison']
		},
			system.skill(1,0,10,false,false), true);

		system.armor(armor, DmgResult, true);

	}, true);
	listenclick4.addEventListener('click',function(){
		/**
		 * [magic_damage description]
		 * @type {[type]}
		 */
		//Completo, considera también el ataque físico
		var magic_damage = D(dsystem).magic({
			Sides : [ 100, 100, 8, 4 ],
			ModDamage: [ 20, -25, -1, 0 ],
			Rolls: [ 2, 1, 2, 1 ]
		}, true, magik, true);
		//Sólo magia
		//var magic_damage = D(dsystem).magic(false, false, magik, true);
	}, true);

	/**
	 * Insert new types of magic damage if your game need it
	 * in this case, tech damage propertie is inserted into "magik" variable
	 * and initialized to 0
	 */

	magik['DamageTechDice'] = 0;
	magik['DamageTechFixed'] = 0;
	magik['DamageTechRoll'] = 0;

	//console.log(magik);

	document.getElementById('DamageTechDice').onblur = function(){
		magik.DamageTechDice = this.value;
		console.log(magik.DamageTechDice);
	};
	document.getElementById('DamageTechFixed').onblur = function(){
		magik.DamageTechFixed = this.value;
		console.log(magik.DamageTechFixed);
	};
	document.getElementById('DamageTechRoll').onblur = function(){
		magik.DamageTechRoll = this.value;
		console.log(magik.DamageTechRoll);
	};


	listencheckbox1.addEventListener('change', function(){
		console.log(this.checked);
		console.log(this.id);

		if( this.checked === true ) {
			magik['DamageTechDice'] = +document.getElementById('DamageTechDice').value;
			magik['DamageTechFixed'] = +document.getElementById('DamageTechFixed').value;
			magik['DamageTechRoll'] = +document.getElementById('DamageTechRoll').value;
		}

	});

	listenclick5.addEventListener('click', function(){

		system.damage({
			Sides : 100,
			ModDamage: 10,
			Rolls: 1
		},
			system.skill(1,0,10,false,false), true);

	}, true);

	listenclick6.addEventListener('click', function(){

		/**
		 * damage result format
		 *
		 * RollsObj = {
			Roll : RollResult[0],
			Critical : true,
			Special: false,
			EpicFail: false,
			Fail: false
		};
		 */

		var DmgResult = {
			Roll : 20,
			Critical : true,
			Special: false,
			EpicFail: false,
			Fail: false
		};

		system.armor(armor, DmgResult, true);

	});

};