import readline from 'readline-sync'
import { table } from 'table'
import rand from 'random-key'
import crypto from 'crypto'

function computerMove(args) {
    return args[Math.floor(Math.random() * args.length)]
}

function generateKey() {
    return rand.generate(64)
}

function generateHmac(key, token) {
    return crypto.createHmac('sha256', key)
        .update(token)
        .digest('hex')
}

function principles(userInput, computerMove, args) {
    let middle = Math.floor(args.length / 2)
    let winning = []
    let i = 0
    let count = 0
    while (i <= middle) {
        if (args.indexOf(userInput) + i >= args.length) {
            winning.push(args[count])
            count++
        } else {
            winning.push(args[args.indexOf(userInput) + i])
        }
        i++
    }
    winning.shift()
    if (userInput === computerMove) {
        return 'd'
    } else if (winning.includes(computerMove)) {
        return 'v'
    } else {
        return 'l'
    }
}

function gameResult(output) {
    switch (output) {
        case 'v':
            console.log('You win!')
            break
        case 'd':
            console.log('Its a draw!')
            break
        default:
            console.log('You lose!')
            break
    }
}

function possibleGameResult(output) {
    switch (output) {
        case 'v':
            return 'Win'
        case 'd':
            return 'Draw'
        default:
            return 'Lose'
    }
}

function generateTable(args) {
    let result = []
    for (let i = 0; i < args.length; i++) {
        for (let j = 0; j < args.length; j++) {
            result.push(possibleGameResult(principles(args[i], args[j], args)))
        }
        result.push('')
    }
    return result
}

function showMenu(args) {
    let count = 0
    let hashTable = {}
    args.forEach(element => {
        console.log(`${++count} - ${element}`)
        hashTable[count] = element
    })
    console.log('0 - exit')
    console.log('? - help')
    hashTable[0] = 'exit'
    hashTable['?'] = 'help'

    return hashTable 
}

function askUser() {
    let response = readline.question('Choose your move: ')
    return response
}

function popMenu(args) {
    let obj = menu(args)
    while (!obj.hashTb?.hasOwnProperty(obj.answer)) {
        console.log('Wrong move, choose the one from the table!')
        obj = menu(args)
    }
    return obj
}

function menu(args) {
    let count = 0
    let hashTb = {}
    args.forEach(element => {
        console.log(`${++count} - ${element}`)
        hashTb[count] = element
    });
    console.log(`0 - exit`)
    console.log(`? - help`)
    hashTb[0] = 'exit'
    hashTb['?'] = 'help'

    let answer = askUser().toString();
    if (!(answer in hashTb)) {
        return 1
    }
    return { answer, hashTb }
}

function printHelp(args) {
    console.log('Help table for this round: ')
    let final_table = [
        ['v PC / User >', ...args],
    ];

    let finished_table = generateTable(args)
    let current_table = []
    let counter = 0

    for (let i = 0; i < finished_table.length; i++) {
        if (finished_table[i] !== '') {
            current_table.push(finished_table[i])
        } else {
            final_table.push([args[counter], ...current_table])
            current_table = []
            counter++
        }
    }

    console.log(table(final_table))
}

function start() {
    const args = process.argv.slice(2)

    if (args.length === 0) {
        console.log("You haven't entered any data")
        return
    }

    if (args.length === 1) {
        console.log('Number of args is incorrect, it should be odd and >1')
        return
    }

    if (args.length % 2 === 0) {
        console.log('Number of args is incorrect, it should be odd and >1')
        return
    }

    const duplicateElements = args.filter((item, index) => args.indexOf(item) !== index);
    if (duplicateElements.length) {
        console.log('There should not be duplicate elements')
        return
    }

    const key = generateKey()
    const compMove = computerMove(args)
    const hmacFinal = generateHmac(key, compMove)
    console.log(`HMAC: ${hmacFinal}`)

    let menuOptions = showMenu(args)
    let userChoice = askUser()

    while (!menuOptions.hasOwnProperty(userChoice)) {
        console.log('Incorrect move. Please choose your move from the list')
        userChoice = askUser()
    }

    if (userChoice === '0') {
        return
    } else if (userChoice === '?') {
        printHelp(args);
        menuOptions = showMenu(args)
        userChoice = askUser()
    }

    console.log(`Your move: ${menuOptions[userChoice]}`)
    console.log(`Computer move: ${compMove}`)

    const victoryResult = principles(menuOptions[userChoice], compMove, args)
    gameResult(victoryResult)
    console.log(`HMAC key: ${key}`)
}

start()
