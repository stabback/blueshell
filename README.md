Blueshell is a Promise-based Behavior Tree implementation using modern ES6 syntax.

[![Circle CI](https://circleci.com/gh/6RiverSystems/blueshell/tree/master.svg?style=svg)](https://circleci.com/gh/6RiverSystems/blueshell/tree/master)

## Node Types

### Actions (aka Tasks or Execution Nodes)

* Action
* Condition

### Composites (aka Control Flow Nodes)

* Selector (aka Priority or Fallback)
  - Sends an event to each child until one of them returns `SUCCESS` or `RUNNING`, then returns that value.
	- If we exhaust all the children, return `FAILURE`.

* LatchedSelector
  - Sends an event to each child until one of them returns `SUCCESS` or `RUNNING`, then returns that value.
	- If we exhaust all the children, return `FAILURE`.
	- If a child returns `RUNNING`, subsequent events start at that child.

* Sequence
  - Sends an event to each child until one of the returns `FAILURE`, or `RUNNING`, then returns that value.
  - If all children return `SUCCESS`, return `SUCCESS`.

* LatchedSequence
  - Sends an event to each child until one of the returns `FAILURE`, or `RUNNING`, then returns that value.
  - If all children return `SUCCESS`, return `SUCCESS`.
  - If a child returns `RUNNING`, subsequent events start at that child.

### Decorators

* Not

### Base Classes

* Base
  The base of all nodes.

* Composite
  The base class for all nodes which have children.

* Decorator
  Base class for decorators - can only have one child.

## Inspiration and Further Reading

The following are sources used when designing this library

- [Handling Node Traversal](http://stackoverflow.com/a/15725129/1017787)
- [Difference between a Decision Tree and a Behavior Tree](http://gamedev.stackexchange.com/questions/51693/decision-tree-vs-behavior-tree)
- [Behavior Trees for AI](http://www.gamasutra.com/blogs/ChrisSimpson/20140717/221339/Behavior_trees_for_AI_How_they_work.php)
- [Wikipedia Article](https://en.wikipedia.org/wiki/Behavior_tree_(artificial_intelligence,_robotics_and_control))


### Unread

- [What is a Behavior Tree?](http://www.opsive.com/assets/BehaviorDesigner/documentation.php?id=44)
- [Halo 2's AI](http://www.gamasutra.com/view/feature/130663/gdc_2005_proceeding_handling_.php)
  - Halo 2 was the first game to popularize Behavior Trees.


## Name

`Blueshell` is named for a _Skroderider_ from the novel [_A Fire Upon the Deep_](https://en.wikipedia.org/wiki/A_Fire_Upon_the_Deep)
by Vernor Vinge. Skroderiders are intelligent plants (trees) that use mechanical constructs to give them locomotion
and short-term memory.

In other words, `Blueshell` is an intelligent tree. Or a tree with behavior. Get it?
