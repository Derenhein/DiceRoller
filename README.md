DiceRoller
==========

Little javascript library to help roll game players to make quick and easy web apps for roll various kind of dices

##Specifications:

- Single o multi dice rolls

- Damage calculation

##Getting Starterd

DiceRoller is a light and simple **javascript** library made for help DM and players develop tools for make life easyer.

Made in javascript, don´t need other libreries like **JQuery**.

At this time, i´m using **Bootstrap CSS** for easy styling, but is planned to develop a custom CSS.

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>DiceRoller</title>
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<link rel="stylesheet" href="css/roller.css">
		<script src="js/diceroller.js"></script>
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

		DiceSides: 100,
		Percentual: false,
		BaseSkill: 50,
		OpenRoll: true,
		BonusSkill: 0,
		HistoryBox: 'logbox',

		CriticalTreshold: 10,
		CriticalMultiplier: 2,
		CriticalPierceArmor: true,

		SpecialRoll: true,
		SpecialRollMultiplier: 1.5,
		SpecialRollTreshold: 20,
		SpecialRollPierceArmor: true,

		EpicFail: true,
		EpicFailTreshold: 10,
		EpicFailMaxTreshold: 96,
		EpicFailMinTreshold: 100

};

```

`DiceSides`: Define how many sides uses the main dice. Games like MERP or BRP uses 1d100. 

`Percentual`: BRP games (like Rune Quest) uses a percentual system. Putting this option to false, automatically makes game system as a difficulty system (MERP or D&D game system).

`BaseSkill`: A basic skill punctuation for roll on it.

`OpenRoll`: MERP like system uses a "open roll" when the dice roll reaches certain puntuation

`BonusSkill`: Add a puntuation modificator to the roll. Can be negative (a penalty to the roll).

`HistoryBox`: ID of the div for the roll log.

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

##Using DiceRoller
DiceRoller uses "D" as a prefix for invoking it, like this

`D(gamesystem).roll(3,6,0);`

The example from avobe is a very simple method, invoking a 3 rolls of 6 sides dice and a 0 modifier (a bonification to the roll or a penalty);

`D(gamesystem).roll(2,6,6);`

These other example does a 2d6+6 roll.

##### Catching D([GameSystem])

More comfortable form to use the same game system on every DiceRoller method is catching it like this:

```javascript

var MySys = D(GameSystem);

MySys.roll(2,6,6);

```
#### Skill method:

Mainly used for skill rolls, like combat skill, jump, craft, riding, etc. Accepts extra parameters like a modification to the roll, punctuation of the skill and difficulty to overcome.

**skill(rolls, sides, mod, skill, difficulty):**

```javascript

//Makes 1d100 roll

system.skill(1,100,0,false,false);

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

`Critical`: true for a critical roll.

`Special`: true for a special roll.

`EpicFail`: true if the roll result is a Epic Fail.

`Fail`: false for a succes, true for a fail.

#### Damage method:

Method used for calculate and show damage.

**damage(params, ParamsSkill, showlog):**

```javascript

system.damage({
		// this example is for a (2d6+2) + 1d4-3
		Sides : [ 6, 4 ],
		ModDamage: [ 2, -3 ],
		Rolls: [ 2,  1 ],
		TypeDamage:['Physic', fire']
	},
	system.skill(1,100,0,false,false), 
	true
);

```

**Parameters**

`params`: Basic parameters. Multiple dices, mods an rolls can be defined

- `Sides`: Define dices sides.

- `ModDamage`: Set a bonification or a penalty to the result. Is applied at the end of the roll.

- `Rolls`: Set how many rolls for dice.

- `TypeDamage`: Label your damage type. Is important for logs and armor(), cause in some game systems, elemental or nos physical damage may need from specific armor against it.

`ParamSkill`: Method Skill() can be passed, passing an object with the roll result (see skill method and the object returned).

`showlog`: shows the rolls and the result on a div as a log. Div ID setted on `system.Historybox`

#### Armor method ~ WIP

Used to calculate armor protection (damage absorption). In actual version of DiceRoller, damage is calculate as a "generic" damage, doesn´t differ from magic or elemental damage.

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

The code from above prepares a object with an array of data, putting generic types of damage in almost all rolgames.

##### Parameters of armor object:

- `Name`: Name showed on the log.

- `Sides`: Sides of the Dice Armor.

- `Fixed`: Bonificator or penalty for the dice result.

- `Rolls`: How many rolls per dice.

Setting Sides at 0 doesn´t skip armor calculation, cause the game system maybe uses fixed values of damage reduction.

**Armor(ArmorParams, FullDamage, Showlog);**

```javascript

//combined skill() result with damage() and armor()

var DmgResult = system.damage({
		// this example is for a (2d6+2) + 1d4-3
		Sides : [ 6, 4 ],
		ModDamage: [ 20, -3 ],
		Rolls: [ 2,  1 ],
		TypeDamage:['Physic', fire']
	},
	system.skill(1,100,0,false,false), 
	true
);

system.armor(armor, DmgResult, true);

```
**Parameters**

- `armor`: Described above in "Armor Settings".

- `DmgResult`: Damage calculated from damage()

- `showlog`: shows the rolls and the result on a div as a log. Div ID setted on `system.Historybox`
