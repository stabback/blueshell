import {Base} from '../nodes/Base';
import {BlueshellState} from '../nodes/BlueshellState';
import {resultCodes as rc} from './resultCodes';
import {Decorator} from '../nodes/Decorator';
import {Composite} from '../nodes/Composite';

import {v4} from 'uuid';

const DefaultStyle = 'style="filled,bold"';

const DecoratorShape = 'shape=ellipse';
const CompositeShape = 'shape=diamond height=1';
const DefaultShape = 'shape=box';

const SuccessColor = 'fillcolor="#4daf4a"';
const FailureColor = 'fillcolor=#984ea3';
const RunningColor = 'fillcolor="#377eb8"';
const ErrorColor = 'fillcolor="#e41a1c"';
const DefaultColor = 'fillcolor="#e5e5e5"';

const DefaultEdgeColor ='color="#000000"';

function getShape<S extends BlueshellState, E>(node: Base<S, E>): string {
	if (node instanceof Decorator) {
		return DecoratorShape;
	} else if (node instanceof Composite) {
		return CompositeShape;
	} else {
		return '';
	}
}

function getColor<S extends BlueshellState, E>(node: Base<S, E>, state?: S): string {
	if (state) {
		const eventCounter = node!.getTreeEventCounter(state);
		const lastEventSeen = node!.getLastEventSeen(state);
		const lastResult = node!.getLastResult(state);

		if (lastEventSeen === eventCounter && lastResult) {
			switch (lastResult) {
			case rc.ERROR:
				return ErrorColor;
			case rc.SUCCESS:
				return SuccessColor;
			case rc.RUNNING:
				return RunningColor;
			case rc.FAILURE:
				return FailureColor;
			}
		}
	}
	return '';
}

function getNodeId<S extends BlueshellState, E>(node: Base<S, E>): string {
	const anyfiedNode: any = node;
	if (!anyfiedNode.__nodeId) {
		anyfiedNode.__nodeId = `n${v4().replace(/\-/g, '')}`;
	}
	return anyfiedNode.__nodeId;
}

function getLabel<S extends BlueshellState, E>(node: Base<S, E>): string {
	if (node.symbol) {
		return `label="${node.name}\\n${node.symbol}"`;
	} else {
		return `label="${node.name}"`;
	}
}

function getTooltip<S extends BlueshellState, E>(node: Base<S, E>): string {
	return `tooltip="${node.constructor.name}"`;
}

export function serializeDotTree<S extends BlueshellState, E>(root: Base<S, E>, state?: S): any {
	if (!root) {
		return '';
	}

	const nodesToVisit: Base<S, E>[] = [];

	let resultingString = `digraph G {
	node [${DefaultShape} ${DefaultColor} ${DefaultStyle}]
	edge [${DefaultEdgeColor}]
`;

	nodesToVisit.push(root);

	while (nodesToVisit.length) {
		const currentNode = nodesToVisit.pop();

		const nodeId = getNodeId(currentNode!);

		resultingString += `\t${nodeId} `;
		resultingString += `[${getLabel(currentNode!)} ${getShape(currentNode!)} ${getTooltip(currentNode!)}`;
		resultingString += `${getColor(currentNode!, state)}];\n`;

		if ((<any>currentNode).children) {
			resultingString = (<any>currentNode).children.reduce(
				(acc: string, child: Base<S, E>) => (`${acc}\t${nodeId}->${getNodeId(child)};\n`),
				resultingString);
			for (const child of [...(<any>currentNode).children].reverse()) {
				nodesToVisit.push(child);
			}
		}
	}

	resultingString += '}';

	return resultingString;
}
