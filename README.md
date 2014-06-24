DiceRoller
==========

Little javascript library to help roll game players to make quick and easy web apps for roll various kind of dices.

As later version, diceroller.js relies on [**David Bau ** seedrandom.js](https://github.com/davidbau/seedrandom) for a better random number generation. Is a very little library ( 2kb minified ).

For a non dependecy library using default javascript Math.Random(), there's a version without seedrandom.js

==My apologies:== if documentation is a liltle (or a lot) weird, my native languaje isn't english, but a do my best to be clearer and non weirder. Thanks!

##Specifications:

- Single o multi dice rolls.

- Damage calculation.

- Armor protection or damage reduction.

- Dice Roller for BRP

- Dice Roller for MERP (second edition).

- Dice roller for D20 games.

- Dice roller for XD6 games.
 
- Dice roller for Vampire Dark Age first edition

##Getting Starterd

DiceRoller is a light and simple **javascript** library made for help DM and players develop tools for make life easyer. Is a standalone libray, with optional use of seedrandom.js for a better random number generation.
For use dicerroller.js, other plugins aren´t required, only a little of time for set your game system.

Two versions of diceroller.js will be supported. With [seedrandom](https://github.com/davidbau/seedrandom) and standalone without this plugin.

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>DiceRoller</title>
		<link rel="stylesheet" href="css/roller.css">
		<script src="js/diceroller.js"></script>
		<script src="js/seedrandom.js"></script> <!-- Optional -->
	</head>
	<body>
		...content...
	</body>
<html>

```
##Setting game system
Set game rules is basic for the performance of DiceRoller

```javascript
var GameSystem = {

		DiceSides	 			: 100,
		Percentual				: true,
		BaseSkill	 			: 0,
		OpenRoll				  : false,
		BonusSkill				: 0,

		CriticalTreshold		  : 10,
		CriticalMultiplier		: 2,
		CriticalPierceArmor	   : false,

		SpecialRoll			   : false,
		SpecialRollMultiplier	 : 0,
		SpecialRollTreshold	   : 0,
		SpecialRollPierceArmor	: false,

		EpicFail				  : true,
		EpicFailTreshold		  : 5,
		EpicFailMaxTreshold	   : 100,
		EpicFailMinTreshold   	: 100,
		DirectFail				: 96,

		HistoryBox				: 'RollBox',
		TagElement				: 'p',
		StyleCSS			  	: 'lround lround'

};

```

`DiceSides`: Define how many sides uses the main dice. Games like MERP or BRP uses 1d100. 

`Percentual`: BRP games (like Rune Quest) uses a percentual system. Putting this option to false, automatically makes game system as a difficulty system (MERP or D&D game system).

`BaseSkill`: A basic skill punctuation for roll on it.

`OpenRoll`: MERP like system uses a "open roll" when the dice roll reaches certain puntuation

`BonusSkill`: Add a puntuation modificator to the roll. Can be negative (a penalty to the roll).

`CriticalTreshold`: Used as a percentage of the BaseSkill in BRP like system. A '10' means 10% of the BaseSkill.

`CriticalMultiplier`: Critical hits multiplies damage? put your multiplier in this option.

`CriticalPierceArmor`: Critical ignores armor protection? Set true here.

`SpecialRoll`: **Percentile system.** Some game systems adds an extra success, better than a normal one, lesser than a critical. Set true if your game system use it.

`SpecialRollMultiplier`: **Percentile system.** Set damage multiplier of the Special Roll.

`SpecialRollTreshold`: **Percentile system.** Same as CriticalTreshold, but for Special roll. Pay attention, as the example from above with a BaseSkill: 50, crítical is set to 10% and Special to 20%. These mean, from 1% to 5% roll are crítical, and 6% to 10% are special rolls

`SpecialRollPierceArmor`: Set to true if Special rolls ignores armor.

`EpicFail`: EpicFail rolls needed? set to true.

`EpicFailTreshold`: As Critical and Special roll, sets a percetage for Epic Fail rolls. In BRP like systems, usually is a range from 96 to 100% rolls.

`EpicFailMaxTreshold`: Mínimal roll for a "succes fail". Example is set to 96, means a roll from 96 or more will be a EpicFail.

`EpicFailMinTreshold`: independently, a máximun range can be setted.

`DirectFail`: Set a minimun range where all rolls are automatic fails.

`HistoryBox`: ID of the div for the roll log.

`TagElement`: All logs are wrapped in a 'p' tag by default.

`StyleCSS`: diceroller.js uses a default css file with styles. The first one is the shape of the rolls, and the second one is the color.

In a example of the generated html:
```html
	/*The code inside dicerroller.js */
	<span class=" + 'this.StyleCSS + '-default"></span>
	
	/*The resulting html*/
	<span class="lround lround-default"></span>
```

##Using DiceRoller
DiceRoller uses "D" as a prefix for invoking it, like this

`D().roll(3,6,0);`

The example from avobe is a very simple method, invoking a 3 rolls of 6 sides dice and a 0 modifier (a bonification to the roll or a penalty);

`D().roll(2,6,6);`

These other example does a 2d6+6 roll.

##### Caching D([GameSystem])

Is possible to catch various game rules or different situations in the same game (no armor piercing, no critical rolls, Critical Fail increased, more difficulty, etc). Caching in a variable is a good option.

```javascript

var GameSystem = {
		DiceSides	 			: 100,
		Percentual				: true,
		BaseSkill	 			: 0,
		OpenRoll				  : false,
		BonusSkill				: 0,
		
		etc..
};

var MySys = D(GameSystem);

MySys.skill(1,100,0,false,false);

```

#### Skill method:

A dice roller mainly used for standard skill rolls. Set a difficult, your dice sides, rolls, any modificator ( a bonus or a penalty ) and/or a difficulty ( if you game rules need it);

**skill( rolls, sides, mod, skill, difficulty ):**

```javascript
//Makes 1d100 roll

var GameSystem {
	// Set your rules
}
var system = D(GameSystem); //catched version

system.skill(1,100,0,false,false);

// Non cached
D(GameSystem)skill(1,100,0,false,false);

//Default rules
D()skill(1,100,0,false,false);

```

**Parameters**

`rolls and sides`: How many rolls and how many sides have our dice.

`mod`: A bonification or a penaltiy for this roll. This mod is applied first at skill, not at the end of the roll.

`skill`: Base puntuation of the rolled skill. If is not defined, by default uses BaseSkill. Set to 0 is possible if a skill does not required.

`difficulty`: Set a difficulty to overcome in non percentual game system.

**Skill() Return object:**

Skill returns an object like the sequent example:

```javascript

RollsObj = {

	Roll : RollResult,
	Critical : true,
	Special: false,
	EpicFail: false,
	Fail: false

};

```

**Parameters returned:**

`Roll`: Returns the final result of the skill roll.

`Critical`: true for a critical roll. For damage rolls, damage() will apply damage modificators if this options is true.

`Special`: true for a special roll. As 'Critical', if set to true, damage() will apply damage modificators.

`EpicFail`: true if the roll result is a Epic Fail.

`Fail`: false for a succes, true for a fail.

#### Damage method:

A tricky one!, as players increases their power (level, loot... both!), damage can come from different forms, like a flaming sword (phsycal damage and fire ), or a corrosive poison (poison and acid).

Is importan to declares damage of weapon/spell one by one for a correct damage calculation.

*Don´t forget your attack roll!! *

Damage can´t predict if your roll is critical or not. May you want to do an automatic one click skill roll and damage, or use a predefined roll. Is posible to do both.

**damage(params, ParamsSkill, showlog):**

```javascript
// Following the exaple of our "Flamig Sword", this terrifying wepon does 1d8+1 (as sword) and 3d4-3 as fire.

// Using Skill() for a auto generate skill rolls usign default game rules

D().damage({	
		Sides : [ 8, 4 ],
		ModDamage: [ 1, -3 ],
		Rolls: [ 1,  3 ],
		TypeDamage:['Physic', fire']
	},
	D().skill(1,100,0,false,false), 
	true
);

// Passing pre defined skill rolls

var skill = {

	//damage() looks for an array in 'Roll' property
	Roll : [15],
	Critical : true,
	Special: false,
	EpicFail: false,
	Fail: false

};

D().damage({	
		Sides : [ 8, 4 ],
		ModDamage: [ 1, -3 ],
		Rolls: [ 1,  3 ],
		TypeDamage:['Physic', fire']
	},
	skill, 
	true
);
```

**Parameters**

`params`: Basic parameters. Multiple dices, mods an rolls can be defined

- `Sides`: Define dices sides.

- `ModDamage`: Set a bonification or a penalty to the result. Is applied at the end of the roll.

- `Rolls`: Set how many rolls for dice.

- `TypeDamage`: Label your damage type. Is important for logs and armor(), for matching this kind of damanges. Is ussual for some criaturas or high level characters to do multiple kind of damage (flaming swords, poisoned weapons, etc)-

`ParamSkill`: Method Skill() can be passed, passing an object with the roll result (see skill method and the object returned).

`showlog`: shows the rolls and the result on a div as a log. Div ID setted on `system.Historybox`

#### Armor method

Very simmilar as 'damage()'. This method needs to be defined before with the armor types on your game.

In an object type, you can define every kind of armor to any kind of damage. As a more easy management of armor/protection, is better to declare the most used protections.

Setting sides, fixed and rolls to 0, this protection will be ignored.

######Armor settings:

```javascript

var armor = {

	physic : [ { Name: 'Physic', Sides : 6, Fixed : 1, Rolls : 1 } ],
	DamageReduction : [ { Name: 'Damage Reduction', Sides : 0, Fixed : 1, Rolls : 1 } ],
	arcane : [ { Name: 'Arcane', Sides : 6, Fixed : 1, Rolls : 1 } ],
	fire : [ { Name: 'Fire', Sides : 10, Fixed : 0, Rolls : 1 } ],
	frost : [ { Name: 'Frost', Sides : 6, Fixed : 0, Rolls : 2 } ],
	electric : [ { Name: 'Electric', Sides : 0, Fixed : 4, Rolls : 1 } ],
	poison : [ { Name: 'Poison', Sides : 0, Fixed : 1, Rolls : 3 } ]

};

```


##### Parameters of armor object:

- `Name`: Name showed on the log.

- `Sides`: Sides of the Dice Armor.

- `Fixed`: Bonificator or penalty for the dice result.

- `Rolls`: How many rolls per dice.

Setting Sides at 0 doesn´t skip armor calculation, cause the game system maybe uses fixed values of damage reduction. 

**Example of mixed roll and fixed values:**

An armor of 1d10+1 of physical (non magic or elemental damage) is :

```javascript
var armor = {

	physic : [ { Name: 'Physic', Sides : 10, Fixed : 1, Rolls : 1 } ]
	
};
```
Same example, but only protects 6 damage points:
```javascript
var armor = {

	physic : [ { Name: 'Physic', Sides : 0, Fixed : 6, Rolls : 0 } ]
	
};
```

Following the example of the "flaming sword", if your armor have +1d6-1 fire protection, the armor object will be the sequent:

```javascript
var armor = {

	physic : [ { Name: 'Physic', Sides : 0, Fixed : 6, Rolls : 0 } ],
	fire : [ { Name: 'Fire', Sides : 6, Fixed : -1, Rolls : 1 }]
	
};
```

-----

**Armor(ArmorParams, FullDamage, Showlog);**

```javascript

//As a complete combat sequence of roll-hit-damage-armor with default settings:

var DmgResult = D().damage({
		// Our gorgeous Flaming Sword (1d8+1) + 3d4-3
		Sides : [ 8, 4 ],
		ModDamage: [ 1, -3 ],
		Rolls: [ 1,  3 ],
		TypeDamage:['Physic', fire']
	},
	system.skill(1,100,0,false,false), 
	true
);

// Passing armor object previous defined, following the damage roll stored in DmgResult and 
// setting showlog as true.

D().armor(armor, DmgResult, true);

```
**Parameters**

- `armor`: Described above in "Armor Settings".

- `DmgResult`: Damage calculated from damage()

- `showlog`: shows the rolls and the result on a div as a log. Div ID setted on `system.Historybox`

###D20 Roller:

This is a specific dice roller for games based on **D&D**. I used the free open game documents from *Wizards of the Coast*.

Suitable for all games who uses this basic rules.

d20() have a very high independecy from game rules, except for style and showlog.

**D().d20( params );**

```javascript

D().d20({
			Sides: 20,
			Rolls: 1,
			Mod: 5,
			Difficulty: 20,
			Critical: 15,
			EpicFail: true
		});

	
```
**Parametes :**

 - `Sides:` yes, i know this is a "D20" roller, but may be needs some restriction o using a modified version with a "D30".
 
 - `Rolls:` How many rolls for your dice.
 
 - `Mod:` put your modificators roll here (if there mor than one, sum it).
 
 - `Difficulty:` Sets roll difficulty to overcome.
 
 - `Critical:` Some feats augments your critical treshold.
 
 - `EpicFail:` Set to false to ignore Critical Fails.
 
###XD6 roller

A roller for games who uses six sides dice, like Star Wars or Z-Corps, generally named as ==XD6== game system.

```javascript
//Example for a 6d8 roll, difficulty set to 20 and a 'WildDice'

D().dx(6,8,20,true);
```

XD6 sometimes uses a "Wild Dice" or a "Chaos Dice". Ussually is a different colored d6, with the particularity of "exploding" property.

The "exploding" means a 6 result and roll again, until a non 6 result appears, more fammiliar for MERP players as "open roll", but only for this "different roll".

The Wild Dice isn´t a extra dice to add to your rolls, is one of your dices. As example, your character needs to open a locked door, and your skill for unlock it is 3d6 with a difficulty of ==20==.
The easy part to understand is "your cannot accomplish that, cause 6x3 = ==18== ", but your roll isn´t 3d6, your roll is 2d6 plus Wild Dice. Your roll for 5 and 3, but the Wild Dice rolls for 6 and eplodes and roll again for 6, and for a 3.

Finally, your roll is 5, 3, 6, 6 and 3, == Total of 23 ==, you´re succesful and unlock the door.

If your skill only have one dice, this dice is a Wild Dice.

```javascript
// dx(sides, rolls, difficulty, wildDice)

//Example of a 6d8, with difficulty set to 20 and Wild Dice enabled
D().dx(6,8,20,true);

```

**Params:**
 - `Sides:` As said in d20(), may use a game very simmilar, but with different dices. Set your dice sides here.
 
 - `Rolls:` How many rolls for your dices.
 
 - `Difficulty:` Set difficulty roll.
 
 - `WildDice:` Set to true to enable Wild Dice.
 
##### Rule of one:#####

XD6 by default uses "==the rule of one==". If the Wild Dice rolls for 1, the biggest dice roll will be supressed and, of course, the Wild Dice.

But this isn't means a failure, if the sum of the rest of dices are bigger than difficulty setted, the roll have a success (in game terms, may be very marginal), but a failure can be (in game) a critical fail.

---

###Confront

Very specific roller for confornt habilities or punctuations in BRP. Very common on BRP games do a "fight" of punctuations like STRength VS CONstitution.

**How it works:**

Using a base of 50% for the two punctuations, sums +5% for every point of differente from attacker (STR) and defender (CON).

Using number of STR 18 and CON 12 is very simple, is a difference operation 18-12 = 6. And for every point of difference adds a 5% : 6 * 5 = +30%. Means a 50% of base roll plus 30 equals a 80% of possibilities to win.

But inverse case is possible, changing numbers from STR 18 to 12 and CON 12 to 18, looks like this : 

` 12 - 18 = -6; -6 * 5 = -30%; 50 + ( -30 ) = 20% `

The attacker only have 20% chances to win.

**D().confront(attacker, defender)**

```javascript
//Attacker and defender, this example is a 50-50 chances to win for attacker and defender.
	
D().confront(15,15);

```
**Params:**

Very simple, as only needs to set the punctuations for the encounter. But as a tool for percentual game rules, set your´s with critical, special, critical fail, etc.

###VDA Roller
VDA means **Vampire: Dark Age**. Is the roller for first edition (1996) of this game. Very simple and simmilar to XD6, but in VDA your roll many dices as your principal hability and your skill (or discipline), and only need one succes.

As more successes, better realization of the action. With no critical rolls and a dífficult to overcome every dice (XD6 sums all reults).

**D().vda(Sides, Rolls, Difficulty**

```javascript
//Rolls 6d10, and a difficulty of 8

D().vda(10,6,8);
```
**Params:**
 - `Sides:` Sides of your main dices.
 
 - `Rolls:` How many rolls.
 
 - `Difficulty:` Difficulty to overcome. As said before, in this game rules, every dice needs to surpass difficulty, but is enought with only one for a marginal success.

####Game settings in d20(), dx() and vda():

d20(),dx() and vda() uses his own rules, and only few of game settings will be used. ==CSS== styles and the "log box" needs to be set if you want to use a different one, or the tag wrapping every roll (by default uses a 'p' tag).
