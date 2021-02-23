/* eslint-disable no-await-in-loop */
import {Command, flags} from '@oclif/command'
import {prompt} from 'inquirer'
import {yellow, green, cyan, blue, red, white} from 'chalk'
import {Random} from 'random-js'

const random = new Random()

const quitVal = 3

const choices = [
  {value: 0, name: 'Rock'},
  {value: 1, name: 'Paper'},
  {value: 2, name: 'Scissors'},
  {value: quitVal, name: 'Quit'},
]

interface GameData {
  choice: number;
}

interface Score {
  userScore: number;
  computerScore: number;
}

export default class Game extends Command {
  static description = 'Start game'

  static flags = {
    help: flags.help({char: 'h'}),
  };

  async getInteractiveArgs() {
    const answer = await prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Make your choice:',
        default: '',
        choices,
        validate(value) {
          if (value.length === 0) {
            return 'You should choose your turn or select Quit'
          }
          return true
        },
      },
    ])

    return answer
  }

  async makeTurn(gameData: GameData, score: Score) {
    const {choice} = gameData
    if (choice === quitVal) {
      return
    }

    const turnValue = random.integer(1, 2)
    const turnData = choices.find(e => e.value === turnValue) || {name: 'err'}
    const {name} = turnData
    this.log(yellow(`Computer choice: ${name}`))

    switch (turnValue - choice) {
    case 2: // Scissors -> Rock
    case -1: // Rock -> Paper, Paper -> Scissors
      score.userScore += 1
      this.log(white('You win!'))
      break
    case 1: // Scissors -> Paper, Paper->Rock
    case -2: // Rock -> Scissors
      score.computerScore += 1
      this.log(red('Computer win.'))
      break
    case 0: // Equals
      this.log(cyan('Nobody win.'))
      break
    default:
    }

    this.log(blue(`SCORE: Computer: ${score.computerScore} | You: ${score.userScore}`))
  }

  async run() {
    this.log(green('Welcome to the Game!'))
    let gameData: GameData
    const score: Score =  {
      userScore: 0,
      computerScore: 0,
    }
    do {
      gameData = await this.getInteractiveArgs()
      this.makeTurn(gameData, score)
    } while (gameData.choice !== quitVal)

    this.log(green('Bye bye!!!'))
  }
}
