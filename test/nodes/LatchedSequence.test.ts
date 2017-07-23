/**
 * Created by josh on 1/15/16.
 */
'use strict';

import {assert} from 'chai';

import {
	Operation,
	LatchedSequence,
	ResultCodes,
} from '../../lib';

import {BasicState} from './test/Actions';

class StopMotors extends Operation<BasicState> {

	onRun(state: BasicState): Promise<ResultCodes> {

		state.commands.push('motorsStopped');

		return Promise.resolve(ResultCodes.SUCCESS);
	}
}

class StopLasers extends Operation<BasicState> {

	onRun(state: BasicState): Promise<ResultCodes> {
		let storage = this.getNodeStorage(state);

		storage.cooldown = storage.cooldown ? --storage.cooldown : state.laserCooldownTime;

		let result = ResultCodes.SUCCESS;

		console.log('Storage cooldown is ', storage.cooldown);

		if (storage.cooldown > 0) {
			result = ResultCodes.RUNNING;
		} else {
			state.commands.push('lasersCooled');
		}

		return Promise.resolve(result);
	}
}

class Shutdown extends Operation<BasicState> {

	onRun(state: BasicState): Promise<ResultCodes> {
		state.commands.push('powerOff');

		return Promise.resolve(ResultCodes.SUCCESS);
	}
}

let shutdownSequence = new LatchedSequence('shutdownWithWaitAi',
	[
		new StopMotors(),
		new StopLasers(),
		new Shutdown()
	]);

describe('LatchedSelector', function() {

	it('should onRun correctly', function() {

		// With a happy bot
		let botState: BasicState = new BasicState();
		botState.laserCooldownTime = 0;

		let p = shutdownSequence.run(botState);

		return p.then(res => {
			assert.equal(res, ResultCodes.SUCCESS, 'Behavior Tree success');
			assert.equal(botState.commands.length, 3, 'Need Three Commands');
			assert.equal(botState.commands[0], 'motorsStopped');
			assert.equal(botState.commands[1], 'lasersCooled');
			assert.equal(botState.commands[2], 'powerOff');
		});
	});

	it('should loop correctly', function() {
		// With a happy bot
		let botState: BasicState = new BasicState();
		botState.laserCooldownTime = 1;

		let p = shutdownSequence.run(botState);

		return p.then(res => {
			assert.equal(res, ResultCodes.RUNNING, 'Behavior Tree Running');
			assert.equal(botState.commands.length, 1);
			assert.equal(botState.commands[0], 'motorsStopped');

			return shutdownSequence.run(botState);
		}).then(res => {

			assert.equal(res, ResultCodes.SUCCESS, 'Behavior Tree Success');
			assert.equal(botState.commands.length, 3, 'Need Three Commands');
			assert.equal(botState.commands[0], 'motorsStopped');
			assert.equal(botState.commands[1], 'lasersCooled');
			assert.equal(botState.commands[2], 'powerOff');
		});
	});
});
