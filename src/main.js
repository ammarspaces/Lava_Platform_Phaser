import Phaser from 'phaser'

import CollectingCoins from './scenes/CollectingCoins'

const config = {
	type: Phaser.AUTO,
	width: 1000,
	height: 750,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [CollectingCoins]
}

export default new Phaser.Game(config)
