/* Well, first my apologies for my english, as is not my first languaje, and can be
 * very weird sometimes (and google translator may help, but sometimes can be... ridiculous).
 *
 * This libray is written in javascript (no plugins), as a learning proyect, i never code before
 * (not at this grade).
 *
 * Be prepared...
 *
 * Faulty code is coming!!
 *
 * P.D: eventually, all coments will be translated to english, sometimes, is easyer for me
 * doing at first in spanish.
 */

;(function (window, undefined) {
	'use strict';

	console.log('diceroller.js');

	var D = function (params) {

		if (!params) {
			//console.log("no params");

			var	ParamsDefault = {

					DiceSides				: 100,
					Percentual				: true,
					BaseSkill				: 0,
					OpenRoll				: false,
					BonusSkill				: 0,
					HistoryBox				: 'RollBox',
					CriticalTreshold		: 0,
					CriticalMultiplier		: 2,
					CriticalPierceArmor		: false,
					SpecialRoll				: false,
					SpecialRollMultiplier	: 1,
					SpecialRollTreshold		: 0,
					SpecialRollPierceArmor	: false,
					EpicFail				: true,
					EpicFailTreshold		: 0,
					EpicFailMaxTreshold		: 100,
					EpicFailMinTreshold		: 100

				};

			params = ParamsDefault;
		}

		return new Libs(params);
	};

	var Libs = function (params) {


		/**
		 * Standar dice sides. Set 6 for a six sides dice, 100 for a D100, 8 for a D8, etc
		 * This sets the main dice for the game system.
		 * @type {[integer]}
		 */
		this.DiceSides                = params.DiceSides;

		/**
		 * On true setted, means "params.DiceSides" is set to 100. Game system will setted
		 * to a percentual system, with rolls from 01% to 00 ( 100% ).
		 *
		 * If setted to false, means a game system difficulty like D&D, D6 system or MERPS
		 * @type boolean
		 */
		this.Percentual				= params.Percentual;

		/**
		 * Default punctuation of a skill for rolls setted to default.
		 * @type {integer}
		 */
		this.BaseSkill				= params.BaseSkill;

		/**
		 * Need to set some default bonus for the roll? maybe on this game scene all party
		 * have some bonifications in their skills
		 * @type {integer}
		 */
		this.BonusSkill				= params.BonusSkill;

		// Penalizado a la habilidad
		/**
		 * Same as BonusSkill, but with a penalty. Both (bonus and penalty) can be setted.
		 * @type {integer}
		 */
		this.BonusPenalty			= params.BonusPenalty;

		// Porcentaje de habilidad usada para crítico
		/**
		 * Used primary on game systems using a percentage from skill to find critical
		 * possibilities. Games like BRP or based in, uses a percentage like 10% of skill
		 *
		 * Example: Skill 50, Critical Treshold 10 (means 10%)
		 *
		 * 50/10 = 5, from 01 to 5 are critical rolls
		 *
		 * @type {[integer]}
		 */
		this.CriticalTreshold		= params.CriticalTreshold;

		// Multiplicador de daño en crítico
		/**
		 * Damage multiplier on crítical rolls. Setted by default to 2 as a "x2"
		 * damage multiplier.
		 *
		 * Set to 1 if don´t need damage multiplier
		 *
		 * @type {integer}
		 */
		this.CriticalMultiplier		= params.CriticalMultiplier;

		/**
		 * Critical hits in combat ignores armor? set to true.
		 *
		 * @type {number}
		 */
		this.CriticalPierceArmor	= params.CriticalPierceArmor;

		/**
		 * Some BRP editions or games based on it, uses a "better roll" system
		 * called "special". Set to true if need it on your game system.
		 *
		 * @type {[boolean]}
		 */
		this.SpecialRoll			= params.SpecialRoll;

		/**
		 * As critical, Special may augment damage from weapons. Setted by default
		 * with a +50% damage ( x1.5 )
		 *
		 * @type {[number]}
		 */
		this.SpecialRollMultiplier	= params.SpecialRollMultiplier;

		/**
		 * Pretty much like CriticalRollTreshold, better an example for undertand it
		 * Using CríticalRollTreshold as example:
		 *
		 * 50 / 10 = 5 as crítical
		 * 50 / 20 = 10 as special
		 *
		 * Means from 01 to 05 are crítical roll, but 06 to 10 are special. Not 06 to 10
		 *
		 * @type {integer}
		 */
		this.SpecialRollTreshold	= params.SpecialRollTreshold;

		/**
		 * Damage ignores armor on Special rolls? set to true
		 *
		 * @type {[boolean]}
		 */
		this.SpecialRollPierceArmor	= params.SpecialRollPierceArmor;

		/**
		 * What is better than a fail? an EPIC FAIL. Set to true for habilitate
		 * this feature
		 *
		 * @type {[boolean]}
		 */
		this.EpicFail				= params.EpicFail;

		/**
		 * As Critical Roll Treshold and Special, this is the percentage to find
		 * your Epic Fail
		 *
		 * Ok, is very inexact, cause as skill grow in punctuation, Epic Fail will too,
		 * need to rework a little.
		 *
		 * On a 50 base skill : 50 / 10 = 5, this is equal to 96% to 100% on a percentile
		 * system
		 *
		 * @type {[integer]}
		 */
		this.EpicFailTreshold		= params.EpicFailTreshold;

		/**
		 * As EpicFailTreshold may be innacurate, can be setted a range wiht
		 * epicFailMax Treshold.
		 *
		 * Using a example on percentile game system, a range between two numbers
		 * can be used as MaxTreshold 100 (00 on a real dice roll) and 96.
		 *
		 * All rolls between 96 and 100 are Epic Fail.
		 *
		 * For non range numbers (maybe only 00 on real dice?), set mínimal and max to 100
		 *
		 * @type {[integer]}
		 */
		this.EpicFailMaxTreshold	= params.EpicFailMaxTreshold;

		/**
		 * Read avobe for further explanation
		 *
		 * @type {[number]}
		 */
		this.EpicfailMinTreshold	= params.EpicfailMinTreshold;

		/**
		 * Some game system uses "open rolls". By default at the moment, this plugin
		 * only support MERP rules of open rolls.
		 *
		 * Open roll, means when a roll reaches certain range, dice will be rolled again,
		 * and the new result will be added to the first one.
		 * But if this new roll result is in the same range, is rolled again as many times
		 * as the result falls in the open roll range (and this ressults added to the first)
		 *
		 * @type {[boolean]}
		 */
		this.OpenRoll				= params.OpenRoll;

		/**
		 * Every method have a "show roll logs", putting all results, mods and information
		 * relative to in a div with an ID.
		 *
		 * This HTML ID can be defined here, or use default one 'RolBox'
		 *
		 * @type {[string]}
		 */
		this.HistoryBox				= params.HistoryBox;

		/**
		 * Well, this is the random number generator, usign javascript Math.random.
		 * May be isn´t the better random generator (or true random), may in the future
		 * improve it
		 *
		 * @param  {[integer]} sides [Sides of dice used to roll]
		 * @param  {[integer]} rolls [How many rolls]
		 * @return {[Array]}       	 [Returns an array with all dice rolls ]
		 */
		this.roller = function (sides, rolls){
			var Result			= [];

			if( sides === null ) sides = this.DiceSides;

			for(var i = 0; i < rolls; i++ ) {
				Result.push(1 + Math.floor( Math.random() * sides ));
			}

			return Result;
		};

		return this;
	};


	D.fn = Libs.prototype = {

		roll: function(rolls, sides, mod, critical) {

			var RolledDices	= 0,
				ID			= this.HistoryBox,
				d			= document.getElementById(ID),
				template	= document.createElement('p');

			if( sides === null || sides === '' || sides === undefined ) sides = this.DiceSides;
			if( mod === null || mod === '' || mod === undefined ) mod = 0;

			var RollResult = this.roller( sides, rolls );

			for (var i = RollResult.length - 1; i >= 0; i--) {

				RolledDices += +RollResult[i];

				if( i === RollResult.length-1 ) {
					template.innerHTML += ' &nbsp; <span class="lbox lbox-default">' + RollResult[i] + '</span>';
				} else {
					template.innerHTML += ' &nbsp; +  &nbsp; <span class="lbox lbox-default">' + RollResult[i] + '</span>';
				}
			}

			template.setAttribute('name', 'logrow');

			if( mod !== 0 ){
				RolledDices += mod;
				template.innerHTML += ' &nbsp; +  &nbsp; <span class="lbox lbox-warning">' + mod + '</span>';
				template.innerHTML += ' &nbsp; =  &nbsp; <span class="lbox lbox-success">' + RolledDices + '</span>';
			} else {
				template.innerHTML += ' &nbsp; =  &nbsp; <span class="lbox lbox-success">' + RolledDices + '</span>';
			}

			d.appendChild(template);

			return this;
		},
		skill: function(rolls, sides, mod, skill, difficulty ){

			if( sides === 0 || sides === undefined ) sides = this.DiceSides;
			if( skill === false || skill === undefined ) skill = this.BaseSkill;
			if( mod === 0 || mod === undefined ) mod = this.BonusSkill;
			if( difficulty === '' || difficulty === undefined || difficulty === false ) difficulty = 0;

			var RollResult		= this.roller( sides, rolls ),
				ModdedSkill		= skill + mod,
				d				= document.getElementById(this.HistoryBox),
				template		= document.createElement('p'),
				RollsObj		= {};

			var MySkill = {
				Critical : function() {
					var calc = Math.floor( ( skill + mod ) * ( this.CriticalTreshold / 100) );
					if ( calc <= 0 ) calc = 1;

					return calc;
				}.bind(this),
				EpicFail : function() {
					var calc = Math.floor( ( skill + mod ) * ( this.EpicFailTreshold / 100) );
					calc = 100 - calc;
					if ( calc < this.EpicFailMaxTreshold ) calc = this.EpicFailMaxTreshold;

					return calc;
				}.bind(this),
				SpecialRoll : function() {
					var calc		= Math.floor( ( skill + mod ) * ( this.SpecialRollTreshold / 100 )),
						MinSpecial	= calc - MySkill.Critical() +1;

					return {
						MinSpecial: MinSpecial,
						MaxSpecial: calc
					};
				}.bind(this)
			};

			if( this.Percentual ) {
				console.log('BRP');

				var	SpecialResult = MySkill.SpecialRoll();

				/**
				 * BRP like System
				 * 01 Always crítical roll, some editios uses 5% of base skill for crítical treshold.
				 * 00 Always epic fail, some editios uses 5% of base skill for epic fail treshold.
				 *
				 * BRP uses "special" roll, about 20% of base skill.
				 * RQ6 don´t have "special" roll
				 */

				if( RollResult <= MySkill.Critical() && RollResult !== 0 ) {

					template.innerHTML	= '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						template.innerHTML += '&nbsp; <span class="lbox lbox-default">Roll Mod: ' + mod +'</span>';

					} else {
						template.innerHTML += '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					template.innerHTML += 	'&nbsp; <span class="lbox lbox-success">' + RollResult + '&nbsp; Critical! </span>';

					RollsObj = {
						Roll : RollResult[0],
						Critical : true,
						Special: false,
						EpicFail: false,
						Fail: false
					};

				} else if ( RollResult >= SpecialResult.MinSpecial &&
							RollResult <= SpecialResult.MaxSpecial &&
							this.SpecialRoll ) {

					template.innerHTML	= '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						template.innerHTML += '&nbsp; <span class="lbox lbox-default">Roll Mod: ' + mod +'</span>';

					} else {
						template.innerHTML += '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					template.innerHTML += 	'&nbsp; <span class="lbox lbox-success">' + RollResult + '&nbsp; Special! </span>';

					RollsObj = {
						Roll : RollResult[0],
						Critical : false,
						Special: true,
						EpicFail: false,
						Fail: false
					};

				} else if ( RollResult >= MySkill.EpicFail() ) {

					template.innerHTML	= '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						template.innerHTML += '&nbsp; <span class="lbox lbox-default">Roll Mod: ' + mod +'</span>';

					} else {
						template.innerHTML += '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					template.innerHTML += 	'&nbsp; <span class="lbox lbox-danger">' + RollResult + '&nbsp; Epic Fail! </span>';

					RollsObj = {
						Roll : RollResult[0],
						Critical : false,
						Special: false,
						EpicFail: true,
						Fail: true
					};

				} else if ( RollResult <= ModdedSkill ) {

					template.innerHTML	= '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						template.innerHTML += '&nbsp; <span class="lbox lbox-default">Roll Mod: ' + mod +'</span>';

					} else {
						template.innerHTML += '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					template.innerHTML += 	'&nbsp; <span class="lbox lbox-success">' + RollResult + '&nbsp; Success! </span>';

					RollsObj = {
						Roll : RollResult[0],
						Critical : false,
						Special: false,
						EpicFail: false,
						Fail: false
					};

				} else {

					template.innerHTML	= '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						template.innerHTML += '&nbsp; <span class="lbox lbox-default">Roll Mod: ' + mod +'</span>';

					} else {
						template.innerHTML += '<span class="lbox lbox-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					template.innerHTML += 	'&nbsp; <span class="lbox lbox-danger">' + RollResult + '&nbsp; Fail! </span>';

					RollsObj = {
						Roll : RollResult[0],
						Critical : false,
						Special: false,
						EpicFail: false,
						Fail: true
					};

				}
			}
			if( !this.Percentual ) {
				console.log('MERP');
				/**
				 * MERP System
				 * 95 >= Open roll to crítical
				 * 05 <= Open roll to epic fail
				 */

				var RollArray	= [],
					ArraySum	= 0,
					i			= 0;

				if ( RollResult >= 96 ) {

					RollArray.push(RollResult[0]);

					CheckCritical:
					while ( true ) {

						RollResult = this.roller( sides, rolls );

						if ( RollResult >= 96 ){
							RollArray.push(RollResult[0]);
						} else {
							RollArray.push(RollResult[0]);
							break CheckCritical;
						}
					}

					for ( i =  0; i <= RollArray.length - 1; i++ ) {
						if( i === 0 ){
							template.innerHTML += ['<span class="lbox lbox-info"> Open Roll!</span>',
													'&nbsp; <span class="lbox lbox-default">',
													RollArray[i] + '</span>'
													].join('\n');
						} else {
							template.innerHTML += '&nbsp; + &nbsp; <span class="lbox lbox-default">' + RollArray[i] + '</span>';
						}
						ArraySum += parseInt(RollArray[i], 10);

					}
					if ( ( ArraySum + mod ) > difficulty ){

						if ( mod !== 0 && typeof mod === 'number' ) {

							ArraySum += mod;

							template.innerHTML += [	'&nbsp; + &nbsp; <span class="lbox lbox-default">Roll Mod ' + mod +'</span>',
													'&nbsp; &nbsp; <span class="lbox lbox-info">Difficulty ' + difficulty +'</span>',
													'&nbsp; = &nbsp; <span class="lbox lbox-success">'+ ArraySum +'</span>',
													'&nbsp; <span class="lbox lbox-warning">Critical Roll !!</span>'
												].join('\n');
						} else {

							template.innerHTML += [	'&nbsp; &nbsp; <span class="lbox lbox-info">Difficulty ' + difficulty +'</span>',
													'&nbsp; = &nbsp; <span class="lbox lbox-success">' + ArraySum,
													'</span> &nbsp; <span class="lbox lbox-warning">Critical Roll !!</span>'
												].join('\n');
						}
					} else {

						template.innerHTML += [	'&nbsp; + &nbsp; <span class="lbox lbox-default">Roll Mod ' + mod +'</span>',
												'&nbsp; &nbsp; <span class="lbox lbox-info">Difficulty ' + difficulty +'</span>',
												'&nbsp; = &nbsp; <span class="lbox lbox-danger">'+ ArraySum +'  &nbsp; Failed!</span>'
											].join('\n');
					}


				} else if ( RollResult <= 5 && RollResult !== 0 ) {
					/**
					 * la segunda tirada suma a la primera, pero si la segunda sacar
					 *  +96, el resultado resta a la primera (para ser más exacto)
					 */
					RollArray.push(RollResult[0]);

					CheckFail:
					while ( true ) {

						RollResult = this.roller( sides, rolls );

						if ( RollResult <= 96 && RollResult !== 0 ){
							RollArray.push(-RollResult[0]);
							break CheckFail;
						} else {
							RollArray.push(-RollResult[0]);
						}
					}

					for (i =  0; i <= RollArray.length - 1; i++) {
						if( +i === 0  ){
							template.innerHTML += [	'&nbsp; <span class="lbox lbox-info"> Open Roll!</span>',
													'&nbsp; <span class="lbox lbox-default">',
													RollArray[i] + '</span>'
												].join('\n');
						} else {
							template.innerHTML += '&nbsp; + &nbsp; <span class="lbox lbox-default">' + RollArray[i] + '</span>';
						}
						ArraySum += parseInt(RollArray[i], 10);

					}
					if ( mod !== 0 && typeof mod === 'number' ) {

						ArraySum += mod;

						template.innerHTML += [	'&nbsp; + &nbsp; <span class="lbox lbox-default">Roll Mod ' + mod +'</span>',
												'&nbsp; = &nbsp;<span class="lbox lbox-danger">'+ ArraySum ,
												'&nbsp; Epic Fail !!</span>'
											].join('\n');
					} else {

						template.innerHTML += [	'&nbsp; = &nbsp; <span class="lbox lbox-danger">' + ArraySum,
												'Epic Fail !!</span>'
											].join('\n');
					}


				} else {

					var RollResultVal = RollResult[0];

					template.innerHTML += [	'&nbsp; <span class="lbox lbox-info">Roll!</span>',
											'&nbsp; <span class="lbox lbox-default">'+ RollResult +'</span>'
										].join('\n');

					if ( mod !== 0 && typeof mod === 'number' ) {

						template.innerHTML += 	[	'&nbsp; + &nbsp; <span class="lbox lbox-default">Roll Mod ' + mod +'</span>',
													'&nbsp; &nbsp; <span class="lbox lbox-info">Difficulty ' + difficulty +'</span>'
												].join('\n');

						RollResultVal += mod;

						if ( ( RollResultVal + mod ) > difficulty ) {

							template.innerHTML += '&nbsp; = &nbsp; <span class="lbox lbox-success">'+ RollResultVal +' &nbsp; Roll Success</span>';

						} else {

							template.innerHTML += '&nbsp; = &nbsp; <span class="lbox lbox-danger">'+ RollResultVal +'  &nbsp; Failed!</span>';

						}

					} else {

							template.innerHTML += '&nbsp; &nbsp; <span class="lbox lbox-info">Difficulty ' + difficulty +'</span>';

						if ( RollResult > difficulty ) {

							template.innerHTML += '&nbsp; = &nbsp; <span class="lbox lbox-success">'+ RollResult +' &nbsp; Roll Success</span>';

						} else {

							template.innerHTML += '&nbsp; = &nbsp; <span class="lbox lbox-danger">'+ RollResult +'  &nbsp; Failed!</span>';

						}

					}

				}

			}

			d.appendChild(template);

			// Con esta línea de código, hacemos que el resultado no sea tapado por el overflow.
			d.scrollTop = d.scrollHeight;

			return RollsObj;
		},
		armor: function( ArmorParams, FullDamage ){
			var ID			= this.HistoryBox,
				d			= document.getElementById(ID),
				template	= document.createElement('p'),
				RollArmor	= [],
				TempArmor	= 0,
				FDamage		= 0;

			function PrepareObj( ArmorParams, FullDamage ){
				var obj1 = {},
					obj2 = {};

				for ( var params in ArmorParams ) {
					if ( ArmorParams.hasOwnProperty(params) ){
						for ( var params2 in ArmorParams[params]) {
							var key = ArmorParams[params][params2].Name.toLowerCase();
							obj1[key] = {
								Name	: ArmorParams[params][params2].Name.toLowerCase(),
								Sides	: ArmorParams[params][params2].Sides,
								Rolls	: ArmorParams[params][params2].Rolls,
								Fixed	: ArmorParams[params][params2].Fixed
							};
						}
					}
				}
				for ( var params in FullDamage ) {
					if ( FullDamage.hasOwnProperty(params) ){
						var key = FullDamage[params].TypeDamage.toLowerCase();
						obj2[key] = {
							Name	: FullDamage[params].TypeDamage.toLowerCase(),
							Sides	: FullDamage[params].Sides,
							Rolls	: FullDamage[params].Rolls,
							Damage	: FullDamage[params].Damage
						};
					}
				}
				return { ArmorParams : obj1, FullDamage : obj2 };
			}

			var NewObj					= PrepareObj( ArmorParams, FullDamage ),
				NewArmorParams			= NewObj.ArmorParams,
				NewFullDamage			= NewObj.FullDamage,
				TmpNewFullDamageArray	= 0;

			var Calc_MyDamage = function( dice, fixed, damage ) {
				if ( dice === undefined || dice === "" ) dice = 0;
				return ( dice + fixed ) - damage;
			}

			for( var paramskey in NewArmorParams ){
				if( NewArmorParams.hasOwnProperty( paramskey ) ) {
					for( var params in NewFullDamage ) {
						if( NewFullDamage.hasOwnProperty(params) ){

							RollArmor = this.roller( NewArmorParams[paramskey].Sides, NewArmorParams[paramskey].Rolls );

							try {
								if( NewArmorParams[paramskey].Name === NewFullDamage[params].Name &&
									NewArmorParams[paramskey].Sides > 0 &&
									NewArmorParams[paramskey].Rolls > 0
									) {

									template.innerHTML +=	[	'<span class="lbox lbox-info">'+ NewArmorParams[paramskey].Name +' Armor',
																'&nbsp; '+ NewArmorParams[paramskey].Rolls + 'd' + NewArmorParams[paramskey].Sides,
																'</span>'
														].join('\n');

									if( NewFullDamage[params].Damage.length > 1 ){

										TmpNewFullDamageArray = 0;

										for (var index = 0; index < NewFullDamage[params].Damage.length; index++) {
											TmpNewFullDamageArray += NewFullDamage[params].Damage[index];
										}
									}

									if( RollArmor.length > 1 ) {

										for ( var z = 0; z < RollArmor.length; z++ ) {
											TempArmor += parseInt( RollArmor[z], 10 );
										}
										template.innerHTML += [	'&nbsp : &nbsp<span class="lbox lbox-default">Dice Armor: ' + TempArmor + '</span>',
																'&nbsp + &nbsp<span class="lbox lbox-default">Fixed Armor: ' + NewArmorParams[paramskey].Fixed + '</span>'
															].join('\n');
										if ( NewFullDamage[params].Damage.length > 1 ){
											template.innerHTML += [	'&nbsp - &nbsp<span class="lbox lbox-warning">Damage incoming: ' + TmpNewFullDamageArray + '</span>',
																	'&nbsp = &nbsp<span class="lbox lbox-success"> Total: ' + Calc_MyDamage(TempArmor, NewArmorParams[params].Fixed, TmpNewFullDamageArray ),
																	'</span></br>'
																].join('\n');
										} else {
											template.innerHTML += [	'&nbsp - &nbsp<span class="lbox lbox-warning">Damage incoming: ' + NewFullDamage[params].Damage + '</span>',
																	'&nbsp = &nbsp<span class="lbox lbox-success"> Total: ' + Calc_MyDamage(TempArmor, NewArmorParams[params].Fixed, NewFullDamage[params].Damage ),
																	'</span></br>'
																].join('\n');
										}
										TempArmor = 0;
									} else {
										template.innerHTML += [	'&nbsp : &nbsp<span class="lbox lbox-default">Dice Armor: ' + RollArmor + '</span>',
																'&nbsp + &nbsp<span class="lbox lbox-default">Fixed Armor: ' + NewArmorParams[paramskey].Fixed + '</span>'
																].join('\n');
										if ( NewFullDamage[params].Damage.length > 1 ){
											template.innerHTML += [	'&nbsp - &nbsp<span class="lbox lbox-warning">Damage incoming: ' + TmpNewFullDamageArray + '</span>',
																'&nbsp = &nbsp<span class="lbox lbox-success"> Total: ' + Calc_MyDamage(RollArmor, NewArmorParams[params].Fixed, TmpNewFullDamageArray),
																'</span></br>'
															].join('\n');
										} else {
											template.innerHTML += [	'&nbsp - &nbsp<span class="lbox lbox-warning">Damage incoming: ' + NewFullDamage[params].Damage + '</span>',
																'&nbsp = &nbsp<span class="lbox lbox-success"> Total: ' + Calc_MyDamage(RollArmor, NewArmorParams[params].Fixed, NewFullDamage[params].Damage),
																'</span></br>'
															].join('\n');
										}
									} //else

								} else if ( NewArmorParams[paramskey].Rolls === 0 &&
											NewArmorParams[paramskey].Sides === 0 &&
											NewArmorParams[paramskey].Fixed > 0 &&
											NewArmorParams[paramskey].Name === NewFullDamage[params].Name ){

									template.innerHTML += [			'<span class="lbox lbox-info">'+ NewArmorParams[params].Name +' Armor </span>',
																	'&nbsp<span class="lbox lbox-default">Fixed Armor: ' + NewArmorParams[params].Fixed + '</span>',
																	'&nbsp + &nbsp<span class="lbox lbox-warning">Damage incoming: ' + NewFullDamage[paramskey].Damage + '</span>',
																	'&nbsp = &nbsp<span class="lbox lbox-success"> Total: ' + ( NewArmorParams[params].Fixed -  NewFullDamage[paramskey].Damage),
																	'</span></br>'
																].join('\n');
								}
								else if ( NewArmorParams[paramskey].Name !== NewFullDamage[params].Name) {
									continue;
								}

							} catch (event) {
									console.log(event);
							} //catch
						}
					}

				} // if NewFulldamage
			} // for NewFulldamage


			d.appendChild(template);

			d.scrollTop = d.scrollHeight;

			return this;
		},
		/**
		 * damage method:
		 *
		 * This method ONLY works with generic damage (physical). Another form of damage like
		 * elemental or magic isn´t applied here.
		 */
		damage: function( params, ParamsSkill, showlog ){

			var DamageRollResult		= [],
				ID						= this.HistoryBox,
				d						= document.getElementById(ID),
				template				= document.createElement('p'),
				SumRolls				= 0,
				FullDamage				= {},
				SumDamage				= 0,
				SumDamageArray			= [],
				FinalDamage				= 0,
				DataDamage				= 0,
				SplitedDamage			= 0,
				self					= this;

			/**
			 * Modify_Roll_Dice : función que nos permite modificar la plantilla que muestra "Rolls for".
			 * permintiéndonos añadir espacios o símbolos entre las dos o más tiradas de dados
			 */

			function Modify_Roll_Dice ( args, DataDamage, self ) {
				var	re						= /,/g,
					StringedDamage			= 0,
					SplitedDamage			= 0,
					newFullDamage			= [];

				var apply = {
					criticalmod : function(data){
						return Math.floor(data * self.CriticalMultiplier);
					}.bind(self),
					specialmod : function(data){
						return Math.floor(data * self.SpecialRollMultiplier);
					}.bind(self)
				};

				if ( args === 'critical' ) {

					newFullDamage		= DataDamage.map(apply.criticalmod),
					StringedDamage		= newFullDamage.toString(),
					SplitedDamage		= StringedDamage.replace(re,'&nbsp; & &nbsp;');

					return SplitedDamage;
				} else if ( args === 'special' ) {

					newFullDamage		= DataDamage.map(apply.specialmod),
					StringedDamage		= newFullDamage.toString(),
					SplitedDamage		= StringedDamage.replace(re,'&nbsp; & &nbsp;');

					return SplitedDamage;
				} else if ( args === 'normal' ) {

					newFullDamage		= DataDamage,
					StringedDamage		= newFullDamage.toString(),
					SplitedDamage		= StringedDamage.replace(re,'&nbsp; & &nbsp;');

					return SplitedDamage;
				} else {
					console.log('Error!! cannot leave args blank, or wrong assingment');
					return 0;
				}
			}

			for (var i = 0; i <= params.Sides.length - 1; i++ ) {

				DamageRollResult.push(this.roller( params.Sides[i], params.Rolls[i] ));

			}

			for (var q = 0; q <= params.Sides.length - 1; q++) {

				FullDamage[q] = {
					Sides		: params.Sides[q],
					Rolls		: params.Rolls[q],
					Damage		: DamageRollResult[q],
					Critical	: ParamsSkill.Critical,
					Special		: ParamsSkill.Special,
					TypeDamage	: params.TypeDamage[q]
				};

			}

			if ( showlog ) {
			/**
			 * El siguiente bucle for, desglosa el objeto FullDamage creado en el for
			 * que hay arriba, aplicando al daño realizado los modificadores por crítico
			 * o especial.
			 */

				for ( var prop in FullDamage ){
					if( FullDamage.hasOwnProperty(prop) ) {
						if ( FullDamage[prop].Damage.length > 1 ) {
							for (var z = 0; z < FullDamage[prop].Damage.length; z++) {

								SumDamage += +FullDamage[prop].Damage[z] ;
							}
							if ( ParamsSkill.Critical ) {
								SumDamageArray.push( SumDamage * +this.CriticalMultiplier );
							} else if ( ParamsSkill.Special ){
								SumDamageArray.push( Math.floor( SumDamage * +this.SpecialRollMultiplier ) );
							} else {
								SumDamageArray.push( SumDamage );
							}
							SumDamage = 0;
						} else {
							if ( ParamsSkill.Critical ) {
								SumDamage += FullDamage[prop].Damage * this.CriticalMultiplier;
								SumDamageArray.push( SumDamage );
							} else if ( ParamsSkill.Special ){
								SumDamage += Math.floor( FullDamage[prop].Damage * this.SpecialRollMultiplier );
								SumDamageArray.push( SumDamage );
							} else {
								SumDamage += +FullDamage[prop].Damage;
								SumDamageArray.push( SumDamage );
							}
							SumDamage = 0;
						}
					}
				}

				if ( params.ModDamage.length > 1 ) {

					for (var j = 0; j < SumDamageArray.length; j++) {

						DataDamage		= FullDamage[j].Damage;

						template.innerHTML += 	[	'<span class="lbox lbox-info">',
													params.Rolls[j] + 'd' + params.Sides[j] + '</span> &nbsp;'
												].join('\n');

						if ( ParamsSkill.Critical ) {
							//Critical rolls

							SplitedDamage = Modify_Roll_Dice('critical', DataDamage, self);

							SumRolls = SumDamageArray[j] + ( params.ModDamage[j] * +this.CriticalMultiplier );

							template.innerHTML += [	'<span class="lbox lbox-warning"> Critical x'+ this.CriticalMultiplier +'</span>',
													'<span class="lbox lbox-default">Rolls for a  : &nbsp;',
													SplitedDamage + '</span>',
													'<span class="lbox lbox-info">'+ FullDamage[j].TypeDamage +' &nbsp; Damage</span>'
												].join('\n');

						} else if ( ParamsSkill.Special ) {
							//Special Rolls

							SplitedDamage = Modify_Roll_Dice('special', DataDamage, self);

							SumRolls = SumDamageArray[j] + ( Math.floor( params.ModDamage[j] ) * +this.SpecialRollMultiplier );

							template.innerHTML += [	'<span class="lbox lbox-warning"> Special x'+ this.SpecialRollMultiplier +'</span>',
													'<span class="lbox lbox-default">Rolls for a  : &nbsp;',
													SplitedDamage + '</span>',
													'<span class="lbox lbox-info">'+ FullDamage[j].TypeDamage +' &nbsp; Damage</span>'
												].join('\n');

						} else {
							// Normal rolls
							SplitedDamage = Modify_Roll_Dice('normal', DataDamage, self);

							SumRolls = parseInt( SumDamageArray[j], 10) + parseInt(params.ModDamage[j], 10 );

							template.innerHTML += [	'<span class="lbox lbox-default">Rolls for : &nbsp;',
													SplitedDamage + '</span>',
													'<span class="lbox lbox-info">'+ FullDamage[j].TypeDamage +' &nbsp; Damage</span>'
												].join('\n');
						}

						FinalDamage += SumRolls;

						// Check for a positive o negative number on params.ModDamage array
						if ( params.ModDamage[j] < 0 ) {
							/*
							 * Check if params.ModDamage is greater than 0. If that variable
							 * if is equal to 0, does not render a span with '0'. Better for
							 * a cleaner result
							 */

							// Negative params.ModDamage use a red style
							if ( ParamsSkill.Critical ) {
								template.innerHTML += 	[	'&nbsp;<span class="lbox lbox-danger ">',
															( +params.ModDamage[j]  * this.CriticalMultiplier ) + '</span>'
														].join('\n');

							} else if ( ParamsSkill.Special ) {
								template.innerHTML += 	[	'&nbsp;<span class="lbox lbox-danger ">',
															Math.floor( +params.ModDamage[j]  * this.SpecialRollMultiplier ) + '</span>'
														].join('\n');

							} else {
								template.innerHTML += 	[	'&nbsp;<span class="lbox lbox-danger ">',
															params.ModDamage[j] + '</span>'
														].join('\n');

							}

							template.innerHTML += '&nbsp; = &nbsp;<span class="lbox lbox-default">' + SumRolls +'</span></br>';

						} else if ( params.ModDamage[j] > 0 ) {

							if ( ParamsSkill.Critical ) {
								// Positive params.ModDamage use a deep blue style
								template.innerHTML += 	[	'&nbsp;<span class="lbox lbox-primary ">',
															' + ' + ( +params.ModDamage[j]  * this.CriticalMultiplier ) + '</span>'
														].join('\n');
							} else if ( ParamsSkill.Special  ) {

								template.innerHTML += 	[	'&nbsp;<span class="lbox lbox-primary ">',
															' + ' + Math.floor( +params.ModDamage[j]  * this.SpecialRollMultiplier ) + '</span>'
														].join('\n');
							} else {

								template.innerHTML +=	[	'&nbsp;<span class="lbox lbox-primary ">',
															' + ' + params.ModDamage[j] + '</span>'
														].join('\n');
							}

							template.innerHTML += '&nbsp; = &nbsp;<span class="lbox lbox-default">' + SumRolls +'</span></br>';

						}

					}
				}

				if ( showlog ) {

					if ( this.CriticalPierceArmor && ParamsSkill.Critical ) {

						template.innerHTML += ['</br><span class="lbox lbox-success">',
												'Total : ' + FinalDamage + '</span>',
												'<span class="lbox lbox-warning">Armor is ignored</span>'
												].join('\n');
					} else {

						template.innerHTML += ['</br><span class="lbox lbox-success">',
												'Total : ' + FinalDamage + '</span>'
												].join('\n');
					}


					d.appendChild(template);

					// Con esta línea de código, hacemos que el resultado no sea tapado por el overflow.
					d.scrollTop = d.scrollHeight;

				} // showlog

			}

			/**
			 * FullDamage is an object with sequent structure :
			 *
			 * FullDamage = { Sides : params.Sides, Rolls : params.Rolls, Damage : DamageRollResult }
			 *
			 * Damage [Array]: contains an array of damage rolls for every roll.
			 * Rolls : contains dices rolls.
			 * Sides : contains dices sides.
			 *
			 * Damage data works as you put how many dices of the same kind you want to roll, like
			 * 2d6 (two dices of six sides). Damage method returns every roll of the two dices as
			 * an array.
			 *
			 * OBJECT EXAMPLE (continue from "2d6" example) :
			 *
			 * FullDamage = { Damage : [ 2, 4 ],  Rolls : 2, Sides : 5  }
			 *
			 */

			//console.log(FullDamage);

			return FullDamage;
		},
		d20 : function(params){
			var	ID				= this.HistoryBox,
				d				= document.getElementById(ID),
				template		= document.createElement('p'),
				ArrayRolls		= [],
				Rolls			= [],
				FormattedArray	= '';

			var CalcCrit = function( Rolls ) {
				var NewRoll		= [],
					ArrayRoll	= Rolls;

				if( Rolls.length === 1 ) ArrayRoll.push(Rolls[0]);

				NewRoll = this.roller( params.Sides, params.Rolls );

				if( Rolls[0] === 1 ) {
					if ( NewRoll[0] === 1 && ArrayRoll.length <= 2 ) {
						ArrayRoll.push( NewRoll[0] );
						CalcCrit(ArrayRoll);
					}
				} else {
					if ( NewRoll[0] === 20 && ArrayRoll.length >= 3 ) {
						ArrayRoll.push( NewRoll[0] );
						CalcCrit(ArrayRoll);
					} else {
						ArrayRoll.push( NewRoll[0] );
					}
				}

				return ArrayRoll;

			}.bind(this);

			var StringFormat = function( ArrayRolls ) {
				var re					= /,/g,
					StringedArrayRolls	= 0,
					SplitedArrayRolls	= 0,
					newArrayRolls		= [];

				StringedArrayRolls		= ArrayRolls.toString(),
				SplitedArrayRolls		= StringedArrayRolls.replace(re,'&nbsp; & &nbsp;');

				return SplitedArrayRolls;

			};

			template.innerHTML +=	[	'<span class="lbox lbox-info">Rolls a ',
										params.Rolls + 'd' + params.Sides + '</span> &nbsp;',
										'<span class="lbox lbox-default"> Difficulty of',
										 params.Difficulty + '</span>'
									].join('\n');


			Rolls = this.roller(params.Sides, params.Rolls);

			if( Rolls[0] > params.Difficulty && Rolls[0] < params.Critical ){

				template.innerHTML += '&nbsp; <span class="lbox lbox-success">Success!! '+ Rolls[0] +'</span>';
				console.log('Success ' + Rolls[0]);

			} else if ( Rolls[0] >= params.Critical ) {

					ArrayRolls.push(Rolls[0]);

				if( Rolls[0] === 20 ){

					ArrayRolls =  CalcCrit(Rolls);

					console.log(ArrayRolls);
				} else {

					Rolls.length = 0;
					Rolls = this.roller( params.Sides, params.Rolls );
					ArrayRolls.push(Rolls[0]);

				}

				console.log(ArrayRolls);

				if ( ArrayRolls[2] === 20 ) {
				 	// Triple 20 Roll, best critical Roll
					template.innerHTML += '&nbsp; <span class="lbox lbox-warning">Astonishing Critical!! ' + StringFormat(ArrayRolls) +'</span>';

					console.log('Brutal!! three 20!! ' + ArrayRolls );

				} else if ( ArrayRolls[0] < 20 && ArrayRolls[1] >= params.Critical && ArrayRolls[2] < params.Critical ) {
					// Critical
					template.innerHTML += '&nbsp; <span class="lbox lbox-success">Critical!! ' + StringFormat(ArrayRolls) +'</span>';

					console.log('Critical! ' + ArrayRolls);

				} else if ( ArrayRolls[0] >= params.Critical && ArrayRolls[1] >= params.Critical ) {
					// Critical
					template.innerHTML += '&nbsp; <span class="lbox lbox-success">Critical!! ' + StringFormat(ArrayRolls) +'</span>';

					console.log('Critical! ' + ArrayRolls);
				} else if ( ArrayRolls[1] < params.Critical ) {
					// Simple success
					template.innerHTML += '&nbsp; <span class="lbox lbox-success">Success!! ' + StringFormat(ArrayRolls) +'</span>';

					console.log('Success! ' + ArrayRolls);
				}

			} else if ( Rolls[0] === 1 ) {

				ArrayRolls = CalcCrit(Rolls);

				if ( ArrayRolls[1] === 1 ) {

					template.innerHTML += '&nbsp; <span class="lbox lbox-danger">Epic Fail!! ' + StringFormat(ArrayRolls) +'</span>';
					console.log('Epic Fail!! ' + ArrayRolls);
				} else {
					template.innerHTML += '&nbsp; <span class="lbox lbox-danger">Fail!! ' + ArrayRolls +'</span>';
					console.log('Fail!! ' + ArrayRolls);
				}

			} else {
				template.innerHTML += '&nbsp; <span class="lbox lbox-danger">Faill!! ' + Rolls[0] +'</span>';
				console.log('Fail! ' + Rolls[0]);
			}

			d.appendChild(template);
			d.scrollTop = d.scrollHeight;

		}
	};

	if(!window.D) window.D = D;

})(window);