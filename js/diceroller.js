(function (window, undefined) {
	'use strict';

	console.log('diceroller.js');

	var D = function (params) {
		return new Libs(params);
	};

	var Libs = function (params) {

		// Tipo de dado que se va a usar
		this.DiceSides				= params.DiceSides || 6;

		//Sistema percentil o por puntos
		this.Percentual				= params.Percentual;

		// Habilidad que se va a usar como base para la tirada de acierto
		this.BaseSkill				= params.BaseSkill || 100;

		// Bonificador a la habilidad
		this.BonusSkill				= params.BonusSkill || 0;

		// Penalizado a la habilidad
		this.BonusPenalty			= params.BonusPenalty || 0;

		// Porcentaje de habilidad usada para crítico
		this.CriticalTreshold		= params.CriticalTreshold || 10;

		// Multiplicador de daño en crítico
		this.CriticalMultiplier		= params.CriticalMultiplier || 2;

		// Crítico ignora armadura
		this.CriticalPierceArmor	= params.CriticalPierceArmor;

		// BRP viejas ediciones, tirada especial
		this.SpecialRoll			= params.SpecialRoll;

		// Especial, multiplicador al daño
		this.SpecialRollMultiplier	= params.SpecialRollMultiplier || 1.5;

		// BRP, umbral para especial (en porcentaje)
		this.SpecialRollTreshold	= params.SpecialRollTreshold || 20;

		// BRP, especial ignora armadura
		this.SpecialRollPierceArmor	= params.SpecialRollPierceArmor;

		// Pífia, true : se considera pífia, false : sin pífias
		this.EpicFail				= params.EpicFail;

		// Porcentaje para obtener la pifia.
		this.EpicFailTreshold		= params.EpicFailTreshold || 10;

		// Límite máximo de la pífia
		this.EpicFailMaxTreshold	= params.EpicFailMaxTreshold || 96;

		// BRP, Límitie mínimo de la pífia
		this.EpicfailMinTreshold	= params.EpicfailMinTreshold || 100;

		// true : Tirada abierta, false : una tirada única
		this.OpenRoll				= params.OpenRoll;

		// ID del textarea donde se añadirá los sucesos.
		this.HistoryBox				= params.HistoryBox || 'RollBox';

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
							template.innerHTML += ['&nbsp; <span class="lbox lbox-info"> Open Roll!</span>',
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
		armor: function( ArmorParams, FullDamage, showlog ){
			var ID			= this.HistoryBox,
				d			= document.getElementById(ID),
				template	= document.createElement('p'),
				RollArmor	= [],
				TempArmor	= 0,
				FDamage		= 0;

			for( var params in ArmorParams ) {
				if( ArmorParams.hasOwnProperty(params) ){
					for( var paramskey in ArmorParams[params] ) {
						if( ArmorParams[params][paramskey].Sides > 0 ){

							template.innerHTML +=	[	'<span class="lbox lbox-info">'+ ArmorParams[params][paramskey].Name +' Armor </span>',
														'&nbsp; '+ ArmorParams[params][paramskey].Rolls + 'd' + ArmorParams[params][paramskey].Sides,
													].join('\n');

							RollArmor = this.roller( ArmorParams[params][paramskey].Sides, ArmorParams[params][paramskey].Rolls );

							if( RollArmor.length > 1 ) {

								for ( var z = 0; z < RollArmor.length; z++ ) {
									TempArmor += parseInt( RollArmor[z], 10 );
								}
								template.innerHTML += [	'&nbsp : &nbsp<span class="lbox lbox-info">Dice Armor: ' + TempArmor + '</span>',
														'&nbsp + &nbsp<span class="lbox lbox-info">Fixed Armor: ' + ArmorParams[params][paramskey].Fixed + '</span>',
														'&nbsp = &nbsp<span class="lbox lbox-success"> Total: ' + ( parseInt(TempArmor, 10) + parseInt(ArmorParams[params][paramskey].Fixed, 10) ),
														'</span></br>'
													].join('\n');
								TempArmor = 0;
							} else {
								template.innerHTML += [	'&nbsp : &nbsp<span class="lbox lbox-info">Dice Armor: ' + RollArmor + '</span>',
														'&nbsp + &nbsp<span class="lbox lbox-info">Fixed Armor: ' + ArmorParams[params][paramskey].Fixed + '</span>',
														'&nbsp = &nbsp<span class="lbox lbox-success"> Total: ' + ( parseInt(RollArmor, 10) + parseInt(ArmorParams[params][paramskey].Fixed, 10) ),
														'</span></br>'
													].join('\n');
							}
						}// if

						if ( ArmorParams[params][paramskey].Sides === 0 && ArmorParams[params][paramskey].Fixed > 0 ){

							template.innerHTML += [		'<span class="lbox lbox-info">'+ ArmorParams[params][paramskey].Name +' Armor </span>',
														'&nbsp<span class="lbox lbox-info">Fixed Armor: ' + ArmorParams[params][paramskey].Fixed + '</span>',
														'&nbsp = &nbsp<span class="lbox lbox-success"> Total: ' + ArmorParams[params][paramskey].Fixed,
														'</span></br>'
													].join('\n');
						}// if
					}// for
				}// if
			}// for

			/*for ( var DmgParams in FullDamage ) {
				if ( FullDamage.hasOwnProperty(DmgParams) ) {
					if ( FullDamage[DmgParams].Damage.length > 1 ) {

						for ( var dmg = 0; dmg < FullDamage[DmgParams].Damage.length; dmg++ ) {
							FDamage += FullDamage[DmgParams].Damage[dmg];
						}
						template.innerHTML += 	[	'<span class="lbox lbox-info"> Damage : </span>',
													'&nbsp;'+ FullDamage[DmgParams].Rolls + 'd' + FullDamage[DmgParams].Sides,
													'&nbsp; = &nbsp; <span class="lbox lbox-success">Total &nbsp;' + FDamage + '</span>',
													'</br>'
												].join('\n');
						FDamage = 0;
					} else {

						template.innerHTML += 	[	'<span class="lbox lbox-info"> Damage : </span>',
													'&nbsp;'+ FullDamage[DmgParams].Rolls + 'd' + FullDamage[DmgParams].Sides,
													'&nbsp; = &nbsp; <span class="lbox lbox-success">Total &nbsp;' + FullDamage[DmgParams].Damage[0] + '</span>',
													'</br>'
												].join('\n');

						FDamage = 0;
					}
				}
			}// for*/



			if ( showlog ) {

				d.appendChild(template);

				// Con esta línea de código, hacemos que el resultado no sea tapado por el overflow.
				d.scrollTop = d.scrollHeight;

			} // showlog

			/*var a = {};
			 a['thisObj'] = this;
			 a['Damage'] = FullDamage;
			console.log(a);*/
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
					Special		: ParamsSkill.Special
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
													SplitedDamage + '</span>'
												].join('\n');

						} else if ( ParamsSkill.Special ) {
							//Special Rolls

							SplitedDamage = Modify_Roll_Dice('special', DataDamage, self);

							SumRolls = SumDamageArray[j] + ( Math.floor( params.ModDamage[j] ) * +this.SpecialRollMultiplier );

							template.innerHTML += [	'<span class="lbox lbox-warning"> Special x'+ this.SpecialRollMultiplier +'</span>',
													'<span class="lbox lbox-default">Rolls for a  : &nbsp;',
													SplitedDamage + '</span>'
												].join('\n');

						} else {
							// Normal rolls
							SplitedDamage = Modify_Roll_Dice('normal', DataDamage, self);

							SumRolls = parseInt( SumDamageArray[j], 10) + parseInt(params.ModDamage[j], 10 );

							template.innerHTML += [	'<span class="lbox lbox-default">Rolls for : &nbsp;',
													SplitedDamage + '</span>'
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
		/* magic ( attacks, showlog )
		 *
		 * These are the standard magic damage used in this method. You maybe wants
		 * to extend with new ones for your game system
		 *
		 * Basic magic damage: Arcane, Fire, Frost, Electric, Venom
		 *
		 * Standard nomenclature:
		 *
		 * 	arcane : [
		 *		{
		 *			Name 	: 'Arcane',
		 *			Sides 	: 6,
		 *			Fixed 	: 1,
		 *			Rolls 	: 1
		 *		}
		 *	],
		 *	fire : [
		 *		{
		 *			Name 	: 'Fire',
		 *			Sides 	: 6,
		 *			Fixed 	: 1,
		 *			Rolls 	: 1
		 *		}
		 *	],
		 *	etc...
		 *
		 * IMPORTANT: "Fixed" (refering to a fixed bonus or malus ) is applyed at
		 * the end of the dice roll, but only ONCE, not for every dice.
		 *
		 * The literal "Name", is for better and easy form of handling and taggin
		 * the name or title of the magic property.
		 *
		 */
		magic: function( attacks, showattack, magik, showlog ) {
			var DamageRollResult	= [],
				i					= 0,
				ID					= this.HistoryBox,
				d					= document.getElementById(ID),
				template			= document.createElement('p'),
				TempDamage			= [],
				DamageResult		= 0;

			for( var magprop in magik ) {
				if ( magik.hasOwnProperty(magprop)  ) {
					for ( var magpropkey in magik[magprop] ) {

						TempDamage = this.roller( magik[magprop][magpropkey].Sides, magik[magprop][magpropkey].Rolls );

						if( TempDamage.length > 1 ){

							for ( var j = 0; j < TempDamage.length; j++ ) {
								DamageResult += parseInt(TempDamage[j], 10);
							}

								template.innerHTML += ['<span class="lbox lbox-info">'+ magik[magprop][magpropkey].Name +'</span>',
													'&nbsp; : &nbsp;<span class="lbox lbox-primary">' + magik[magprop][magpropkey].Rolls + 'd' + magik[magprop][magpropkey].Sides + '</span>' ,
													'&nbsp; + &nbsp; ' + magik[magprop][magpropkey].Fixed ,
													'&nbsp; = &nbsp; <span class="lbox lbox-success">',
													DamageResult + '</span></br>'
													].join('\n');

							} else {

								template.innerHTML += ['<span class="lbox lbox-info">'+  magik[magprop][magpropkey].Name +'</span>',
														'&nbsp; : &nbsp;<span class="lbox lbox-primary">' + magik[magprop][magpropkey].Rolls + 'd' + magik[magprop][magpropkey].Sides + '</span>',
														'&nbsp; + &nbsp; ' + magik[magprop][magpropkey].Fixed ,
														'&nbsp; = &nbsp; <span class="lbox lbox-success">',
														TempDamage + '</span></br>'
														].join('\n');
							}// else
					}// for
				}// if
			}// for

			if ( showlog ) {

				d.appendChild(template);

			}

			// Con esta línea de código, hacemos que el resultado no sea tapado por el overflow.
			d.scrollTop = d.scrollHeight;

			return this;
		}
	};

	if(!window.D) window.D = D;

})(window);