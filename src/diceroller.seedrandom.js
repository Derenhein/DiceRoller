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
 *
 * For a better random number generation, seedrandom.js is used ( work from David Bau https://github.com/davidbau/seedrandom
 * under MIT license ). This library is used on the roll method, and is very easy to disable
 * and use default javascript Math.random(). Comment or delente Math.seedrandom() line.
 *
 */

;(function (window, undefined) {
	'use strict';

	console.log('diceroller.js');

	var D = function (params) {

		if (!params) {

			var	ParamsDefault	= {

					DiceSides				: 100,
					Percentual				: true,
					BaseSkill				: 0,
					OpenRoll				: false,
					BonusSkill				: 0,

					CriticalTreshold		: 10,
					CriticalMultiplier		: 2,
					CriticalPierceArmor		: false,

					SpecialRoll				: false,
					SpecialRollMultiplier	: 0,
					SpecialRollTreshold		: 0,
					SpecialRollPierceArmor	: false,

					EpicFail				: true,
					EpicFailTreshold		: 5,
					EpicFailMaxTreshold		: 100,
					EpicFailMinTreshold		: 100,
					DirectFail				: 96,

					HistoryBox				: 'RollBox',
					TagElement				: 'p',
					StyleCSS				: 'lround lround'

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
		 * Some gamesystems have a "direct fail" treshold on rolls. Like some BRP games, 96 in a
		 * natural roll is a direct fail, even if skill punctuation is 96 or more.
		 *
		 * Remember, direct fail isn´t a Epic/Critical Fail, but if 96 is in the same range,
		 * an EpicFail is applied.
		 *
		 * Important: DirectFail only works by the moment, on percentual rolls
		 */
		this.DirectFail				= params.DirectFail;

		/**
		 * Defines a tag to contain all log results. By default uses a '<p>' tag
		 */
		this.Template				= document.createElement(params.TagElement);

		/**
		 * Define class css for every result on the HistoryBox log. Can be personalized using
		 * this paremeter.
		 *
		 * Predefined styles are : 'lround' and 'lbox',
		 *
		 * How is defined in the html: <span class="lround lround-default"></span>
		 * How is defined in the js : <span class=" + 'this.StyleCSS + '-default"></span>
		 *
		 * The first "lround" is the main style, and the second only defines the colour of
		 * the "span" tag. Both can be redefined and renamed in a custom css, but the sufix
		 * must be the same.
		 *
		 * Example:
		 *  -default	: lround-default 	--> <span class=" + 'this.StyleCSS + '-default"></span>
		 *  -info		: lround-info 		--> <span class=" + 'this.StyleCSS + '-info"></span>
		 *  -warning	: lround-warning 	--> <span class=" + 'this.StyleCSS + '-warning"></span>
		 */
		this.StyleCSS                = params.StyleCSS;

		/**
		 * CalcTresholds is a module for quick calculation of the tresholds for critical, special and
		 * critical fails.
		 * May need some tweaks, but can be parametrized easily.
		 */

		this.CalcTresholds = function () {
			var args = {};

			function critical () {
				var MaxCritical = Math.floor( ( ( args.BaseSkill + params.BonusSkill ) /100 ) * params.CriticalTreshold ),
					MinCritical = 1;
				return { MaxCritical : MaxCritical,
						 MinCritical : MinCritical };
			}
			function special () {
				var MaxSpecial = Math.floor( ( ( args.BaseSkill + params.BonusSkill ) /100 ) * params.SpecialRollTreshold ),
					MinSpecial = critical();

				return { MaxSpecial : MaxSpecial,
						 MinSpecial : MinSpecial.MaxCritical+1 };
			}
			function fail () {
				var CalcFail = ( Math.floor( ( args.BaseSkill + params.BonusSkill ) / params.EpicFailTreshold ) * -1 ) +100;
					if ( CalcFail < params.EpicFailMinTreshold  ) {
						return params.EpicFailMinTreshold;
					} else {
						return CalcFail;
					}
			}
			function setArgs ( skill, mod ) {
				args.BaseSkill	= skill;
				args.SkillMod	= mod || 0;
			}

			return {

				critical_value		: critical,
				special_value		: special,
				critical_fail_value	: fail,
				setArgs				: setArgs

			};

		}(params);

		/**
		 * Well, this is the random number generator, usign javascript Math.random.
		 * May be isn´t the better random generator but works.
		 *
		 * @param  {[integer]} sides [Sides of dice used to roll]
		 * @param  {[integer]} rolls [How many rolls]
		 * @return {[Array]}       	 [Returns an array with all dice rolls ]
		 *
		 * As said at the start of the document, using seedrandom.js helps RNG.
		 */

		this.roller = function (sides, rolls) {
			var Result			= [];

			// Comment or delete this line for dafault Math.random()
			Math.seedrandom('added entropy.', { entropy: true });

			if( sides === null ) sides = this.DiceSides;

			for(var i = 0; i < rolls; i++ ) {
				Result.push( 1 + Math.floor( Math.random() * sides ));
			}

			return Result;
		};

		/**
		 * Not related to any game system, but very helpful to manage arrays.
		 * Deletes all coincidencies from an array
		 */

		this.Remove_Element = function( array ) {
			var ToRemove	= '',				//element to remove
				Arguments	= arguments,		//all arguments
				Arg_Lenght	= Arguments.length, //length of arguments
				Aux			= '';				//auxiliar var

			while (Arg_Lenght > 1 && array.length) {

				//Set array of arguments to be modified
				ToRemove = Arguments[--Arg_Lenght];
				//while ToRemove is true, remove all elements from array
				while ( ( Aux = array.indexOf( ToRemove ) ) !== -1 ) {
					array.splice(Aux, 1);
				}
			}

			return array;

		};

		return this;
	};

	D.fn = Libs.prototype = {

		roll: function(rolls, sides, mod, critical) {

			var RolledDices	= 0,
				d			= document.getElementById(this.HistoryBox),
				Template	= this.Template;

			sides = sides || this.DiceSides;
			mod = mod || 0;

			var RollResult = this.roller( sides, rolls );

			for (var i = RollResult.length - 1; i >= 0; i--) {

				RolledDices += +RollResult[i];

				if( i === RollResult.length-1 ) {
					Template.innerHTML += ' &nbsp; <span class="'+this.StyleCSS+'-default">' + RollResult[i] + '</span>';
				} else {
					Template.innerHTML += ' &nbsp; +  &nbsp; <span class="'+this.StyleCSS+'-default">' + RollResult[i] + '</span>';
				}
			}

			Template.setAttribute('name', 'logrow');

			if( mod !== 0 ){
				RolledDices += mod;
				Template.innerHTML += ' &nbsp; +  &nbsp; <span class="'+this.StyleCSS+'-warning">' + mod + '</span>';
				Template.innerHTML += ' &nbsp; =  &nbsp; <span class="'+this.StyleCSS+'-success">' + RolledDices + '</span>';
			} else {
				Template.innerHTML += ' &nbsp; =  &nbsp; <span class="'+this.StyleCSS+'-success">' + RolledDices + '</span>';
			}

			d.appendChild(Template);
			d.scrollTop = d.scrollHeight;

			return this;
		},
		skill: function(rolls, sides, mod, skill, difficulty ){

			sides		= sides || this.DiceSides;
			skill		= skill || this.BaseSkill;
			mod			= mod || this.BonusSkill;
			difficulty	= difficulty || 0;

			var RollResult		= this.roller( sides, rolls ),
				ModdedSkill		= skill + mod,
				d				= document.getElementById(this.HistoryBox),
				Template		= this.Template,
				RollsObj		= {},
				MyCritical		= 0,
				MySpecial		= 0,
				MyFail			= 0;

			this.CalcTresholds.setArgs( skill, mod );

			MyCritical = this.CalcTresholds.critical_value();
			MySpecial = this.CalcTresholds.special_value();
			MyFail = this.CalcTresholds.critical_fail_value();

			if( this.Percentual ) {
				console.log('BRP');

				/**
				 * BRP like System
				 * 01 Always crítical roll, some editios uses 5% of base skill for crítical treshold.
				 * 00 Always epic fail, some editios uses 5% of base skill for epic fail treshold.
				 *
				 * BRP uses "special" roll, about 20% of base skill.
				 * RQ6 don´t have "special" roll
				 */

				if( RollResult <= MyCritical.MaxCritical && RollResult !== 0 && RollResult < this.DirectFail ) {

					Template.innerHTML	= '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-default">Roll Mod: ' + mod +'</span>';

					} else {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					Template.innerHTML += 	'&nbsp; <span class="'+this.StyleCSS+'-success">' + RollResult + '&nbsp; Critical! </span>';

					RollsObj = {
						Roll : RollResult[0],
						Critical : true,
						Special: false,
						EpicFail: false,
						Fail: false
					};

				} else if ( RollResult >= MySpecial.MinSpecial &&
							RollResult <= MySpecial.MaxSpecial &&
							RollResult < this.DirectFail &&
							this.SpecialRoll ) {

					Template.innerHTML	= '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-default">Roll Mod: ' + mod +'</span>';

					} else {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					Template.innerHTML += 	'&nbsp; <span class="'+this.StyleCSS+'-success">' + RollResult + '&nbsp; Special! </span>';

					RollsObj = {
						Roll : RollResult[0],
						Critical : false,
						Special: true,
						EpicFail: false,
						Fail: false
					};

				} else if ( RollResult >= MyFail ) {

					Template.innerHTML	= '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-default">Roll Mod: ' + mod +'</span>';

					} else {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					Template.innerHTML += 	'&nbsp; <span class="'+this.StyleCSS+'-danger">' + RollResult + '&nbsp; Epic Fail! </span>';

					RollsObj = {
						Roll : RollResult[0],
						Critical : false,
						Special: false,
						EpicFail: true,
						Fail: true
					};

				} else if ( RollResult <= ModdedSkill && RollResult < this.DirectFail) {

					Template.innerHTML	= '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-default">Roll Mod: ' + mod +'</span>';

					} else {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					Template.innerHTML += 	'&nbsp; <span class="'+this.StyleCSS+'-success">' + RollResult + '&nbsp; Success! </span>';

					RollsObj = {
						Roll : RollResult[0],
						Critical : false,
						Special: false,
						EpicFail: false,
						Fail: false
					};

				} else {

					Template.innerHTML	= '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					if ( mod !== 0 ){
						Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-default">Roll Mod: ' + mod +'</span>';

					} else {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-info">Roll Skill: ' + ModdedSkill +'</span>';

					}

					Template.innerHTML += 	'&nbsp; <span class="'+this.StyleCSS+'-danger">' + RollResult + '&nbsp; Fail! </span>';

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
							Template.innerHTML += ['<span class="'+this.StyleCSS+'-info"> Open Roll!</span>',
													'&nbsp; <span class="'+this.StyleCSS+'-default">',
													RollArray[i] + '</span>'
													].join('\n');
						} else {
							Template.innerHTML += '&nbsp; + &nbsp; <span class="'+this.StyleCSS+'-default">' + RollArray[i] + '</span>';
						}
						ArraySum += parseInt(RollArray[i], 10);

					}
					if ( ( ArraySum + mod ) > difficulty ){
						//Critical
						if ( mod !== 0 && typeof mod === 'number' ) {

							ArraySum += mod;

							Template.innerHTML += [	'&nbsp; + &nbsp; <span class="'+this.StyleCSS+'-default">Roll Mod ' + mod +'</span>',
													'&nbsp; &nbsp; <span class="'+this.StyleCSS+'-info">Difficulty ' + difficulty +'</span>',
													'&nbsp; = &nbsp; <span class="'+this.StyleCSS+'-success">'+ ArraySum +'</span>',
													'&nbsp; <span class="'+this.StyleCSS+'-warning">Critical Roll !!</span>'
												].join('\n');
						} else {

							Template.innerHTML += [	'&nbsp; &nbsp; <span class="'+this.StyleCSS+'-info">Difficulty ' + difficulty +'</span>',
													'&nbsp; = &nbsp; <span class="'+this.StyleCSS+'-success">' + ArraySum,
													'</span> &nbsp; <span class="'+this.StyleCSS+'-warning">Critical Roll !!</span>'
												].join('\n');
						}
						RollsObj = {
							Roll : ArraySum,
							Critical : true,
							Special: false,
							EpicFail: false,
							Fail: false
						};
					} else {

						Template.innerHTML += [	'&nbsp; + &nbsp; <span class="'+this.StyleCSS+'-default">Roll Mod ' + mod +'</span>',
												'&nbsp; &nbsp; <span class="'+this.StyleCSS+'-info">Difficulty ' + difficulty +'</span>',
												'&nbsp; = &nbsp; <span class="'+this.StyleCSS+'-danger">'+ ArraySum +'  &nbsp; Failed!</span>'
											].join('\n');
						RollsObj = {
							Roll : ArraySum,
							Critical : false,
							Special: false,
							EpicFail: false,
							Fail: true
						};
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
							Template.innerHTML += [	'<span class="'+this.StyleCSS+'-info"> Open Roll!</span>',
													'&nbsp; <span class="'+this.StyleCSS+'-default">',
													RollArray[i] + '</span>'
												].join('\n');
						} else {
							Template.innerHTML += '&nbsp; + &nbsp; <span class="'+this.StyleCSS+'-default">' + RollArray[i] + '</span>';
						}
						ArraySum += parseInt(RollArray[i], 10);

					}
					if ( mod !== 0 && typeof mod === 'number' ) {

						ArraySum += mod;

						Template.innerHTML += [	'&nbsp; + &nbsp; <span class="'+this.StyleCSS+'-default">Roll Mod ' + mod +'</span>',
												'&nbsp; = &nbsp;<span class="'+this.StyleCSS+'-danger">'+ ArraySum ,
												'&nbsp; Epic Fail !!</span>'
											].join('\n');
					} else {

						Template.innerHTML += [	'&nbsp; = &nbsp; <span class="'+this.StyleCSS+'-danger">' + ArraySum,
												'Epic Fail !!</span>'
											].join('\n');
					}
					RollsObj = {
						Roll : ArraySum,
						Critical : false,
						Special: false,
						EpicFail: true,
						Fail: false
					};

				} else {

					var RollResultVal = RollResult[0];

					Template.innerHTML += [	'<span class="'+this.StyleCSS+'-info">Roll!</span>',
											'&nbsp; <span class="'+this.StyleCSS+'-default">'+ RollResult +'</span>'
										].join('\n');

					if ( mod !== 0 && typeof mod === 'number' ) {

						Template.innerHTML += 	[	'&nbsp; + &nbsp; <span class="'+this.StyleCSS+'-default">Roll Mod ' + mod +'</span>',
													'&nbsp; &nbsp; <span class="'+this.StyleCSS+'-info">Difficulty ' + difficulty +'</span>'
												].join('\n');

						RollResultVal += mod;

						if ( ( RollResultVal + mod ) > difficulty ) {

							Template.innerHTML += '&nbsp; = &nbsp; <span class="'+this.StyleCSS+'-success">'+ RollResultVal +' &nbsp; Roll Success</span>';

							RollsObj = {
								Roll : RollResultVal,
								Critical : false,
								Special: false,
								EpicFail: false,
								Fail: true
							};

						} else {

							Template.innerHTML += '&nbsp; = &nbsp; <span class="'+this.StyleCSS+'-danger">'+ RollResultVal +'  &nbsp; Failed!</span>';

							RollsObj = {
								Roll : RollResultVal,
								Critical : false,
								Special: false,
								EpicFail: false,
								Fail: true
							};

						}

					} else {

							Template.innerHTML += '&nbsp; &nbsp; <span class="'+this.StyleCSS+'-info">Difficulty ' + difficulty +'</span>';

						if ( RollResult > difficulty ) {

							Template.innerHTML += '&nbsp; = &nbsp; <span class="'+this.StyleCSS+'-success">'+ RollResult +' &nbsp; Roll Success</span>';
							RollsObj = {
								Roll : RollResult[0],
								Critical : false,
								Special: false,
								EpicFail: false,
								Fail: false
							};

						} else {

							Template.innerHTML += '&nbsp; = &nbsp; <span class="'+this.StyleCSS+'-danger">'+ RollResult +'  &nbsp; Failed!</span>';

						}
						RollsObj = {
							Roll : RollResult[0],
							Critical : false,
							Special: false,
							EpicFail: false,
							Fail: true
						};

					}

				}

			}

			d.appendChild(Template);

			// Con esta línea de código, hacemos que el resultado no sea tapado por el overflow.
			d.scrollTop = d.scrollHeight;

			return {
				RollsObj : RollsObj,
				this : this
			};

		},
		armor: function( ArmorParams, FullDamageObj ){
			var d			= document.getElementById(this.HistoryBox),
				Template	= this.Template,
				RollArmor	= [],
				TempArmor	= 0,
				Damage		= 0,
				FullDamage	= {},
				self		= {};

			/**
			 * FullDamageObj can be a direct link from Skill(), returning an object
			 * with two key : Fulldamage (Object) and this (Object).
			 *
			 * But one object with all data needed can be passed and causes conflicts
			 * with armor(). The next if control manages the two cases, putting
			 * the right content onf FullDamage.
			 */
			if( Object.keys(FullDamageObj)[0] === 'FullDamage' ) {
				FullDamage = FullDamageObj.FullDamage;
				self = FullDamageObj.this;
			} else {
				FullDamage = FullDamageObj;
				self = this;
			}

			function PrepareObj( ArmorParams, FullDamage, self ){
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
				/**
				 * Next if works as purpose of manage the object FullDamage.
				 */
				if ( !FullDamage.hasOwnProperty('TypeDamage') ) {
					for ( var params in FullDamage ) {
						if ( FullDamage.hasOwnProperty(params) ){
							var key = FullDamage[params].TypeDamage.toLowerCase();
							obj2[key] = {
								Name		: FullDamage[params].TypeDamage.toLowerCase(),
								Sides		: FullDamage[params].Sides,
								Rolls		: FullDamage[params].Rolls,
								Damage		: FullDamage[params].Damage,
								ModDamage 	: FullDamage[params].ModDamage
							};
						}
					}
				} else {
					var key = FullDamage.TypeDamage.toLowerCase();
					obj2[key] = {
						Name		: FullDamage.TypeDamage.toLowerCase(),
						Sides		: FullDamage.Sides,
						Rolls		: FullDamage.Rolls,
						Damage		: FullDamage.Damage,
						ModDamage 	: FullDamage.ModDamage,
						Special		: FullDamage.Special,
						Critical	: FullDamage.Critical
					}
					/**
					 * As standalone, armor() doesn´t have previos calculation of critical damage,
					 * is needed to do it in this part.
					 */
					if ( obj2[key].Critical ) {
						obj2[key].Damage = ( +obj2[key].Damage * self.CriticalMultiplier );
					} else if ( obj2[key].Special ) {
						obj2[key].Damage = ( +obj2[key].Damage * self.SpecialRollMultiplier );
					} else {
						obj2[key].Damage = obj2[key].Damage;
					}

				}

				return { ArmorParams : obj1, FullDamage : obj2 };

			}

			var NewObj					= PrepareObj( ArmorParams, FullDamage, self),
				NewArmorParams			= NewObj.ArmorParams,
				NewFullDamage			= NewObj.FullDamage,
				TmpNewFullDamageArray	= 0;

			var Calc_MyDamage = function( dice, fixed, damage ) {
				if ( dice === undefined || dice === "" ) dice = 0;

				var calc = damage - ( +dice + fixed );

				/**
				 * As a negative value result of armor is a nonsense, damage taken
				 * is round to 0.
				 */

				if ( calc < 0 ) {
					return 0;
				} else {
					return calc;
				}
			}

			for( var paramskey in NewArmorParams ){
				if( NewArmorParams.hasOwnProperty( paramskey ) ) {
					for( var params in NewFullDamage ) {
						if( NewFullDamage.hasOwnProperty(params) ){

							try {
								if ( NewArmorParams[paramskey].Name === NewFullDamage[params].Name) {

									RollArmor = this.roller( NewArmorParams[paramskey].Sides, NewArmorParams[paramskey].Rolls );

									if( NewFullDamage[params].Damage.length > 1 ){

										TmpNewFullDamageArray = 0;

										for ( var index = 0; index < NewFullDamage[params].Damage.length; index++ ) {
											TmpNewFullDamageArray += NewFullDamage[params].Damage[index];
										}

										TmpNewFullDamageArray += NewFullDamage[params].ModDamage;

									} else {
										/**
										 * More control of object coming from FullDamage. Splits from a manual imput object or
										 * from Skill();
										 */
										if ( typeof NewFullDamage[params].Damage[0] === 'undefined' ) {
											Damage = ( +NewFullDamage[params].Damage + NewFullDamage[params].ModDamage );
										} else {
											Damage = ( +NewFullDamage[params].Damage[0] + NewFullDamage[params].ModDamage );
										}
									}

									if( NewArmorParams[paramskey].Name === NewFullDamage[params].Name &&
										NewArmorParams[paramskey].Sides > 0 &&
										NewArmorParams[paramskey].Rolls > 0
										) {

										Template.innerHTML +=	[	'<span class="'+this.StyleCSS+'-info">'+ NewArmorParams[paramskey].Name +' Armor',
																	'&nbsp; '+ NewArmorParams[paramskey].Rolls + 'd' + NewArmorParams[paramskey].Sides,
																	'</span>'
															].join('\n');

										if( RollArmor.length > 1 ) {

											for ( var z = 0; z < RollArmor.length; z++ ) {
												TempArmor += parseInt( RollArmor[z], 10 );
											}
											Template.innerHTML += [	'&nbsp : &nbsp<span class="'+this.StyleCSS+'-default">Dice Armor: ' + TempArmor + '</span>',
																	'&nbsp + &nbsp<span class="'+this.StyleCSS+'-default">Fixed Armor: ' + NewArmorParams[paramskey].Fixed + '</span>'
																].join('\n');
											if ( NewFullDamage[params].Damage.length > 1 ){
												Template.innerHTML += [	'&nbsp - &nbsp<span class="'+this.StyleCSS+'-warning">Damage incoming: ' + TmpNewFullDamageArray + '</span>',
																		'&nbsp = &nbsp<span class="'+this.StyleCSS+'-success"> Total: ' + Calc_MyDamage(TempArmor, NewArmorParams[params].Fixed, TmpNewFullDamageArray ),
																		'</span></br>'
																	].join('\n');
											} else {
												Template.innerHTML += [	'&nbsp - &nbsp<span class="'+this.StyleCSS+'-warning">Damage incoming: ' + Damage + '</span>',
																		'&nbsp = &nbsp<span class="'+this.StyleCSS+'-success"> Total: ' + Calc_MyDamage(TempArmor, NewArmorParams[params].Fixed, Damage ),
																		'</span></br>'
																	].join('\n');
											}
											TempArmor = 0;
										} else {

											Template.innerHTML += [	'&nbsp : &nbsp<span class="'+this.StyleCSS+'-default">Dice Armor: ' + RollArmor + '</span>',
																	'&nbsp + &nbsp<span class="'+this.StyleCSS+'-default">Fixed Armor: ' + NewArmorParams[paramskey].Fixed + '</span>'
																	].join('\n');
											if ( NewFullDamage[params].Damage.length > 1 ){
												Template.innerHTML += [	'&nbsp - &nbsp<span class="'+this.StyleCSS+'-warning">Damage incoming: ' + TmpNewFullDamageArray + '</span>',
																	'&nbsp = &nbsp<span class="'+this.StyleCSS+'-success"> Total: ' + Calc_MyDamage(RollArmor, NewArmorParams[params].Fixed, TmpNewFullDamageArray),
																	'</span></br>'
																].join('\n');
											} else {
												Template.innerHTML += [	'&nbsp - &nbsp<span class="'+this.StyleCSS+'-warning">Damage incoming: ' + Damage + '</span>',
																	'&nbsp = &nbsp<span class="'+this.StyleCSS+'-success"> Total: ' + Calc_MyDamage( RollArmor, NewArmorParams[params].Fixed, Damage ),
																	'</span></br>'
																].join('\n');
											}
										} //else

									}
									if ( NewArmorParams[paramskey].Rolls === 0 &&
										 NewArmorParams[paramskey].Sides === 0 &&
										 NewArmorParams[paramskey].Fixed > 0 || NewArmorParams[paramskey].Fixed < 0  ) {

										Template.innerHTML += [			'<span class="'+this.StyleCSS+'-info">'+ NewArmorParams[params].Name +' Armor </span>',
																		'&nbsp : <span class="'+this.StyleCSS+'-default">Fixed Armor : ' + NewArmorParams[params].Fixed + '</span>',
																		'&nbsp + &nbsp<span class="'+this.StyleCSS+'-warning">Damage incoming: ' + Damage + '</span>',
																		'&nbsp = &nbsp<span class="'+this.StyleCSS+'-success"> Total: ' + Calc_MyDamage( 0, NewArmorParams[params].Fixed, Damage ),
																		'</span></br>'
																	].join('\n');

									}
								}

							} catch (event) {
									console.log(event);
							} //catch

						}
					}

				} // if NewFulldamage
			} // for NewFulldamage


			d.appendChild(Template);

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
				d						= document.getElementById(this.HistoryBox),
				Template				= this.Template,
				SumRolls				= 0,
				FullDamage				= {},
				SumDamage				= 0,
				SumDamageArray			= [],
				FinalDamage				= 0,
				DataDamage				= 0,
				SplitedDamage			= 0,
				ParamsSkill				= ParamsSkill.RollsObj,
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

			if( !params.Sides.length ) {

				DamageRollResult = this.roller( params.Sides, params.Rolls );

				FullDamage = {
					Sides		: params.Sides,
					Rolls		: params.Rolls,
					Damage		: DamageRollResult[0],
					ModDamage	: params.ModDamage || 0 ,
					Critical	: ParamsSkill.Critical || false,
					Special		: ParamsSkill.Special || false,
					TypeDamage	: params.TypeDamage
				}

				if ( showlog ) {

					Template.innerHTML += 	[	'<br/><span class="'+this.StyleCSS+'-info">',
												params.Rolls + 'd' + params.Sides + '</span> &nbsp;'
											].join('\n');

					if ( ParamsSkill.Critical ) {
						//Critical rolls

						SplitedDamage = Modify_Roll_Dice('critical', DamageRollResult, self);

						SumRolls = Math.floor( DamageRollResult * +this.CriticalMultiplier ) + Math.floor( params.ModDamage * +this.CriticalMultiplier );

						Template.innerHTML += [	'<span class="'+this.StyleCSS+'-warning"> Critical x'+ this.CriticalMultiplier +'</span>',
												'<span class="'+this.StyleCSS+'-default">Rolls for a  : &nbsp;',
												SplitedDamage + '</span>',
												'<span class="'+this.StyleCSS+'-default">Damage Mod '+ Math.floor( params.ModDamage * +this.CriticalMultiplier )+'</span>',
												'<span class="'+this.StyleCSS+'-info">'+ params.TypeDamage +' &nbsp; Damage</span>'
											].join('\n');

					} else if ( ParamsSkill.Special ) {
						//Special Rolls

						SplitedDamage = Modify_Roll_Dice('special', DamageRollResult, self);

						SumRolls = Math.floor( DamageRollResult * +this.SpecialRollMultiplier ) + Math.floor( params.ModDamage * +this.SpecialRollMultiplier );

						Template.innerHTML += [	'<span class="'+this.StyleCSS+'-warning"> Special x'+ this.SpecialRollMultiplier +'</span>',
												'<span class="'+this.StyleCSS+'-default">Rolls for a  : &nbsp;',
												SplitedDamage + '</span>',
												'<span class="'+this.StyleCSS+'-default">Damage Mod '+ Math.floor( params.ModDamage * +this.SpecialRollMultiplier )+'</span>',
												'<span class="'+this.StyleCSS+'-info">'+ params.TypeDamage +' &nbsp; Damage</span>'
											].join('\n');

					} else {
						// Normal rolls
						SplitedDamage = Modify_Roll_Dice('normal', DamageRollResult, self);

						SumRolls += +DamageRollResult + params.ModDamage;

						Template.innerHTML += [	'<span class="'+this.StyleCSS+'-default">Rolls for : &nbsp;',
												SplitedDamage + '</span>',
												'<span class="'+this.StyleCSS+'-default">Damage Mod '+params.ModDamage+'</span>',
												'<span class="'+this.StyleCSS+'-info">'+ params.TypeDamage +' &nbsp; Damage</span>'
											].join('\n');
					}
				}
				if ( this.CriticalPierceArmor && ParamsSkill.Critical ) {

						Template.innerHTML += ['</br><span class="'+this.StyleCSS+'-success">',
												'Total : ' + SumRolls + '</span>',
												'<span class="'+this.StyleCSS+'-warning">Armor is ignored</span>'
												].join('\n');
					} else {

						Template.innerHTML += ['</br><span class="'+this.StyleCSS+'-success">',
												'Total ' + SumRolls + '</span> </br>'
												].join('\n');
					}

			} else {

				for (var i = 0; i <= params.Sides.length - 1; i++ ) {

					DamageRollResult.push(this.roller( params.Sides[i], params.Rolls[i] ));

				}

				for (var q = 0; q <= params.Sides.length - 1; q++) {

					FullDamage[q] = {
						Sides		: params.Sides[q],
						Rolls		: params.Rolls[q],
						Damage		: DamageRollResult[q],
						ModDamage	: params.ModDamage[q],
						Critical	: ParamsSkill.Critical || false,
						Special		: ParamsSkill.Special || false,
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

							Template.innerHTML += 	[	'<br/><span class="'+this.StyleCSS+'-info">',
														params.Rolls[j] + 'd' + params.Sides[j] + '</span> &nbsp;'
													].join('\n');

							if ( ParamsSkill.Critical ) {
								//Critical rolls

								SplitedDamage = Modify_Roll_Dice('critical', DataDamage, self);

								SumRolls = SumDamageArray[j] + ( Math.floor( params.ModDamage[j] ) * +this.CriticalMultiplier );

								Template.innerHTML += [	'<span class="'+this.StyleCSS+'-warning"> Critical x'+ this.CriticalMultiplier +'</span>',
														'<span class="'+this.StyleCSS+'-default">Rolls for a  : &nbsp;',
														SplitedDamage + '</span>',
														'<span class="'+this.StyleCSS+'-default">Damage Mod '+ Math.floor( params.ModDamage[j] * +this.CriticalMultiplier )+'</span>',
														'<span class="'+this.StyleCSS+'-info">'+ FullDamage[j].TypeDamage +' &nbsp; Damage</span>'
													].join('\n');

							} else if ( ParamsSkill.Special ) {
								//Special Rolls

								SplitedDamage = Modify_Roll_Dice('special', DataDamage, self);

								SumRolls = SumDamageArray[j] + ( Math.floor( params.ModDamage[j] ) * +this.SpecialRollMultiplier );

								Template.innerHTML += [	'<span class="'+this.StyleCSS+'-warning"> Special x'+ this.SpecialRollMultiplier +'</span>',
														'<span class="'+this.StyleCSS+'-default">Rolls for a  : &nbsp;',
														SplitedDamage + '</span>',
														'<span class="'+this.StyleCSS+'-default">Damage Mod '+ Math.floor( params.ModDamage[j] * +this.SpecialRollMultiplier )+'</span>',
														'<span class="'+this.StyleCSS+'-info">'+ FullDamage[j].TypeDamage +' &nbsp; Damage</span>'
													].join('\n');

							} else {
								// Normal rolls
								SplitedDamage = Modify_Roll_Dice('normal', DataDamage, self);

								SumRolls = parseInt( SumDamageArray[j], 10) + parseInt(params.ModDamage[j], 10 );

								Template.innerHTML += [	'<span class="'+this.StyleCSS+'-default">Rolls for : &nbsp;',
														SplitedDamage + '</span>',
														'<span class="'+this.StyleCSS+'-default">Damage Mod '+ params.ModDamage[j]+'</span>',
														'<span class="'+this.StyleCSS+'-info">'+ FullDamage[j].TypeDamage +' &nbsp; Damage</span>'
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
									Template.innerHTML += 	[	'&nbsp;<span class="'+this.StyleCSS+'-danger ">',
																( +params.ModDamage[j]  * this.CriticalMultiplier ) + '</span>'
															].join('\n');

								} else if ( ParamsSkill.Special ) {
									Template.innerHTML += 	[	'&nbsp;<span class="'+this.StyleCSS+'-danger ">',
																Math.floor( +params.ModDamage[j]  * this.SpecialRollMultiplier ) + '</span>'
															].join('\n');

								} else {
									Template.innerHTML += 	[	'&nbsp;<span class="'+this.StyleCSS+'-danger ">',
																params.ModDamage[j] + '</span>'
															].join('\n');

								}

								Template.innerHTML += '&nbsp; = &nbsp;<span class="'+this.StyleCSS+'-default">' + SumRolls +'</span>';

							} else if ( params.ModDamage[j] > 0 ) {

								if ( ParamsSkill.Critical ) {
									// Positive params.ModDamage use a deep blue style
									Template.innerHTML += 	[	'&nbsp;<span class="'+this.StyleCSS+'-primary ">',
																' + ' + ( +params.ModDamage[j]  * this.CriticalMultiplier ) + '</span>'
															].join('\n');
								} else if ( ParamsSkill.Special  ) {

									Template.innerHTML += 	[	'&nbsp;<span class="'+this.StyleCSS+'-primary ">',
																' + ' + Math.floor( +params.ModDamage[j]  * this.SpecialRollMultiplier ) + '</span>'
															].join('\n');
								} else {

									Template.innerHTML +=	[	'&nbsp;<span class="'+this.StyleCSS+'-primary ">',
																' + ' + params.ModDamage[j] + '</span>'
															].join('\n');
								}

								Template.innerHTML += '&nbsp; = &nbsp;<span class="'+this.StyleCSS+'-default">' + SumRolls +'</span>';

							}

						}
					}

					if ( this.CriticalPierceArmor && ParamsSkill.Critical ) {

						Template.innerHTML += ['</br><span class="'+this.StyleCSS+'-success">',
												'Total : ' + FinalDamage + '</span>',
												'<span class="'+this.StyleCSS+'-warning">Armor is ignored</span>'
												].join('\n');
					} else {

						Template.innerHTML += ['</br><span class="'+this.StyleCSS+'-success">',
												'Total ' + FinalDamage + '</span> </br>'
												].join('\n');
					}

					d.appendChild(Template);

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
			Template.innerHTML += '</br>';

			return {
				FullDamage : FullDamage,
				this : this
			};
		},
		d20 : function ( params) {
			var	d				= document.getElementById(this.HistoryBox),
				Template		= this.Template,
				ArrayRolls		= [],
				Rolls			= [],
				RollMod			= 0;

			Rolls = this.roller(params.Sides, params.Rolls);

			var CalcCrit = function( Rolls ) {
				var NewRoll		= [],
					ArrayRoll	= Rolls;

				NewRoll = this.roller( params.Sides, params.Rolls );

				if( Rolls[0] === 1 ) {

					if ( NewRoll[0] === 1 && ArrayRoll.length <= 2 ) {
						ArrayRoll.push( NewRoll[0] );
						CalcCrit(ArrayRoll);
					}
				} else if ( Rolls[0] >= 20 && ArrayRoll.length !== 3 ) {

					if ( NewRoll[0] >= 20 && ArrayRoll.length <= 3 ) {
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
					SplitedArrayRolls	= 0;

				StringedArrayRolls		= ArrayRolls.toString(),
				SplitedArrayRolls		= StringedArrayRolls.replace(re,'&nbsp; & &nbsp;');

				return SplitedArrayRolls;

			};

			Template.innerHTML +=	[	'<span class="'+this.StyleCSS+'-info">Rolls a ',
										params.Rolls + 'd' + params.Sides + '</span> &nbsp;',
										'<span class="'+this.StyleCSS+'-default"> Difficulty of',
										params.Difficulty + '</span>'
									].join('\n');
			if ( params.Mod ) {
				Template.innerHTML +=	['&nbsp; <span class="'+this.StyleCSS+'-default"> Modificators &nbsp;',
										 params.Mod + '</span>'
									].join('\n');

				RollMod = ( Rolls[0] + params.Mod );
			}


			if( Rolls[0] >= params.Difficulty && Rolls[0]  < params.Critical && Rolls[0] !== 20  && RollMod === 0 ) {

				Template.innerHTML += 	[ 	'&nbsp; <span class="'+this.StyleCSS+'-info">Roll Result '+ Rolls[0] +'</span>',
											'&nbsp; <span class="'+this.StyleCSS+'-success"> Success! ' + Rolls[0] + params.Mod + '</span>'
										].join('\n');


			} else if ( RollMod >= params.Difficulty && Rolls[0] < params.Critical && Rolls[0] !== 20 ) {

				Template.innerHTML += 	[ 	'&nbsp; <span class="'+this.StyleCSS+'-info">Roll Result '+ Rolls[0] +'</span>',
											'&nbsp; <span class="'+this.StyleCSS+'-success"> Success! ' + RollMod + '</span>'
										].join('\n');


			} else if ( Rolls[0] >= params.Critical && Rolls[0] >= params.Difficulty ||
						RollMod >= params.Critical && RollMod >= params.Difficulty ||
						Rolls[0] === 20
					) {

					ArrayRolls.push(Rolls[0]);

				if( Rolls[0] === 20 ){

					ArrayRolls =  CalcCrit(Rolls);

				} else {

					Rolls.length = 0;
					Rolls = this.roller( params.Sides, params.Rolls );
					ArrayRolls.push(Rolls[0]);

				}


				if ( ArrayRolls[2] === 20 ) {
					// Triple 20 Roll, best critical Roll
					if ( params.Mod ) {
						Template.innerHTML += 	[	'&nbsp; <span class="'+this.StyleCSS+'-info">Astonishing three twentys!!!</span>',
													'<span class="'+this.StyleCSS+'-default">First Roll&nbsp;'+ ArrayRolls[0] +'&nbsp; plus mods =&nbsp;',
													RollMod +'</span>',
													'&nbsp; <span class="'+this.StyleCSS+'-success">Critical Success!! ' + StringFormat(ArrayRolls) +'</span>'
											].join('\n');
					} else {
						Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-warning">Astonishing Critical!! ' + StringFormat(ArrayRolls) +'</span>';
					}


				} else if ( ArrayRolls[0] < 20 && ArrayRolls[1] >= params.Critical && ArrayRolls[1] >= params.Difficulty  && ArrayRolls[2] < params.Critical ) {
					// Critical
					if ( params.Mod ) {
						Template.innerHTML += 	[	'&nbsp; <span class="'+this.StyleCSS+'-info">Two 20! But third one never appeared</span>',
													'<span class="'+this.StyleCSS+'-default">First Roll&nbsp;'+ ArrayRolls[0] +'&nbsp; plus mods =&nbsp;',
													RollMod +'</span>',
													'&nbsp; <span class="'+this.StyleCSS+'-success">Critical Success!! ' + StringFormat(ArrayRolls) +'</span>'
											].join('\n');
					} else {
						Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-success">Critical!! ' + StringFormat(ArrayRolls) +'</span>';
					}


				} else if ( ArrayRolls[0] >= params.Critical && ArrayRolls[1] >= params.Critical  && ArrayRolls[1] >= params.Difficulty ) {
					// Critical
					if ( params.Mod ) {
						Template.innerHTML += 	[	'&nbsp; <span class="'+this.StyleCSS+'-info">Second Roll confirms critical</span>',
													'<span class="'+this.StyleCSS+'-default">First Roll&nbsp;'+ ArrayRolls[0] +'&nbsp; plus mods =&nbsp;',
													RollMod +'</span>',
													'&nbsp; <span class="'+this.StyleCSS+'-success">Critical Success!! ' + StringFormat(ArrayRolls) +'</span>'
											].join('\n');
					} else {
						Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-success">Critical!! ' + StringFormat(ArrayRolls) +'</span>';
					}

				} else if ( ArrayRolls[1] < params.Critical ) {
					// Simple success
					if ( params.Mod ) {
						Template.innerHTML += 	[	'&nbsp; <span class="'+this.StyleCSS+'-info">A possible Critical Roll',
													'but 2nd roll failed, Roll Result = ' + StringFormat(ArrayRolls) +'</span>',
													'&nbsp; <span class="'+this.StyleCSS+'-success">Success!! ' + RollMod +'</span>'
											].join('\n');
					} else {
						Template.innerHTML += 	'&nbsp; <span class="'+this.StyleCSS+'-success">Success!! ' + StringFormat(ArrayRolls) +'</span>';
					}

				}

			} else if ( Rolls[0] === 1 ) {

				ArrayRolls = CalcCrit(Rolls);

				if ( ArrayRolls[1] === 1 ) {

					Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-danger">Epic Fail!! ' + StringFormat(ArrayRolls) +'</span>';
				} else {
					Template.innerHTML += 	[	'&nbsp; <span class="'+this.StyleCSS+'-info">Natural 1 Roll means direct fail</span>',
												'&nbsp; <span class="'+this.StyleCSS+'-danger">Fail!! ' +StringFormat(ArrayRolls) +'</span>'
											].join('\n');
				}

			} else {
				if ( params.Mod ) {
					Template.innerHTML += 	[	'&nbsp; <span class="'+this.StyleCSS+'-info">Failed roll',
												'First Roll&nbsp;'+ Rolls[0] +'&nbsp; plus mods =&nbsp;',
												RollMod +'</span>',
												'&nbsp; <span class="'+this.StyleCSS+'-danger">Fail!! ' + RollMod +'</span>'
											].join('\n');
				} else {
					Template.innerHTML += '&nbsp; <span class="'+this.StyleCSS+'-danger">Faill!! ' + Rolls[0] +'</span>';
				}

			}

			d.appendChild(Template);
			d.scrollTop = d.scrollHeight;

		},
		confront: function ( attacker, defender ) {
			var d						= document.getElementById(this.HistoryBox),
				Template				= this.Template,
				Result					= 0,
				Roll					= 0,
				Params					= {},
				MyCritical				= 0,
				MySpecial				= 0,
				MyFail					= 0;

			Result = ( (  attacker - defender ) * 5 )+ 50;
			Roll = this.roller( this.DiceSides, 1 );

			this.CalcTresholds.setArgs(Result);

			MyCritical	= this.CalcTresholds.critical_value();
			MySpecial	= this.CalcTresholds.special_value();
			MyFail		= this.CalcTresholds.critical_fail_value(Params);

			if ( Result > 0 ) {

				Template.innerHTML = [	'<span class="'+this.StyleCSS+'-info">Confront '+ attacker +' vs ' + defender + '</span>',
										'&nbsp;<span class="'+this.StyleCSS+'-default">percentaje to roll '+ Result +'</span>'
									].join('\n');

			}

			if ( Roll <= Result &&
				Roll > MySpecial.MaxSpecial &&
				Result > 0 &&
				Roll < this.DirectFail ) {

				Template.innerHTML += '&nbsp;<span class="'+this.StyleCSS+'-success">Rolls for ' + Roll +', Success!!</span>';
			} else if ( Roll >= MyCritical.MinCritical &&
						Roll <= MyCritical.MaxCritical &&
						Result > 0 ) {

				Template.innerHTML += '&nbsp;<span class="'+this.StyleCSS+'-success">Rolls for ' + Roll +', Critical!!</span>';
			} else if ( Roll >= MySpecial.MinSpecial &&
						Roll <= MySpecial.MaxSpecial &&
						this.SpecialRoll &&
						Result > 0 ) {

				Template.innerHTML += '&nbsp;<span class="'+this.StyleCSS+'-success">Rolls for ' + Roll +', Special!!</span>';
			} else if ( Roll >= MyFail  && Result > 0 ) {

				Template.innerHTML += '&nbsp;<span class="'+this.StyleCSS+'-danger">Rolls for ' + Roll +', Critical Fail!!</span>';
			} else if ( Result === 0 || Result < 0 ) {

				Template.innerHTML = '&nbsp;<span class="'+this.StyleCSS+'-danger">Automatic Fail!! you don´t have a chance!!</span>';
			} else {

				Template.innerHTML += '&nbsp;<span class="'+this.StyleCSS+'-danger">Rolls for ' + Roll +', Fail!!</span>';

			}

			d.appendChild(Template);
			d.scrollTop = d.scrollHeight;

			return this;

		},
		dx: function( sides, rolls, difficulty ) {
			var Rolls			= [],
				WildDiceRoll	= [],
				WildRolls		= [],
				self			= this,
				d				= document.getElementById(this.HistoryBox),
				Template		= this.Template,
				SumRolls		= 0,
				z				= 0,
				FinalArray		= [],
				RollsSort		= [];

			function GetWild( WildDiceRoll, rolls, self ) {
				var WildRolls = [];

				whileloop:
				while ( true ) {

					WildDiceRoll = self.roller( sides, 1 );

					if ( WildDiceRoll[WildDiceRoll.length-1] === 6 || WildDiceRoll[0] === 6 ) {
						WildRolls.push(WildDiceRoll[WildDiceRoll.length-1]);

					} else {
						WildRolls.push(WildDiceRoll[WildDiceRoll.length-1]);
						break whileloop;
					}

				}

				return WildRolls;

			} //GetWild()

			Template.innerHTML += ['<span class="'+this.StyleCSS+'-primary">Rolls for:</span>&nbsp;',
									'<span class="'+this.StyleCSS+'-default">Difficulty of :&nbsp;'+difficulty+'</span>&nbsp;'
								].join('\n');

			/**
			 * comprobar si hay penalizador del dado salvaje,
			 * restando el dado salvaje y el más alto de los resultados
			 */

			if ( rolls > 1 ) {
				rolls -= 1;

				Rolls = this.roller( sides, rolls );
				WildDiceRoll = this.roller( sides, 1 );
				WildRolls.push(WildDiceRoll[0]);

				if ( WildDiceRoll[0] === 6 ) {

					WildRolls = GetWild( WildDiceRoll, rolls, self );
				} else if ( WildDiceRoll[0] === 1 ) {
					//Sort array, ascendent
					RollsSort = Rolls.sort(function(a,b){return a - b});
					/**
					 * As an ordered array, the rolls with higher values are at the end.
					 * As XD6 system, next step perfoms a delete on it.
					 */
					FinalArray = RollsSort.splice(RollsSort.length-1,1);


				}//else if

			} else if ( rolls === 1 ) {
				WildDiceRoll = this.roller( sides, 1 );

				if ( WildDiceRoll[0] === 1 ) {
					WildRolls.push(0);
					console.log('percance!');
				} else if ( WildDiceRoll[0] === 6 ) {
					console.log('salvaje');
					WildRolls = GetWild( WildDiceRoll, rolls, self );
				} else {

					WildRolls.push(WildDiceRoll[0]);

				}
			}

			if ( rolls > 1 && WildDiceRoll[0] !== 1) {

				for ( z = 0; z < Rolls.length; z++ ) {

					Template.innerHTML += '<span class="'+this.StyleCSS+'-default">'+Rolls[z]+'</span>';
					SumRolls += Rolls[z];
				}
				for ( z = 0; z < WildRolls.length; z++ ) {

					Template.innerHTML += '<span class="'+this.StyleCSS+'-warning">'+WildRolls[z]+'</span>';
					SumRolls += WildRolls[z];
				}
				Template.innerHTML += '<span class="'+this.StyleCSS+'-info">'+SumRolls+'</span>';

			} else {
				for ( z = 0; z < RollsSort.length; z++ ) {

					Template.innerHTML += '<span class="'+this.StyleCSS+'-default">'+RollsSort[z]+'</span>';
					SumRolls += RollsSort[z];
				}
				Template.innerHTML += '<span class="'+this.StyleCSS+'-info">'+SumRolls+'</span>';
				console.log('última ' +RollsSort);
			}

			if ( SumRolls >= difficulty ) {

				Template.innerHTML += '<span class="'+this.StyleCSS+'-success">Roll Success!!</span>';
			} else {
				Template.innerHTML += '<span class="'+this.StyleCSS+'-danger">Fail!!</span>';
			}


			d.appendChild(Template);
			d.scrollTop = d.scrollHeight;

		},
		/**
		 * This is a dice roller for Vampire Dark Age first edition 1996
		 */

		vda: function ( sides, rolls, difficulty ) {
			var d				= document.getElementById(this.HistoryBox),
				Template		= this.Template,
				Rolls			= [],
				FailCounter		= [],
				SuccessCounter	= [],
				NonSuccess		= [];

				Rolls = this.roller( sides, rolls );
				Rolls = Rolls.sort(function(a,b){return a - b});

				for ( var i = 0; i < Rolls.length; i++ ) {
					if ( Rolls[i] === 1 ) {
						FailCounter.push(Rolls[i]);
					} else if ( Rolls[i] >= difficulty ) {
						SuccessCounter.push(Rolls[i]);
					} else {
						NonSuccess.push(Rolls[i]);
					}
				}

				Template.innerHTML += [ '<span class="'+this.StyleCSS+'-info">Rolls for '+rolls+'d'+sides+'</span>',
										'<span class="'+this.StyleCSS+'-primary">Difficulty of '+difficulty+'</span>'
										].join('\n');

				if ( FailCounter.length > SuccessCounter.length ) {
					for ( i = 0; i < FailCounter.length; i++ ) {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-danger">'+FailCounter[i]+'</span>';
					}
					for ( i = 0; i < NonSuccess.length; i++ ) {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-default">'+NonSuccess[i]+'</span>';
					}
					for ( i = 0; i < SuccessCounter.length; i++ ) {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-warning">'+SuccessCounter[i]+'</span>';
					}

					Template.innerHTML += '<span class="'+this.StyleCSS+'-danger">Critical Fail</span>';


				} else if ( FailCounter.length < SuccessCounter.length || !FailCounter.length && SuccessCounter.length >= 1 ) {
					for ( i = 0; i < FailCounter.length; i++ ) {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-danger">'+FailCounter[i]+'</span>';
					}
					for ( i = 0; i < NonSuccess.length; i++ ) {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-default">'+NonSuccess[i]+'</span>';
					}
					for ( i = 0; i < SuccessCounter.length; i++) {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-success">'+SuccessCounter[i]+'</span>';
					}

					Template.innerHTML += '<span class="'+this.StyleCSS+'-success">Success!!</span>';

				} else if ( FailCounter.length === SuccessCounter.length ) {
					for ( i = 0; i < FailCounter.length; i++ ) {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-danger">'+FailCounter[i]+'</span>';
					}
					for ( i = 0; i < NonSuccess.length; i++ ) {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-default">'+NonSuccess[i]+'</span>';
					}
					for ( i = 0; i < SuccessCounter.length; i++) {
						Template.innerHTML += '<span class="'+this.StyleCSS+'-success">'+SuccessCounter[i]+'</span>';
					}

					Template.innerHTML += '<span class="'+this.StyleCSS+'-warning">Fail!!</span>';
				}

			d.appendChild(Template);
			d.scrollTop = d.scrollHeight;

		}

	};

	if(!window.D) window.D = D;

})(window);